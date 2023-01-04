import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

export const getUserProfileByIdentifierKey = (identifier: string) => {
  return ['userProfileByIdentifier', identifier]
}

type UserProfileByIdentifierRequest = {
  identifier: string
}

type Needs = {
  password: boolean
  full_name: boolean
}
type IdentityResponse = {
  email: string
  needs: Needs
}

export const getUserProfileByIdentifier = (
  { identifier }: UserProfileByIdentifierRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<IdentityResponse>> => {
  return axios.get(`/profiles?identifier=${identifier}`, options)
}

export const useGetUserProfileByIdentifier = <
  TData = Awaited<ReturnType<typeof getUserProfileByIdentifier>>,
  TError = AxiosError<unknown>
>(
  identifier: string,
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUserProfileByIdentifier>>,
    TError,
    TData
  >,
  options?: AxiosRequestConfig
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = query ?? {}
  const queryKey =
    queryOptions?.queryKey ?? getUserProfileByIdentifierKey(identifier)
  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getUserProfileByIdentifier>>
  > = ({ signal }) =>
    getUserProfileByIdentifier({ identifier }, { signal, ...options })
  const reactQuery = useQuery<
    Awaited<ReturnType<typeof getUserProfileByIdentifier>>,
    TError,
    TData
  >(queryKey, queryFn, queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey
  }
  reactQuery.queryKey = queryKey
  return reactQuery
}
