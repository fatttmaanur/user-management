import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const excelUserSchema = z.object({
  name: z.string().min(1, 'Ad gerekli'),
  surname: z.string().min(1, 'Soyad gerekli'),
  email: z.string().email('Geçerli email gerekli'),
  age: z.number().min(1, 'Geçerli yaş gerekli').max(120, 'Geçerli yaş gerekli'),
  password: z.string().min(1, 'Şifre gerekli'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rows: Record<string, unknown>[] = body.rows

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Excel dosyası boş' }, { status: 400 })
    }

    // Tüm satırları validate et
    const validatedRows = []
    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 2 // Excel'de 1. satır header, veri 2. satırdan başlar

      const result = excelUserSchema.safeParse({
        ...rows[i],
        age: Number(rows[i].age),
      })

      if (!result.success) {
        return NextResponse.json(
          { error: `Satır ${rowNumber}: ${result.error.issues[0].message}` },
          { status: 400 }
        )
      }

      validatedRows.push({ ...result.data, rowNumber })
    }

    // Duplicate kontrolü — kendi içinde
    const emails = validatedRows.map((r) => r.email)
    const uniqueEmails = new Set(emails)
    if (uniqueEmails.size !== emails.length) {
      const duplicate = emails.find((e, i) => emails.indexOf(e) !== i)
      return NextResponse.json(
        { error: `Excel içinde duplicate email: ${duplicate}` },
        { status: 400 }
      )
    }

    // Duplicate kontrolü — veritabanında
    const existingUsers = await prisma.user.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    })

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: `Bu email zaten kayıtlı: ${existingUsers[0].email}` },
        { status: 409 }
      )
    }

    // Hepsi geçerliyse toplu ekle
    const hashedRows = await Promise.all(
      validatedRows.map(async (row) => ({
        firstName: row.name,
        lastName: row.surname,
        email: row.email,
        username: row.email.split('@')[0],
        age: row.age,
        password: await bcrypt.hash(String(row.password), 10),
      }))
    )

    await prisma.user.createMany({ data: hashedRows })

    return NextResponse.json({
      success: true,
      count: hashedRows.length,
      message: `${hashedRows.length} kullanıcı başarıyla eklendi`,
    })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}