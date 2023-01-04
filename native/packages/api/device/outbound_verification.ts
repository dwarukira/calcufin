import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'

export const createOutboundVerificationCodeKey = () => {
  return ['createOutboundVerificationCode']
}

type CreateOutboundVerificationCodeRequest = {
  address: string
}

export const createOutboundVerificationCode = (
  { address }: CreateOutboundVerificationCodeRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<unknown>> => {
  return axios.post(`devices/outbound_verification/code`, { address }, options)
}

export const useCreateOutboundVerificationCode = <
  TError = AxiosError<unknown>,
  TContext = unknown
>(
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createOutboundVerificationCode>>,
    TError,
    { data: CreateOutboundVerificationCodeRequest },
    TContext
  >,
  options?: AxiosRequestConfig
) => {
  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createOutboundVerificationCode>>,
    { data: CreateOutboundVerificationCodeRequest }
  > = (props) => {
    const { data } = props ?? {}
    return createOutboundVerificationCode(data, options)
  }

  return useMutation<
    Awaited<ReturnType<typeof createOutboundVerificationCode>>,
    TError,
    { data: CreateOutboundVerificationCodeRequest },
    TContext
  >(mutationFn, mutation)
}

export const verifyOutboundVerificationCodeKey = () => {
  return ['verifyOutboundVerificationCode']
}

type VerifyOutboundVerificationCodeRequest = {
  code: string
  address: string
}

type VerifyOutboundVerificationCodeResponse = {
  auth_token: string
  user_id: string
}

export const verifyOutboundVerificationCode = (
  { code, address }: VerifyOutboundVerificationCodeRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<VerifyOutboundVerificationCodeResponse>> => {
  return axios.post(`devices/outbound_verification`, { code, address }, options)
}

export const useVerifyOutboundVerificationCode = <
  TError = AxiosError<unknown>,
  TContext = unknown
>(
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof verifyOutboundVerificationCode>>,
    TError,
    { data: VerifyOutboundVerificationCodeRequest },
    TContext
  >,
  options?: AxiosRequestConfig
) => {
  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof verifyOutboundVerificationCode>>,
    { data: VerifyOutboundVerificationCodeRequest }
  > = (props) => {
    const { data } = props ?? {}
    return verifyOutboundVerificationCode(data, options)
  }

  return useMutation<
    Awaited<ReturnType<typeof verifyOutboundVerificationCode>>,
    TError,
    { data: VerifyOutboundVerificationCodeRequest },
    TContext
  >(mutationFn, mutation)
}
