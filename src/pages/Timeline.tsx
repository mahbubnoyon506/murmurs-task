import { useState } from 'react'
import { useMurmurs } from '../hooks/useMurmurs'
import CreateMurmur from '../components/murmurs/CreateMurmur'
import { Link } from 'react-router-dom'

export default function Timeline() {
  const [page, setPage] = useState(1)
  const { timelineQuery, likeMutation } = useMurmurs(page)

  if (timelineQuery.isLoading) return <div>Loading murmurs...</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>

      <CreateMurmur />

      <div className="space-y-4">
        {timelineQuery.data?.data.map((murmur: any) => (
          <div className="p-4 border border-gray-400  rounded-lg shadow-sm bg-white">
            <Link key={murmur.id} to={`/murmurs/${murmur.id}`}>
              <p className="text-gray-800">{murmur.text}</p>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>By {murmur.user.username}</span>
                <button
                  onClick={() => likeMutation.mutate(murmur.id)}
                  className={`px-3 py-1 rounded ${murmur.isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}
                >
                  ❤️ {murmur.likes?.length || 0}
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {timelineQuery.data?.totalPages}
        </span>
        <button
          disabled={page >= (timelineQuery.data?.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
