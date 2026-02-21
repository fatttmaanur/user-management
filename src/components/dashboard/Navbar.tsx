'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

async function logoutRequest() {
  const res = await fetch('/api/auth/logout', { method: 'POST' })
  if (!res.ok) throw new Error('Çıkış yapılamadı')
  return res.json()
}

const navLinks = [
  { href: '/dashboard', label: 'Kullanıcılar' },
  { href: '/dashboard/add', label: 'Kullanıcı Ekle' },
  { href: '/dashboard/addMany', label: 'Toplu Yükle' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => router.push('/'),
  })

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="px-4 sm:px-8 flex items-center justify-between">

        {/* Logo + Desktop Links */}
        <div className="flex items-center">
          <span className="text-lg font-bold text-orange-500 py-4 tracking-tight shrink-0 mr-8">
            UserManager
          </span>

          <div className="hidden sm:flex items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium px-4 py-5 border-b-2 transition-colors ${
                  pathname === href
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-orange-500 hover:border-orange-300'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="hidden sm:block text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium px-4 py-2 rounded-lg transition border border-orange-200"
          >
            {isPending ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-gray-500 hover:text-orange-500 transition p-2"
          >
            <div className="space-y-1">
              <span className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium px-3 py-2 rounded-lg transition ${
                pathname === href
                  ? 'bg-orange-50 text-orange-500'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-orange-500'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="w-full text-left text-sm font-medium px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-50 transition"
          >
            {isPending ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
          </button>
        </div>
      )}
    </nav>
  )
}