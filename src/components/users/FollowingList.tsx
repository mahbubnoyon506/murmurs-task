import { Link } from 'react-router-dom'
import { UserCheck } from 'lucide-react'
import { useFollowing } from '../../hooks/useFollowers'

export default function FollowingList({
  userId,
}: {
  userId: string | undefined
}) {
  const { data: following, isLoading } = useFollowing(userId)

  if (isLoading) return <div className="p-4 text-center">Loading...</div>

  return (
    <div className="bg-white border border-gray-400 rounded-xl overflow-hidden shadow-sm mt-4">
      <div className="p-4 border-b border-gray-400  bg-gray-50 font-bold flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-green-500" /> Following
      </div>
      <div className="divide-y divide-gray-400">
        {following?.map((user: any) => (
          <Link
            key={user.id}
            to={`/profile/${user.id}`}
            className="flex items-center p-3 hover:bg-gray-50"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium">{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
