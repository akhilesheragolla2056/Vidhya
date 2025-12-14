import logoImg from '../../assets/logo.png'

export default function Logo({ size = 'md', showText = false, className = '' }) {
  const sizes = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-16',
    xl: 'h-20',
    xxl: 'h-24',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoImg} 
        alt="Vidhya" 
        className={`${sizes[size]} w-auto object-contain`}
      />
      {showText && (
        <span className="text-xl font-bold text-primary sr-only">Vidhya</span>
      )}
    </div>
  )
}
