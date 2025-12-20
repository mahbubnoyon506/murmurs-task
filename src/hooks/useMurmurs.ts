import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useMurmurs = (page: number = 1) => {
  const queryClient = useQueryClient()

  // Fetch Timeline
  const timelineQuery = useQuery({
    queryKey: ['murmurs', page],
    queryFn: async () => {
      const { data } = await api.get(`/murmurs?page=${page}`)
      return data
    },
  })

  // Toggle Like Mutation
  const likeMutation = useMutation({
    mutationFn: async (murmurId: number) => {
      const { data } = await api.post(`/murmurs/${murmurId}/like`)
      return data
    },

    onMutate: async (murmurId) => {
      await queryClient.cancelQueries({ queryKey: ['murmurs'] })
      const previousData = queryClient.getQueryData(['murmurs', page])

      // Manually update the cache to show "Liked" instantly
      queryClient.setQueryData(['murmurs', page], (old: any) => ({
        ...old,
        data: old.data.map((m: any) =>
          m.id === murmurId ? { ...m, isLiked: !m.isLiked } : m,
        ),
      }))

      return { previousData }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['murmurs', page], context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['murmurs'] })
    },
  })

  return { timelineQuery, likeMutation }
}

export const useMurmurDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['murmur', id],
    queryFn: async () => {
      const { data } = await api.get(`/murmurs/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useCreateMurmur = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //Post murmur
    mutationFn: async (text: string) => {
      const { data } = await api.post('/me/murmurs', { text })
      return data
    },
    // Add to the top of the timeline instantly
    onMutate: async (newText) => {
      await queryClient.cancelQueries({ queryKey: ['murmurs'] })
      const previousMurmurs = queryClient.getQueryData(['murmurs', 1])

      queryClient.setQueryData(['murmurs', 1], (old: any) => {
        if (!old) return old
        const tempMurmur = {
          id: Date.now(),
          text: newText,
          createdAt: new Date().toISOString(),
          user: JSON.parse(localStorage.getItem('user') || '{}'),
          likes: [],
        }
        return {
          ...old,
          data: [tempMurmur, ...old.data].slice(0, 10), // Keep 10 per page
        }
      })

      return { previousMurmurs }
    },
    onError: (err, newText, context) => {
      queryClient.setQueryData(['murmurs', 1], context?.previousMurmurs)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['murmurs'] })
    },
  })
}
