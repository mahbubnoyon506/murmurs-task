import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { User, Users, Trash2, Calendar } from 'lucide-react'
import FollowingList from '../components/users/FollowingList'
import FollowersList from '../components/users/FollowersList'

import FollowUnfollow from '../components/FollowUnfollow'

export default function Profile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { profileQuery } = useProfile(id)
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isOwnProfile = loggedInUser.id === Number(id)

  //Delete own murmur
  const deleteMutation = useMutation({
    mutationFn: async (murmurId: number) => {
      await api.delete(`/me/murmurs/${murmurId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] })
    },
  })

  if (profileQuery.isLoading)
    return <div className="p-8 text-center">Loading profile...</div>
  const user = profileQuery.data

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header Section */}
      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-4 rounded-full">
              <User className="w-12 h-12 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                Joined Murmur
              </div>
            </div>
          </div>

          {!isOwnProfile && <FollowUnfollow userId={user.id} />}
        </div>

        {/* Stats Section */}
        <div className="flex space-x-6 mt-6 pt-6 border-t border-gray-400">
          <div className="flex items-center space-x-1">
            <span className="font-bold">{user.followCount}</span>
            <span className="text-gray-500">Following</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-bold">{user.followedCount}</span>
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold px-2">Murmurs</h2>
          {user.murmurs.length
            ? user.murmurs?.map((murmur: any) => (
                <div
                  key={murmur.id}
                  className="bg-white border border-gray-400  rounded-xl p-4 shadow-sm flex justify-between items-start cursor-pointer"
                  onClick={() => navigate(`/murmurs/${murmur.id}`)}
                >
                  <p className="text-gray-800">{murmur.text}</p>
                  {isOwnProfile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMutation.mutate(murmur.id)
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))
            : null}
        </div>

        <div className="space-y-4 md:mt-7">
          <FollowingList userId={id} />
        </div>
        <div className="space-y-4 md:mt-7">
          <FollowersList userId={id} />
        </div>
      </div>
    </div>
  )
}
