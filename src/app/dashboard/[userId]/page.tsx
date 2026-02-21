'use client'

import { use } from 'react'
import { useUser } from '@/hooks/useUsers'
import PageHeader from '@/components/dashboard/PageHeader'

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const { data: user, isLoading, isError } = useUser(userId)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Yükleniyor...
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <div className="bg-red-50 text-red-600 rounded-xl border border-red-200 p-6 text-sm text-center">
          Kullanıcı bulunamadı.
        </div>
      </div>
    )
  }

  const details = [
    { label: 'Ad', value: user.firstName },
    { label: 'Soyad', value: user.lastName },
    { label: 'Kullanıcı Adı', value: `@${user.username}` },
    { label: 'Email', value: user.email },
    { label: 'Yaş', value: String(user.age) },
    { label: 'Rol', value: user.role },
    { label: 'Kayıt Tarihi', value: new Date(user.createdAt).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric',
    })},
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <PageHeader title="Kullanıcı Detayı" description="Kullanıcı bilgilerini görüntüleyin" />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-linear-to-r from-orange-300 to-orange-400 px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-orange-100 text-xs mt-0.5 truncate">@{user.username}</p>
          </div>
          <span className={`ml-auto shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
            user.role === 'admin' ? 'bg-white text-orange-500' : 'bg-white/20 text-white'
          }`}>
            {user.role}
          </span>
        </div>

        {/* Details */}
        <div className="divide-y divide-gray-100">
          {details.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">{label}</span>
              <span className="text-sm text-gray-400 text-right ml-4 truncate max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}