import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreatePassword from 'app/features/auth/create-password'
import Signin from 'app/features/auth/signin'
import Signup from 'app/features/auth/signup'
import Terms from 'app/features/auth/terms'
import Verify from 'app/features/auth/verify'
import React from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { AuthContext } from 'app/utils'
import { useConfirmedLogin } from 'api/auth/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from 'api/models/user'
import { HomeScreen } from 'app/features/home/screen'
import Splash from 'app/features/home/Splash'

export type RootStackParamList = {
  home: undefined
  signin: undefined
  signup: undefined
  verify: {
    value: string
    isEmail: boolean
  }
  terms: undefined
  'create-password': undefined
  'user-detail': {
    id: string
  }
  Splash: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AuthNavigation() {}

export function NativeNavigation() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            hasPassword: action.hasPassword,
            user: action.user,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            hasPassword: action.hasPassword,
            user: action.user,
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            hasPassword: false,
            user: null,
          }
      }
    },
    {
      isLoading: false,
      isSignout: false,
      userToken: null,
      hasPassword: false,
      user: null,
    }
  )

  const { mutateAsync: confirmedLogin } = useConfirmedLogin({
    onSuccess: async (data) => {
      let userToken = await SecureStore.getItemAsync('auth_token')
      dispatch({
        type: 'SIGN_IN',
        token: userToken,
        hasPassword: data?.data?.user.has_password,
        user: data?.data?.user,
      })

      AsyncStorage.setItem('user', JSON.stringify(data?.data?.user))
    },
  })

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken

      try {
        // SecureStore.deleteItemAsync('auth_token')
        userToken = await SecureStore.getItemAsync('auth_token')
        const user: any = confirmedLogin({
          data: {
            auth_token: userToken,
          },
        })

        axios.interceptors.request.use(async (config) => ({
          ...config,
          headers: {
            ...(config.headers as object),
            Authorization: `Bearer ${userToken}` as string,
          },
        }))
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.

      const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}')
      if (user.id) {
        dispatch({
          type: 'RESTORE_TOKEN',
          token: userToken,
          hasPassword: user.has_password,
        })
      }
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async (authToken) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        SecureStore.deleteItemAsync('auth_token')
        SecureStore.setItemAsync('auth_token', authToken)
        await axios.interceptors.request.use(async (config) => ({
          ...config,
          headers: {
            ...(config.headers as object),
            Authorization: `Bearer ${authToken}` as string,
          },
        }))

        confirmedLogin({
          data: {
            auth_token: authToken,
          },
        })
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userToken')
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async ({ authToken }) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        SecureStore.setItemAsync('auth_token', authToken)
        dispatch({ type: 'SIGN_IN', token: authToken })
      },
      getProfile: () => {
      
        return state.user 
      },
    }),
    [state.user]
  )

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {state.isLoading && (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={Splash} />
        )}
        {state.userToken == null ? (
          <Stack.Group>
            <Stack.Screen
              name="signin"
              component={Signin}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="signup"
              component={Signup}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="verify"
              component={Verify}
              options={{ headerShown: false, presentation: 'modal' }}
            />

            <Stack.Screen
              name="terms"
              component={Terms}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            {!state.hasPassword ? (
              <Stack.Screen
                name="create-password"
                component={CreatePassword}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  )
}
