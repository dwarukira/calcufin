import { Entypo } from '@expo/vector-icons'
import { Box, Button, Icon, Text, VStack } from 'native-base'
import { MotiLink } from 'solito/moti'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Terms() {
  return (
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
        justifyContent="space-between"
        borderTopRightRadius={{ base: '2xl', md: 'xl' }}
        borderBottomRightRadius={{ base: '0', md: 'xl' }}
        borderTopLeftRadius={{ base: '2xl', md: '0' }}
      >
        <VStack
          space="7"
          pt={10}
          justifyContent="space-between"
          w={'100%'}
          h={'100%'}
        >
          <VStack space="5" pt={32} px={8}>
            <Box>
              <Icon
                name="text-document"
                as={Entypo}
                size="50"
                color="primary.900"
                alignSelf="center"
              />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="coolGray.800"
                textAlign="center"
              >
                Terms and conditions
              </Text>
            </Box>

            <Text fontSize="lg" color="coolGray.600" textAlign="center">
              By proceeding, you agree to our{' '}
              <MotiLink href="https://google.com">
                <Text fontSize="lg" color="coolGray.600" textAlign="center">
                  Terms of Service
                </Text>
              </MotiLink>{' '}
              <Text fontSize="lg" color="coolGray.600" textAlign="center">
                and{' '}
              </Text>{' '}
              <MotiLink href="https://google.com">
                <Text fontSize="lg" color="coolGray.600" textAlign="center">
                  Privacy Policy
                </Text>
              </MotiLink>
            </Text>
            <Text fontSize="md" color="coolGray.600" textAlign="center">
              You aslo agree to shuleyangu to collect and use your information
              in order to provide the best experience on our platform.{' '}
              <MotiLink href="https://google.com">
                <Text
                  fontSize="md"
                  color="coolGray.600"
                  textAlign="center"
                  bold
                >
                  Learn more
                </Text>
              </MotiLink>
            </Text>
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
          >
            Accept
          </Button>
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  )
}
