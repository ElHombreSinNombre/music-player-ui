import { ReactNode } from 'react'

interface ArrowProps {
  width?: number
  height?: number
  className?: string
  children?: ReactNode
  onClick?: () => void
}

const ArrowIcon = ({
  width = 24,
  height = 24,
  className,
  children,
  onClick
}: ArrowProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    color='currentColor'
    className={className}
  >
    <path
      d='M15 6l-6 6 6 6'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <title>{children}</title>
  </svg>
)

export default ArrowIcon
