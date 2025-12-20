import { useState } from 'react'
import { useCreateMurmur } from '../../hooks/useMurmurs'
import { Send, MessageSquare } from 'lucide-react'

export default function CreateMurmur() {
  const [text, setText] = useState('')
  const createMutation = useCreateMurmur()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    await createMutation.mutateAsync(text)
    setText('')
  }

  return (
    <div className="bg-white border border-gray-400  rounded-xl p-4 mb-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <textarea
            className="w-full p-2 text-lg border-none focus:outline-none resize-none placeholder-gray-400"
            placeholder="What's on your mind?"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-400 ">
          <span
            className={`text-sm ${text.length > 200 ? 'text-red-500' : 'text-gray-400'}`}
          >
            {text.length} characters
          </span>
          <button
            type="submit"
            disabled={!text.trim() || createMutation.isPending}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-5 py-2 rounded-full font-bold transition-colors"
          >
            {createMutation.isPending ? (
              'Posting...'
            ) : (
              <>
                <span>Murmur</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
