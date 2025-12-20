import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export const useFollowers = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}/followers`)
      return data
    },
    enabled: !!userId,
  })
}

export const useFollowing = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}/following`)
      return data
    },
    enabled: !!userId,
  })
}
