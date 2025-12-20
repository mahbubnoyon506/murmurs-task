import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { UserPlus, UserMinus, Search, PersonStanding } from 'lucide-react'
import { useFollowing } from '../hooks/useFollowers'

interface Following {
  username: string
  email: string
  id: string
  createdAt: typeof Date
}

export default function Discover() {
  const queryClient = useQueryClient()
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}')
  const { data: following } = useFollowing(loggedInUser.id)
  const followingIds = following?.map((item: Following) => item.id)

  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data } = await api.get('/users/all')
      return data
    },
  })

  const followMutation = useMutation({
    mutationFn: async (id: number) => await api.post(`/users/${id}/follow`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['all-users', 'profile'] }),
  })

  if (isLoading) return <div className="p-8 text-center">Finding users...</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PersonStanding className="w-6 h-6 text-blue-500" /> Discover People
      </h1>
      <div className="bg-white border border-gray-400 rounded-xl divide-y divide-gray-400 shadow-sm">
        {users?.map((user: any) => (
          <div
            key={user.id}
            className="p-4 flex items-center justify-between  transition-colors"
          >
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center space-x-3 flex-1"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <span className="font-medium text-gray-900">{user.username}</span>
            </Link>

            <button
              onClick={() => followMutation.mutate(user.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                user.isFollowed
                  ? 'border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {followingIds.includes(user.id) ? (
                <>
                  <UserMinus className="w-4 h-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Follow
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
