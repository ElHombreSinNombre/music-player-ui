import type React from 'react'
import SearchIcon from '../components/Icons/Search'

interface InputProps {
  name?: string
  placeholder?: string
  onChange?: (value: string | number) => void
  icon?: boolean
  full?: boolean
  type?: 'text' | 'range'
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
        <article className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none '>
          <SearchIcon className='text-color' />
        </article>
      )}
      <input
        data-testid='input'
        title={title}
        type={type}
        onChange={(event) => {
          change(event.target.value)
        }}
        name={name}
        value={value}
        step={step}
        max={max}
        min={min}
        placeholder={placeholder}
        className={`input ${icon ? 'pl-10' : ''} ${
          !full ? 'cursor-pointer' : ''
        } ${type !== 'range' ? 'p-4' : ''}`}
      />
    </section>
  )
}
