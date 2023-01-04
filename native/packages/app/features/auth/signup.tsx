import React from 'react'
import type { RouteProp } from '@react-navigation/native'
import {
  Box,
  Center,
  Hidden,
  HStack,
  Icon,
  IconButton,
  StatusBar,
  VStack,
  Text,
  Stack,
  useColorModeValue,
  Button,
  Divider,
  Pressable,
  Modal,
  Spinner,
} from 'native-base'
import { Actionsheet } from 'native-base'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FloatingLabelInput from 'app/design/FloatingLabelInput'
import IconGoogle from 'app/design/IconGoogle'
import { MotiLink } from 'solito/moti'
import { RootStackParamList } from 'app/navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useGetUserProfileByIdentifier } from 'api/profile/profile'
import { useCreateOutboundVerificationCode } from 'api/device/outbound_verification'
import Loader from 'app/design/Loader'

type SignUpProps = NativeStackScreenProps<RootStackParamList, 'signup'>

export function SignUpForm({ navigation }: SignUpProps) {
  const [phoneOrEmail, setPhoneOrEmail] = React.useState('')

  const { mutate: createOutboundVerificationCode, isLoading } =
    useCreateOutboundVerificationCode({
      onSuccess: (data) => {
        navigation.navigate({
          name: 'verify',
          params: {
            isEmail: phoneOrEmail.includes('@'),
            value: phoneOrEmail,
          },
        })
      },
    })

  const { data, isError, error, isFetching, refetch } =
    useGetUserProfileByIdentifier(phoneOrEmail, {
      enabled: false,
      onSuccess: (data) => {
        createOutboundVerificationCode({
          data: {
            address: phoneOrEmail,
          },
        })
      },
    })

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ flex: 1 }}
    >
      <Loader isLoading={isLoading || isFetching} />
      <VStack
        flex="1"
        px="6"
        py="9"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        space="3"
        justifyContent="space-between"
        borderTopRightRadius={{ base: '2xl', md: 'xl' }}
        borderBottomRightRadius={{ base: '0', md: 'xl' }}
        borderTopLeftRadius={{ base: '2xl', md: '0' }}
      >
        <VStack space="3">
          <VStack space={{ base: '7', md: '4' }}>
            <FloatingLabelInput
              isRequired
              label="Email or Phone number"
              labelColor="#9ca3af"
              labelBGColor={useColorModeValue('#fff', '#1f2937')}
              borderRadius="4"
              defaultValue={phoneOrEmail}
              onChangeText={(txt: any) => setPhoneOrEmail(txt)}
              size="2xl"
              type="email"
              keyBoardType="email-address"
              _text={{
                fontSize: 'sm',
                fontWeight: 'medium',
              }}
              _dark={{
                borderColor: 'coolGray.700',
              }}
              _light={{
                borderColor: 'coolGray.300',
              }}
            />
          </VStack>

          {/* Opening Link Tag navigateTo:"OTP" (react/Router) */}
          <Button
            mt="5"
            size="md"
            borderRadius="4"
            _text={{
              fontWeight: 'medium',
            }}
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.700',
            }}
            onPress={() => {
              refetch()
            }}
          >
            Next
          </Button>
          {/* Closing Link Tag (react/Router) */}
          <HStack
            mt="5"
            space="2"
            mb={{ base: 6, md: 7 }}
            alignItems="center"
            justifyContent="center"
          >
            <Divider
              w="30%"
              _light={{ bg: 'coolGray.200' }}
              _dark={{ bg: 'coolGray.700' }}
            ></Divider>
            <Text
              fontWeight="medium"
              _light={{ color: 'coolGray.300' }}
              _dark={{ color: 'coolGray.500' }}
            >
              or
            </Text>
            <Divider
              w="30%"
              _light={{ bg: 'coolGray.200' }}
              _dark={{ bg: 'coolGray.700' }}
            ></Divider>
          </HStack>
          <Pressable>
            <Button
              size="md"
              borderRadius="4"
              _text={{
                fontWeight: 'medium',
                color: 'primary.900',
              }}
              _light={{
                bg: 'white',
              }}
              _pressed={{
                bg: 'gray.100',
                _text: {
                  color: 'white',
                },
              }}
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 0.1,
                },
                shadowOpacity: 0.23,
                shadowRadius: 0.84,
                elevation: 1,
              }}
              _dark={{
                bg: 'coolGray.800',
              }}
              borderColor="coolGray.200"
              borderWidth="1"
              width="100%"
            >
              <HStack space="2" alignItems="center">
                <IconGoogle />
                <Text>SIGN UP WITH GOOGLE</Text>
              </HStack>
            </Button>
          </Pressable>
        </VStack>

        <HStack
          mb="4"
          space="1"
          safeAreaBottom
          alignItems="center"
          justifyContent="center"
          mt={{ base: 'auto', md: '8' }}
        >
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Already have an account?
          </Text>
          <MotiLink href="/signin" animate={{ opacity: 1 }}>
            <Text
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
              fontWeight="bold"
            >
              Sign in
            </Text>
          </MotiLink>
        </HStack>
      </VStack>
    </KeyboardAwareScrollView>
  )
}

export default function Signup(props: SignUpProps) {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{ bg: 'primary.900' }}
        _dark={{ bg: 'coolGray.900' }}
      />

      <Center
        my="auto"
        _dark={{ bg: 'coolGray.900' }}
        _light={{ bg: 'primary.900' }}
        flex="1"
      >
        <Stack
          flexDirection={{ base: 'column', md: 'row' }}
          w="100%"
          maxW={{ md: '1016px' }}
          flex={{ base: '1', md: 'none' }}
        >
          <Center>
            <VStack
              space="3"
              alignItems="center"
              justifyContent="center"
              _light={{ bg: 'primary.900' }}
              _dark={{ bg: 'coolGray.900' }}
              px="6"
              py="9"
            >
              <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
                Shule yangu
              </Text>
              <Text fontSize="xl" color="coolGray.50">
                Create an account to get started
              </Text>
            </VStack>
          </Center>
          <SignUpForm {...props} />
        </Stack>
      </Center>
    </>
  )
}
