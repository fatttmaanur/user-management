import Link from 'next/link'
import type { User } from '@/types'

type UserTableProps = {
  users: User[]
}

export default function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
        Kullanıcı bulunamadı
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-6 py-3 font-medium text-gray-500">Ad Soyad</th>
            <th className="text-left px-6 py-3 font-medium text-gray-500">Kullanıcı Adı</th>
            <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
            <th className="text-left px-6 py-3 font-medium text-gray-500">Yaş</th>
            <th className="text-left px-6 py-3 font-medium text-gray-500">Rol</th>
            <th className="text-left px-6 py-3 font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-4 text-gray-600">{user.username}</td>
              <td className="px-6 py-4 text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-gray-600">{user.age}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/dashboard/${user.id}`}
                  className="text-orange-400 hover:text-orange-500 font-medium transition"
                >
                  Detay →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}