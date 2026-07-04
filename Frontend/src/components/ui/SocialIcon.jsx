const SocialIcon = ({ icon: Icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" 
       className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 hover:scale-110">
      <Icon className="w-4 h-4" />
    </a>
  )
}

export default SocialIcon