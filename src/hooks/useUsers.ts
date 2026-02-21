import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { buildQueryString } from '@/lib/utils'
import type { PaginatedUsers, User } from '@/types'

type UserFilters = {
  page?: number
  pageSize?: number
  age?: number 
  minAge?: number 
  maxAge?: number 
}

async function fetchUsers(filters: UserFilters): Promise<PaginatedUsers> {
  const query = buildQueryString(filters as Record<string, string | number>)
  const res = await fetch(`/api/users?${query}`)
  if (!res.ok) throw new Error('Kullanıcılar yüklenemedi')
  return res.json()
}

async function fetchUser(userId: string): Promise<User> {
  const res = await fetch(`/api/users/${userId}`)
  if (!res.ok) throw new Error('Kullanıcı bulunamadı')
  return res.json()
}

async function createUser(data: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'> & { password: string }) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Kullanıcı eklenemedi')
  return result
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}