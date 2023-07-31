type SpinnerProps = {
  backgroundColor?: string
}

// Componente con valor por defecto que puede recibir color
const Spinner = ({ backgroundColor = 'text-black' }: SpinnerProps) => {
  // Pintamos la vista
  return (
    <section
      className={`spinner align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${backgroundColor}`}
    />
  )
}
export default Spinner
