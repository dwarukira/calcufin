import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'

export const getCurrentUserKey = () => {
  return ['currentUser']
}

export const getCurrentUser = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<unknown>> => {
  return axios.get(`/user`, options)
}

export const useGetCurrentUser = <
  TError = AxiosError<unknown>,
  TData = Awaited<ReturnType<typeof getCurrentUser>>
>(
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getCurrentUser>>,
    TError,
    TData
  >,
  options?: AxiosRequestConfig
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = query ?? {}
  const queryKey = queryOptions?.queryKey ?? getCurrentUserKey()
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCurrentUser>>> = ({
    signal,
  }) => getCurrentUser({ signal, ...options })
  const reactQuery = useQuery<
    Awaited<ReturnType<typeof getCurrentUser>>,
    TError,
    TData
  >(queryKey, queryFn, queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey
  }
  return reactQuery
}

export const setCurrentPasswordKey = () => {
  return ['setCurrentPassword']
}

type SetCurrentPasswordRequest = {
  password: string
}

export const setCurrentPassword = (
  { password }: SetCurrentPasswordRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<unknown>> => {
  return axios.patch(`/user`, { password }, options)
}

export const useSetCurrentPassword = <
  TError = AxiosError<unknown>,
  TContext = unknown
>(
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof setCurrentPassword>>,
    TError,
    { data: SetCurrentPasswordRequest },
    TContext
  >,
  options?: AxiosRequestConfig
) => {
  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof setCurrentPassword>>,
    { data: SetCurrentPasswordRequest }
  > = (props) => {
    const { data } = props ?? {}
    return setCurrentPassword(data, options)
  }

  return useMutation<
    Awaited<ReturnType<typeof setCurrentPassword>>,
    TError,
    { data: SetCurrentPasswordRequest },
    TContext
  >(mutationFn, mutation)
}
