import React from 'react'
import { useAllUsers } from '../hooks/useProfile'
import api from '../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFollowing } from '../hooks/useFollowers'
import { UserMinus, UserPlus } from 'lucide-react'

export interface Following {
  username: string
  email: string
  id: string
  createdAt: typeof Date
}

interface Props {
  userId: number
}

const FollowUnfollow = ({ userId }: Props) => {
  const queryClient = useQueryClient()
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}')
  const { data: following } = useFollowing(loggedInUser.id)
  const isFollowing = following?.length
    ? following?.map((item: Following) => item.id)?.includes(userId)
    : false

  const followMutation = useMutation({
    mutationFn: async (id: number) => await api.post(`/users/${id}/follow`),
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: ['all-users'] })
      await queryClient.cancelQueries({
        queryKey: ['following', loggedInUser.id],
      })

      const previousUsers = queryClient.getQueryData(['all-users'])
      const previousFollowing = queryClient.getQueryData([
        'following',
        loggedInUser.id,
      ])

      queryClient.setQueryData(['all-users'], (old: any) => {
        return old?.map((user: any) =>
          user.id === targetUserId
            ? { ...user, isFollowed: !user.isFollowed }
            : user,
        )
      })

      queryClient.setQueryData(['following', loggedInUser.id], (old: any) => {
        const exists = old?.find((u: any) => u.id === targetUserId)
        if (exists) {
          return old.filter((u: any) => u.id !== targetUserId)
        }
        return [...(old || []), { id: targetUserId }]
      })

      return { previousUsers, previousFollowing }
    },
    onError: (err, id, context: any) => {
      queryClient.setQueryData(['all-users'], context?.previousUsers)
      queryClient.setQueryData(
        ['following', loggedInUser.id],
        context?.previousFollowing,
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return (
    <button
      onClick={() => followMutation.mutate(userId)}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all bg-blue-500 text-white hover:bg-blue-600 `}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" /> Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" /> Follow
        </>
      )}
    </button>
  )
}

export default FollowUnfollow
