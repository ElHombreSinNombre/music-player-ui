import React from 'react'

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

//Componente con valor por defecto que puede llegar a recibir varias props para poder ser input range o input text
export default function Input({
  name,
  placeholder,
  icon,
  min,
  full = false,
  max,
  value,
  step,
  title,
  type = 'text',
  onChange
}: InputProps) {
  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      type === 'number' ? event.target.valueAsNumber : event.target.value

    event.preventDefault()
    if (onChange != null) onChange(value)
  }

  //Pintamos la vista
  return (
    <section className={`relative ${full ? 'w-full' : ''}`}>
      {icon && (
        <article className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <path
              d='M15.8047 14.862L11.8253 10.8826C12.9098 9.55637 13.4429 7.86404 13.3146 6.15568C13.1862 4.44733 12.4061 2.85366 11.1357 1.70432C9.86531 0.554984 8.20173 -0.0620951 6.4891 -0.0192739C4.77647 0.0235473 3.14581 0.722992 1.93442 1.93439C0.723023 3.14578 0.0235778 4.77644 -0.0192434 6.48907C-0.0620646 8.2017 0.555014 9.86528 1.70435 11.1357C2.85369 12.4061 4.44736 13.1862 6.15571 13.3145C7.86407 13.4429 9.5564 12.9097 10.8827 11.8253L14.862 15.8046C14.9877 15.9261 15.1561 15.9933 15.3309 15.9918C15.5057 15.9902 15.6729 15.9201 15.7966 15.7965C15.9202 15.6729 15.9903 15.5057 15.9918 15.3309C15.9933 15.1561 15.9261 14.9877 15.8047 14.862ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1011C2.82657 10.5151 2.14298 9.68216 1.73932 8.70762C1.33565 7.73308 1.23003 6.66073 1.43582 5.62616C1.64161 4.5916 2.14956 3.64129 2.89544 2.89541C3.64132 2.14953 4.59163 1.64158 5.62619 1.43579C6.66076 1.23 7.73311 1.33562 8.70765 1.73929C9.68219 2.14295 10.5151 2.82654 11.1012 3.7036C11.6872 4.58066 12 5.61181 12 6.66664C11.9984 8.08064 11.436 9.43627 10.4362 10.4361C9.43631 11.436 8.08067 11.9984 6.66667 12Z'
              fill='#FFF'
            />
          </svg>
        </article>
      )}
      <input
        title={title}
        type={type}
        onChange={change}
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
