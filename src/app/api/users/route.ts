import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createUserSchema = z.object({
  firstName: z.string().min(1, 'Ad gerekli'),
  lastName: z.string().min(1, 'Soyad gerekli'),
  email: z.string().email('Geçerli email girin'),
  username: z.string().min(2, 'Kullanıcı adı en az 2 karakter olmalı'),
  age: z.number().min(1, 'Yaş gerekli').max(120, 'Geçerli yaş girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

// GET — kullanıcı listesi (sayfalama + yaş filtresi)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const age = searchParams.get('age')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')

    const where: Record<string, unknown> = {}
    
    if (age) {
      where.age = parseInt(age)
    } else if (minAge || maxAge) {
      where.age = {
        ...(minAge ? { gte: parseInt(minAge) } : {}),
        ...(maxAge ? { lte: parseInt(maxAge) } : {}),
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
          age: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST — yeni kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createUserSchema.parse(body)

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu email veya kullanıcı adı zaten kullanımda' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        age: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}