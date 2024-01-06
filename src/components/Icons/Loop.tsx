interface LoopProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const LoopIcon = ({
  width = 24,
  height = 24,
  className,
  onClick
}: LoopProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    stroke='currentColor'
  >
    <path
      d='M17 17H8c-1.667 0-5-1-5-5s3.333-5 5-5h8c1.667 0 5 1 5 5 0 1.494-.465 2.57-1.135 3.331'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M14.5 14.5L17 17l-2.5 2.5'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <title>Loop</title>
  </svg>
)

export default LoopIcon
