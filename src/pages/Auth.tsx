import { useState } from 'react'
import { authService } from '../services/auth.service'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await authService.login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        await authService.register(formData)
        setIsLogin(true)
      }
      navigate('/')
    } catch (err) {
      alert('Authentication failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-center">
          {isLogin ? 'Login to Murmur' : 'Create Account'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-blue-500 underline"
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}
