import { z } from 'zod'

export const excelRowSchema = z.object({
  name: z.string().min(1, 'Ad boş olamaz'),
  surname: z.string().min(1, 'Soyad boş olamaz'),
  email: z.string().email('Geçerli email gerekli'),
  age: z.number().min(1, 'Yaş en az 1 olmalı').max(120, 'Yaş en fazla 120 olmalı'),
  password: z.string().min(1, 'Şifre boş olamaz'),
})

export type ExcelRow = z.infer<typeof excelRowSchema>