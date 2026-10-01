import {
  authentication,
  type AuthenticationClient,
  createDirectus,
  type DirectusClient,
  rest,
  type RestClient,
} from '@directus/sdk'

export interface CreateDirectusClientOptions {
  url: string
  credentials?: RequestCredentials
}

export type LdDirectusClient<TSchema extends object> =
  DirectusClient<TSchema> & AuthenticationClient<TSchema> & RestClient<TSchema>

export function createDirectusClient<TSchema extends object>(
  options: CreateDirectusClientOptions,
): LdDirectusClient<TSchema> {
  const credentials = options.credentials ?? 'include'

  return createDirectus<TSchema>(options.url)
    .with(authentication('session', { credentials }))
    .with(rest({ credentials }))
}
