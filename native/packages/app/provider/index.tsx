import { NativeBaseProvider, extendTheme } from 'native-base'
import { NavigationProvider } from './navigation'
import { SafeArea } from './safe-area'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AxiosServices from 'api/utils/axios'

const theme = extendTheme({})

const queryClient = new QueryClient()

AxiosServices()

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeArea>
        <NavigationProvider>
          <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>
        </NavigationProvider>
      </SafeArea>
    </QueryClientProvider>
  )
}
