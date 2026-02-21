'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import * as XLSX from 'xlsx'
import PageHeader from '@/components/dashboard/PageHeader'
import { excelRowSchema } from '@/lib/excelSchema'

type ExcelRow = {
  name: string
  surname: string
  email: string
  age: number
  password: string
}

type PreviewState = {
  rows: ExcelRow[]
  fileName: string
}

const requiredColumns = ['name', 'surname', 'email', 'age', 'password']
const previewHeaders = ['#', 'Ad', 'Soyad', 'Email', 'Yaş', 'Şifre']

async function uploadUsers(rows: ExcelRow[]) {
  const res = await fetch('/api/users/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Yükleme başarısız')
  return result
}

export default function AddManyPage() {
  const router = useRouter()
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [fileError, setFileError] = useState('')

  const { mutate, isPending, error, isSuccess, data } = useMutation({
    mutationFn: uploadUsers,
    onSuccess: () => setTimeout(() => router.push('/dashboard'), 1500),
  })

 const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFileError('')
  setPreview(null)
  const file = e.target.files?.[0]
  if (!file) return

  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]

  if (!validTypes.includes(file.type)) {
    setFileError('Sadece .xlsx veya .xls dosyası yükleyebilirsiniz')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const bytes = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(bytes, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet)

      if (rows.length === 0) {
        setFileError('Excel dosyası boş')
        return
      }

      const missingColumns = requiredColumns.filter((col) => !(col in rows[0]))
      if (missingColumns.length > 0) {
        setFileError(`Eksik kolonlar: ${missingColumns.join(', ')}`)
        return
      }

      // Zod ile her satırı validate et
      for (let i = 0; i < rows.length; i++) {
        const result = excelRowSchema.safeParse({
          ...rows[i],
          age: Number(rows[i].age),
        })
        if (!result.success) {
          setFileError(`Satır ${i + 2}: ${result.error.issues[0].message}`)
          return
        }
      }

      setPreview({ rows, fileName: file.name })
    } catch {
      setFileError('Dosya okunamadı')
    }
  }
  reader.readAsArrayBuffer(file)
}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <PageHeader title="Toplu Kullanıcı Yükle" description="Excel dosyası ile kullanıcıları toplu ekleyin" />
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 w-full">
        <p className="text-sm font-medium text-orange-600 mb-2">📋 Excel Dosyası Formatı</p>
        <div className="overflow-x-auto">
          <table className="text-xs text-orange-600 w-full">
            <thead>
              <tr className="border-b border-orange-200">
                {requiredColumns.map((col) => (
                  <th key={col} className="text-left py-1.5 pr-6 font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {['John', 'Doe', 'johndoe@example.com', '25', '123456'].map((val) => (
                  <td key={val} className="py-1.5 pr-6">{val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-xl p-8 sm:p-10 text-center cursor-pointer transition">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm font-medium text-gray-700">Excel dosyası seçin</p>
            <p className="text-xs text-gray-400 mt-1">.xlsx veya .xls</p>
          </div>
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} className="hidden" />
        </label>
        {fileError && (
          <div className="mt-4 bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg">
            ❌ {fileError}
          </div>
        )}
      </div>
      {preview && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{preview.fileName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{preview.rows.length} kullanıcı bulundu</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {previewHeaders.map((h) => (
                    <th key={h} className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 text-gray-400">{i + 2}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-900">{row.name}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-500">{row.surname}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-500">{row.email}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-500">{row.age}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-400">••••••</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg mb-6">
          ❌ {error.message}
        </div>
      )}
      {isSuccess && (
        <div className="bg-green-50 text-green-700 text-xs px-4 py-3 rounded-lg mb-6">
          ✅ {data.message} — Dashboarda yönlendiriliyorsunuz...
        </div>
      )}
      {preview && !isSuccess && (
        <button
          onClick={() => mutate(preview.rows)}
          disabled={isPending}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
        >
          {isPending ? 'Yükleniyor...' : `${preview.rows.length} Kullanıcıyı Yükle`}
        </button>
      )}
    </div>
  )
}