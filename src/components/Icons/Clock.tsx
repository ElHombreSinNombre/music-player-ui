import { ReactNode } from 'react'

interface ClockProps {
  width?: number
  height?: number
  className?: string
  children?: ReactNode
  onClick?: () => void
}

const ClockIcon = ({
  width = 24,
  height = 24,
  className,
  children,
  onClick
}: ClockProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    className={className}
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    color='currentColor'
  >
    <path
      d='M12 6v6h6'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <title>{children}</title>
  </svg>
)

export default ClockIcon
