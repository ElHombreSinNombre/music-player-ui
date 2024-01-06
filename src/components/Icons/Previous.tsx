interface PreviousProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const PreviousIcon = ({
  width = 24,
  height = 24,
  className,
  onClick
}: PreviousProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    stroke='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M6 7v10M17.028 5.267a.6.6 0 01.972.471v12.524a.6.6 0 01-.972.47l-7.931-6.261a.6.6 0 010-.942l7.931-6.262z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <title>Previous</title>
  </svg>
)

export default PreviousIcon
