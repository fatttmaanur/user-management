export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  age: number
  role: string
  createdAt: string
  updatedAt: string
}

export type PaginatedUsers = {
  users: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ApiError = {
  error: string
  row?: number
}