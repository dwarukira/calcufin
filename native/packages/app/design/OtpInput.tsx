import { TextField, View } from 'native-base'

export function OtpInput() {
  return (
    <View>
      <TextField
        keyboardType="number-pad"
        maxLength={1}
        textAlign="center"
        fontSize="3xl"
        w="16"
        h="16"
        borderRadius="full"
        borderWidth={1}
        borderColor="coolGray.300"
        _dark={{
          borderColor: 'coolGray.700',
        }}
        _light={{
          borderColor: 'coolGray.300',
        }}
      />
    </View>
  )
}

export default OtpInput
