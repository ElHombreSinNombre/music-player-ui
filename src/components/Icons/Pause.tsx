interface PauseProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const PauseIcon = ({
  width = 24,
  height = 24,
  className,
  onClick
}: PauseProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M6 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6zM14 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6h-2.8a.6.6 0 01-.6-.6z'
      strokeWidth='1.5'
    />
    <title>Pause</title>
  </svg>
)

export default PauseIcon
