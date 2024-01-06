interface NextProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const NextIcon = ({
  width = 24,
  height = 24,
  className,
  onClick
}: NextProps) => (
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
      d='M18 7v10M6.972 5.267A.6.6 0 006 5.738v12.524a.6.6 0 00.972.47l7.931-6.261a.6.6 0 000-.942L6.972 5.267z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <title>Next</title>
  </svg>
)

export default NextIcon
