'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useCreateUser } from '@/hooks/useUsers'
import PageHeader from '@/components/dashboard/PageHeader'
import Link from 'next/link'

type AddUserFormData = {
  firstName: string
  lastName: string
  email: string
  username: string
  age: number
  password: string
}

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder:text-xs"

export default function AddUserPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateUser()
  const { register, handleSubmit, formState: { errors } } = useForm<AddUserFormData>()

  const onSubmit = (data: AddUserFormData) => {
    mutate(
      { ...data, age: Number(data.age) },
      { onSuccess: () => router.push('/dashboard') }
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <PageHeader title="Kullanıcı Ekle" description="Yeni bir kullanıcı oluşturun" />

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
              <input
                type="text"
                placeholder="Lütfen adınızı girin"
                {...register('firstName', { required: 'Ad gerekli' })}
                className={inputClass}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
              <input
                type="text"
                placeholder="Lütfen soyadınızı girin"
                {...register('lastName', { required: 'Soyad gerekli' })}
                className={inputClass}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Lütfen email adresinizi girin"
              {...register('email', {
                required: 'Email gerekli',
                pattern: { value: /^\S+@\S+$/i, message: 'Geçerli email girin' },
              })}
              className={inputClass}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                placeholder="Lütfen kullanıcı adınızı girin"
                {...register('username', {
                  required: 'Kullanıcı adı gerekli',
                  minLength: { value: 2, message: 'En az 2 karakter' },
                })}
                className={inputClass}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yaş</label>
              <input
                type="number"
                placeholder="Lütfen yaşınızı girin"
                {...register('age', {
                  required: 'Yaş gerekli',
                  min: { value: 1, message: 'Geçerli yaş girin' },
                  max: { value: 120, message: 'Geçerli yaş girin' },
                })}
                className={inputClass}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              placeholder="Lütfen şifrenizi girin"
              {...register('password', {
                required: 'Şifre gerekli',
                minLength: { value: 6, message: 'En az 6 karakter' },
              })}
              className={inputClass}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg">
              {error.message}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white text-xs font-medium py-2 rounded-lg transition"
            >
              {isPending ? 'Kaydediliyor...' : 'Kullanıcı Ekle'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 text-center py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}