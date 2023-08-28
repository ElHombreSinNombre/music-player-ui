import type React from 'react'
import SearchIcon from './Icons/Search'

interface InputProps {
  name?: string
  placeholder?: string
  onChange?: (value: string | number) => void
  icon?: boolean
  full?: boolean
  type?: string
  value?: number | string
  max?: number
  min?: number
  step?: number
  title?: string
}
export default function Input({
  name,
  placeholder,
  icon = false,
  min,
  full = false,
  max,
  value,
  step,
  title,
  type = 'text',
  onChange
}: InputProps) {
  const change = (value: string | number) => {
    if (onChange != null) onChange(value)
  }
  return (
    <section className={`relative ${full ? 'w-full' : ''}`}>
      {icon && (
        <article className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <SearchIcon className='text-white' />
        </article>
      )}
      <input
        title={title}
        type={type}
        onChange={(event) => {
          const value =
            type === 'number' ? event.target.valueAsNumber : event.target.value
          change(value)
        }}
        name={name}
        value={value}
        step={step}
        max={max}
        min={min}
        placeholder={placeholder}
        className={`input ${icon ? 'pl-10' : ''} ${
          !full ? 'cursor-pointer' : ''
        } ${type !== 'range' ? 'py-4 px-4' : ''}`}
      />
    </section>
  )
}
