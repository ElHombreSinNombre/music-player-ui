interface ShuffleProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const ShuffleIcon = ({
  width = 24,
  height = 24,
  className,
  onClick
}: ShuffleProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M22 7c-3 0-8.5 0-10.5 5.5S5 18 2 18'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M20 5l2 2-2 2M22 18c-3 0-8.5 0-10.5-5.5S5 7 2 7'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M20 20l2-2-2-2'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <title>Shuffle</title>
  </svg>
)

export default ShuffleIcon
