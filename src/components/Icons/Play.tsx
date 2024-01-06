interface PlayProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const PlayIcon = ({
  width = 24,
  height = 24,
  className,
  onClick
}: PlayProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6.906 4.537A.6.6 0 006 5.053v13.894a.6.6 0 00.906.516l11.723-6.947a.6.6 0 000-1.032L6.906 4.537z'
      strokeWidth='1.5'
    ></path>
    <title>Play</title>
  </svg>
)

export default PlayIcon
