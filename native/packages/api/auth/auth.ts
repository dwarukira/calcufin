import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { User } from '../models/user'

export const confirmedLoginKey = () => {
  return ['confirmedLogin']
}

type ConfirmedLoginRequest = {
  auth_token: string
}


type ConfirmedLoginResponse = {
    token: string
    user: User
}

 

export const confirmedLogin = (
  { auth_token }: ConfirmedLoginRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<ConfirmedLoginResponse>> => {
  return axios.post(
    `auth/access_tokens/confirmed_login`,
    { auth_token },
    options
  )
}

export const useConfirmedLogin = <
  TError = AxiosError<unknown>,
  TContext = unknown
>(
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof confirmedLogin>>,
    TError,
    { data: ConfirmedLoginRequest },
    TContext
  >,
  options?: AxiosRequestConfig
) => {
  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof confirmedLogin>>,
    { data: ConfirmedLoginRequest }
  > = (props) => {
    const { data } = props ?? {}
    return confirmedLogin(data, options)
  }
  return useMutation<
    Awaited<ReturnType<typeof confirmedLogin>>,
    TError,
    { data: ConfirmedLoginRequest },
    TContext
  >(mutationFn, mutation)
}
