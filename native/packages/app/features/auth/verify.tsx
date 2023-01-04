import { MaterialIcons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useVerifyOutboundVerificationCode } from 'api/device/outbound_verification'
import Loader from 'app/design/Loader'
import Otp from 'app/design/Otp'
import { RootStackParamList } from 'app/navigation/native'
import * as SecureStore from 'expo-secure-store'
import { Icon, Text, VStack } from 'native-base'
import { AuthContext } from 'app/utils'
import React from 'react'
import { useConfirmedLogin } from 'api/auth/auth'
import axios from 'axios'

type VerifyProps = NativeStackScreenProps<RootStackParamList, 'verify'>

export default function Verify({ route, navigation }: VerifyProps) {
  const { value, isEmail } = route.params
  const { signIn } = React.useContext(AuthContext)

  const { mutateAsync: confirmedLogin } = useConfirmedLogin({
    onSuccess: async (data) => {
      console.log(data.data.token)

      await signIn(data.data.token)
      navigation.navigate('create-password')
    },
  })
  const { mutate: verifyOutboundVerificationCode, isLoading } =
    useVerifyOutboundVerificationCode({
      onSuccess: async (data) => {
        let auth_token = data.data.auth_token
        await SecureStore.setItemAsync('auth_token', auth_token)

        axios.interceptors.request.use(
          async (config) => ({
            ...config,
            headers: {
              ...(config.headers as any),
              Authorization: `Bearer ${data.data.auth_token}`,
            },
          }),
          (error) => {
            Promise.reject(error)
          }
        )
        await signIn(auth_token)

        await confirmedLogin({
          data: {
            auth_token,
          },
        })
      },
    })

  return (
    <>
      <Loader isLoading={isLoading} />
      <VStack space="3" alignItems="center" pt={10} px={8}>
        <Icon name="email" as={MaterialIcons} size="50" color="primary.900" />

        <Text fontSize="xl" fontWeight="bold">
          Verify your {isEmail ? 'email' : 'phone number'}
        </Text>

        <Text fontSize="lg" color="coolGray.600" textAlign="center">
          To confirm your account, enter 4-digit code sent to{' '}
          <Text fontWeight="bold" color="primary.900">
            {value}
          </Text>
        </Text>

        <Otp
          length={4}
          handleChange={(code) => {
            if (code.length === 4) {
              verifyOutboundVerificationCode({
                data: {
                  code,
                  address: value,
                },
              })
            }
          }}
        />

        <Text fontSize="lg" color="coolGray.600" textAlign="center">
          Didn't receive the code?{' '}
          <Text color="primary.500" fontWeight="bold">
            Resend
          </Text>
        </Text>
      </VStack>
    </>
  )
}
