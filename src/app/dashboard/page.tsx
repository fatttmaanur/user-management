'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useUsers } from '@/hooks/useUsers'
import UserTable from '@/components/dashboard/UserTable'
import UserFilters from '@/components/dashboard/UserFilters'
import Pagination from '@/components/ui/Pagination'
import Link from 'next/link'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1')
  const age = searchParams.get('age') ? parseInt(searchParams.get('age')!) : undefined
  const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!) : undefined
  const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!) : undefined

  const { data, isLoading, isError } = useUsers({ page, pageSize: 10, age, minAge, maxAge })

  const updateParams = (params: Record<string, string | number>) => {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === '' || value === undefined) current.delete(key)
      else current.set(key, String(value))
    })
    router.push(`/dashboard?${current.toString()}`)
  }

  const handleFilter = ({ age, minAge, maxAge }: { age: string; minAge: string; maxAge: string }) => {
    updateParams({
      age: age ? parseInt(age) : '',
      minAge: minAge ? parseInt(minAge) : '',
      maxAge: maxAge ? parseInt(maxAge) : '',
      page: 1,
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Kullanıcılar</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {data ? `Toplam ${data.total} kullanıcı` : ''}
          </p>
        </div>
        <Link
          href="/dashboard/add"
          className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition"
        >
          + Kullanıcı Ekle
        </Link>
      </div>
      <UserFilters
        defaultValues={{
          age: age?.toString() ?? '',
          minAge: minAge?.toString() ?? '',
          maxAge: maxAge?.toString() ?? '',
        }}
        onFilter={handleFilter}
      />

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Yükleniyor...
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 rounded-xl border border-red-200 p-6 text-sm text-center">
          Kullanıcılar yüklenirken hata oluştu.
        </div>
      )}

      {data && (
        <div className="overflow-x-auto">
          <UserTable users={data.users} />
        </div>
      )}
      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}