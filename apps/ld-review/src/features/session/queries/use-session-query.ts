import { useQuery } from '@tanstack/react-query'
import { getSessionApi } from '../api'
import { sessionKeys } from './session.keys'

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionKeys.current(),
    queryFn: () => getSessionApi().read(),
  })
}
