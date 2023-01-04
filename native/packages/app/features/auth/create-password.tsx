import { AntDesign, Entypo } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import FloatingLabelInput from 'app/design/FloatingLabelInput'
import { RootStackParamList } from 'app/navigation/native'
import {
  Button,
  Icon,
  IconButton,
  StatusBar,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSetCurrentPassword } from 'api/profile/user'
type Props = NativeStackScreenProps<RootStackParamList, 'create-password'>

export default function CreatePassword({ navigation }: Props) {
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = React.useState(false)
  const { mutateAsync: setCurrentPassword } = useSetCurrentPassword({
    onSuccess: (data) => {
      navigation.navigate('terms')
      console.log('data', data)
    },
  })
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{ flex: 1 }}
      >
        <VStack
          flex="1"
          px="6"
          py="9"
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          space="3"
          justifyContent="center"
          borderTopRightRadius={{ base: '2xl', md: 'xl' }}
          borderBottomRightRadius={{ base: '0', md: 'xl' }}
          borderTopLeftRadius={{ base: '2xl', md: '0' }}
        >
          <VStack space="7">
            <VStack space="3" alignItems="center">
              <Icon size="12" as={AntDesign} name="lock" color="primary.900" />
              <Text fontSize="2xl" fontWeight="bold" color="coolGray.800">
                Create a password
              </Text>
              <Text fontSize="sm" color="coolGray.600">
                Your password must be at least 8 characters long.
              </Text>
            </VStack>

            <VStack>
              <VStack space="3">
                <VStack space={{ base: '7', md: '4' }}>
                  <FloatingLabelInput
                    isRequired
                    type={showPass ? '' : 'password'}
                    label="Password"
                    borderRadius="4"
                    labelColor="#9ca3af"
                    labelBGColor={useColorModeValue('#fff', '#1f2937')}
                    defaultValue={pass}
                    onChangeText={(txt: any) => setPass(txt)}
                    size="2xl"
                    name="password"
                    autoFocus
                    InputRightElement={
                      <IconButton
                        variant="unstyled"
                        icon={
                          <Icon
                            size="4"
                            color="coolGray.400"
                            as={Entypo}
                            name={showPass ? 'eye-with-line' : 'eye'}
                          />
                        }
                        onPress={() => {
                          setShowPass(true)
                        }}
                      />
                    }
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
                  onPress={async () => {
                    await setCurrentPassword({
                      data: {
                        password: pass,
                      },
                    })
                  }}
                >
                  Next
                </Button>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </KeyboardAwareScrollView>
    </>
  )
}
