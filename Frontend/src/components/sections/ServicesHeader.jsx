const ServicesHeader = () => {
  return (
    <div className="bg-rich-black py-16 md:py-24 px-4 border-t border-gold/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <span className="text-gold font-sans text-xs tracking-[0.2em] uppercase">Exclusive Services</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2 leading-tight text-ivory">
            Tailored Moments,<br />
            <span className="italic text-gold">Perfectly Framed</span>
          </h2>
        </div>
        <div data-aos="fade-left">
          <p className="font-sans text-base text-warm-gray leading-relaxed">
            Every session is uniquely crafted to your vision. We never use templates—each shoot is a collaborative 
            journey that reflects your personality and story, ensuring your memories are as distinct as you are.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServicesHeader