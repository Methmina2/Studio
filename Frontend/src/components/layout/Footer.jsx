import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa';
import { servicesData } from '../../data/serviceData';

const Footer = () => {
  return (
    <footer className="bg-absolute-black border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-2xl text-white">HOTMELLO</h3>
          <p className="text-sm text-zinc-500 mt-2 italic">"THIS IS ONLY THE BEGINNING."</p>
          <p className="text-sm text-zinc-500 mt-1">A creative space where photography, productions, live experiences, sound, and cinematic storytelling come together.</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://web.facebook.com/hotmelloevents" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#de660e] transition"><FaFacebook size={20} /></a>
            <a href="https://www.instagram.com/hotmello_labs/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#de660e] transition"><FaInstagram size={20} /></a>
            <a href="https://www.tiktok.com/@hotmello_labs" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#de660e] transition"><FaTiktok size={20} /></a>
            <a href="https://www.youtube.com/c/HotmelloLK/videos" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#de660e] transition"><FaYoutube size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-sans text-xs uppercase tracking-wider text-zinc-500">Quick Links</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {servicesData.map((s) => (
              <li key={s.id}>
                <Link 
                  to={s.enquireLink} 
                  className="text-zinc-500 hover:text-[#de660e] transition-colors duration-300"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li><Link to="/about" className="text-zinc-500 hover:text-[#de660e] transition-colors duration-300">About</Link></li>
            <li><Link to="/contact" className="text-zinc-500 hover:text-[#de660e] transition-colors duration-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs uppercase tracking-wider text-zinc-500">Contact</h4>
          <address className="not-italic text-sm text-zinc-500 mt-2 space-y-1">
            <p><a href="mailto:hotmellolabs@gmail.com" className="hover:text-[#de660e] transition">hotmellolabs@gmail.com</a></p>
            <p><a href="tel:+94701770163" className="hover:text-[#de660e] transition">+94 70 177 0163</a></p>
            <p>No. 38, Uyandana, Sri Lanka, 60000</p>
          </address>
        </div>
      </div>

      {/* Bottom bar – credits tooltip with two lines */}
      <div className="border-t border-zinc-900 mt-8 pt-6 text-center text-xs text-zinc-600">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span>&copy; 2026 HOTMELLO. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <Link to="#" className="hover:text-white transition">Privacy</Link>
          <span>|</span>
          <Link to="#" className="hover:text-white transition">Terms</Link>
          <span>|</span>
          <Link to="#" className="hover:text-white transition">Sitemap</Link>
          <span>|</span>
          <Link to="/admin/login" className="text-[#de660e] hover:text-white transition font-medium">
            Admin
          </Link>
          <span>|</span>

          {/* Hover‑reveal credits – two lines inside tooltip */}
          <span className="relative group inline-block cursor-default">
            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Developed by
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[200px] max-w-[90vw] bg-absolute-black/95 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] tracking-wider opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 pointer-events-none text-center leading-relaxed">
              <span className="text-white/70">Nexor</span>
              <span className="text-zinc-500 mx-1">·</span>
              <br />
              <span className="text-white/60">Chamalka Ekanayaka</span>
              <span className="text-[#de660e]/80"> #Thaniya</span>
              <br />
              <span className="text-white/60">Methmina Senadeera</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;