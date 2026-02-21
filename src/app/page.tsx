'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

type LoginFormData = {
  username: string
  password: string
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition placeholder:text-xs"

async function loginRequest(data: LoginFormData) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Bir hata oluştu')
  return result
}

export default function LoginPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginRequest,
    onSuccess: () => router.push('/dashboard'),
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hoş Geldiniz</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              placeholder="Lütfen kullanıcı adınızı girin"
              {...register('username', { required: 'Kullanıcı adı gerekli' })}
              className={inputClass}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              placeholder="Lütfen şifrenizi girin"
              {...register('password', { required: 'Şifre gerekli' })}
              className={inputClass}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg">
              {error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white text-sm font-semibold py-3 rounded-lg transition mt-2"
          >
            {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}