'use client'

import { useForm } from 'react-hook-form'

type FilterFormData = {
  age: string
  minAge: string
  maxAge: string
}

type UserFiltersProps = {
  defaultValues: FilterFormData
  onFilter: (data: FilterFormData) => void
}

const inputClass = "w-16 sm:w-20 px-2 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"

const filters = [
  { label: 'Yaş', name: 'age' },
  { label: 'Min Yaş', name: 'minAge' },
  { label: 'Max Yaş', name: 'maxAge' },
] as const

export default function UserFilters({ defaultValues, onFilter }: UserFiltersProps) {
  const { register, handleSubmit, reset } = useForm<FilterFormData>({ defaultValues })

  const onReset = () => {
    reset({ age: '', minAge: '', maxAge: '' })
    onFilter({ age: '', minAge: '', maxAge: '' })
  }

  return (
    <form
      onSubmit={handleSubmit(onFilter)}
      className="bg-white rounded-xl border border-gray-200 p-3 flex flex-wrap items-end gap-2 sm:gap-3"
    >
      {filters.map(({ label, name }) => (
        <div key={name}>
          <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
          <input
            type="number"
            {...register(name)}
            className={inputClass}
          />
        </div>
      ))}

      <button
        type="submit"
        className="px-3 py-1.5 text-xs bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg transition"
      >
        Filtrele
      </button>
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition"
      >
        Temizle
      </button>
    </form>
  )
}