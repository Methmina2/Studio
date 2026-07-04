const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold'

  const variants = {
    primary: 'bg-gold text-rich-black hover:bg-gold-soft hover:scale-105 hover:shadow-lg hover:shadow-gold/20 focus:ring-gold',
    secondary: 'border-2 border-ivory text-ivory hover:bg-ivory/10 hover:border-gold hover:text-gold hover:scale-105',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-rich-black hover:scale-105',
  }

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button