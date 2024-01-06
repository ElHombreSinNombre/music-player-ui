type ToastProps = {
  text: string
  backgroundColor?: string
}

const Toast = ({ text, backgroundColor = 'bg-red-500' }: ToastProps) => {
  return (
    <section
      data-testid='toast'
      className={`text-white border border-red-500 px-4 py-3 rounded  ${backgroundColor}`}
    >
      {text}
    </section>
  )
}

export default Toast
