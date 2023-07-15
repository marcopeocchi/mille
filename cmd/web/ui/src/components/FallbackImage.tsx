type Props = {
  children?: React.ReactNode
  rounded?: boolean
  pulse?: boolean
  size: 'full' | 'mini'
}

const FallbackImage: React.FC<Props> = ({
  children,
  rounded,
  size,
  pulse
}) => {
  return (
    <div className={
      `aspect-square
      ${size === 'full' && 'sm:w-64 sm:h-64'}
      ${size === 'mini' && 'sm:w-16 sm:h-16'}
      ${pulse && 'animate-pulse'}
      ${rounded && 'rounded'}
      flex items-center justify-center 
      font-semibold text-2xl
      bg-neutral-300 dark:bg-neutral-800`
    }>
      {children}
    </div>
  )
}

export default FallbackImage