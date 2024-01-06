interface VolumeProps {
  width?: number
  height?: number
  className?: string
  off?: boolean
  onClick?: () => void
}

const VolumeIcon = ({
  width = 24,
  height = 24,
  className,
  off = false,
  onClick
}: VolumeProps) => (
  <svg
    onClick={onClick}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    color='currentColor'
    className={className}
  >
    {off ? (
      <>
        <g
          clip-path='url(#sound-off_svg__clip0_3173_16686)'
          stroke='currentColor'
          stroke-width='1.5'
        >
          <path
            d='M18 14l2-2m2-2l-2 2m0 0l-2-2m2 2l2 2'
            stroke-linecap='round'
            stroke-linejoin='round'
          ></path>
          <path d='M2 13.857v-3.714a2 2 0 012-2h2.9a1 1 0 00.55-.165l6-3.956a1 1 0 011.55.835v14.286a1 1 0 01-1.55.835l-6-3.956a1 1 0 00-.55-.165H4a2 2 0 01-2-2z'></path>
        </g>
        <defs>
          <clipPath id='sound-off_svg__clip0_3173_16686'>
            <path fill='#fff' d='M0 0h24v24H0z'></path>
          </clipPath>
        </defs>
      </>
    ) : (
      <>
        <path
          d='M1 13.857v-3.714a2 2 0 012-2h2.9a1 1 0 00.55-.165l6-3.956a1 1 0 011.55.835v14.286a1 1 0 01-1.55.835l-6-3.956a1 1 0 00-.55-.165H3a2 2 0 01-2-2z'
          stroke='currentColor'
          strokeWidth='1.5'
        ></path>
        <path
          d='M17.5 7.5S19 9 19 11.5s-1.5 4-1.5 4M20.5 4.5S23 7 23 11.5s-2.5 7-2.5 7'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>
      </>
    )}

    <title>Volume</title>
  </svg>
)

export default VolumeIcon
