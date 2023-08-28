interface SpinnerProps {
  backgroundColor?: string
}
const Spinner = ({ backgroundColor = 'text-black' }: SpinnerProps) => {
  return (
    <section
      className={`spinner align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${backgroundColor}`}
    />
  )
}
export default Spinner
