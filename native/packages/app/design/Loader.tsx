import { Box, Spinner, useColorModeValue } from 'native-base'
import React from 'react'

export default function Loader({ isLoading }: { isLoading: boolean }) {
  return (
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
      display={isLoading ? 'flex' : 'none'}
    >
      <Spinner accessibilityLabel="Sending code" color={'primary.50'} />
    </Box>
  )
}
