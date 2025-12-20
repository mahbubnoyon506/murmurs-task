import { Link } from 'react-router-dom'
import { PersonStanding } from 'lucide-react'
import {} from '../hooks/useFollowers'
import { useAllUsers } from '../hooks/useProfile'
import FollowUnfollow from '../components/FollowUnfollow'

export default function Discover() {
  const { data: users, isLoading } = useAllUsers()

  if (isLoading) return <div className="p-8 text-center">Finding users...</div>

  return (
    <>
      {users.length ? (
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
                    {user?.username ? user?.username[0]?.toUpperCase() : ''}
                  </div>
                  <span className="font-medium text-gray-900">
                    {user?.username ? user?.username : ''}
                  </span>
                </Link>
                <FollowUnfollow userId={user.id} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center flex justify-center items-center h-screen">
          <p>No data found</p>
        </div>
      )}
    </>
  )
}
