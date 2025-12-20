import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMurmurDetail, useMurmurs } from '../hooks/useMurmurs'
import { ArrowLeft, Heart, User, Calendar } from 'lucide-react'

export default function MurmurDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: murmur, isLoading } = useMurmurDetail(id)
  const { likeMutation } = useMurmurs()

  if (isLoading) return <div className="p-8 text-center">Loading murmur...</div>
  if (!murmur) return <div className="p-8 text-center">Murmur not found.</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="bg-white border border-gray-400 rounded-2xl p-6 shadow-sm">
        {/* User Info Header */}
        <Link
          to={`/profile/${murmur.user.id}`}
          className="flex items-center space-x-3 mb-4 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-lg group-hover:underline">
              {murmur.user.username}
            </p>
            <p className="text-gray-500 text-sm flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(murmur.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>

        {/* Content */}
        <p className="text-xl text-gray-800 leading-relaxed mb-6">
          {murmur.text}
        </p>

        <div className="pt-4 border-t border-gray-400 flex items-center justify-between">
          <button
            onClick={() => likeMutation.mutate(murmur.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              murmur.isLiked
                ? 'bg-red-50 text-red-600'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <span className="font-bold text-lg">
              ❤️ {murmur.likes?.length || 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
