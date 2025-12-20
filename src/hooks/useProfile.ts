import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useProfile = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  // User Detail (name, followCount, followedCount, murmurs)
  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`)
      return data
    },
    enabled: !!userId,
  })

  // Follow/Unfollow logic
  const followMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/users/${id}/follow`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  return { profileQuery, followMutation }
}
