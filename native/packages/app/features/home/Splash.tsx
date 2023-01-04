import { Box, Spinner, View, useColorModeValue } from 'native-base'
import React from 'react'

export default function Splash() {
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Box
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
        backgroundColor={useColorModeValue('black', 'coolGray.100')}
        opacity={0.4}
        height="100%"
        width="100%"
        zIndex={100}
      >
        fdsfdsfds ghjkhytgh
        <Spinner accessibilityLabel="Sending code" color={'primary.50'} />
      </Box>
    </View>
  )
}
