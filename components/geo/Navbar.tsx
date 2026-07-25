'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown, Volume2, VolumeX } from 'lucide-react'

const NAV_LINKS = [
  'Singleplayer',
  'Multiplayer',
  'Party',
  'Quiz',
  'Community',
  'Shop',
  'Merch',
  'World Championship',
] as const

export default function Navbar() {
  const [muted, setMuted] = useState(false)
  const [activeLink, setActiveLink] = useState('Singleplayer')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14">
      {/* backdrop */}
      <div className="absolute inset-0 bg-[#0b0f2a]/80 backdrop-blur-md border-b border-white/[0.06]" />

      <nav className="relative flex items-center h-full px-4 lg:px-6 gap-2">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-1.5 mr-4 shrink-0 group"
          aria-label="GeoGuessr home"
        >
          {/* Minimal globe icon */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            className="shrink-0"
            aria-hidden="true"
          >
            <circle cx="13" cy="13" r="11" stroke="#6c47ff" strokeWidth="1.5" />
            <ellipse cx="13" cy="13" rx="5" ry="11" stroke="#6c47ff" strokeWidth="1" />
            <line x1="2" y1="13" x2="24" y2="13" stroke="#6c47ff" strokeWidth="1" />
            <line x1="3" y1="8" x2="23" y2="8" stroke="#6c47ff" strokeWidth="0.8" />
            <line x1="3" y1="18" x2="23" y2="18" stroke="#6c47ff" strokeWidth="0.8" />
          </svg>
          <span className="text-white font-black text-sm tracking-[0.18em] uppercase hidden sm:block group-hover:text-[#8b6bff] transition-colors">
            GeoGuessr
          </span>
        </a>

        {/* Nav links — hidden on small screens */}
        <ul className="hidden xl:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <button
                onClick={() => setActiveLink(link)}
                className={`
                  relative px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded transition-all duration-200
                  ${
                    activeLink === link
                      ? 'text-white after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:rounded-full after:bg-[#6c47ff]'
                      : 'text-[#8892b0] hover:text-white hover:bg-white/[0.06]'
                  }
                `}
              >
                {link === 'World Championship' ? (
                  <span className="flex items-center gap-1">
                    World Champ.
                    <span className="bg-[#6c47ff] text-white text-[9px] font-bold px-1 py-0.5 rounded uppercase leading-none">
                      NEW
                    </span>
                  </span>
                ) : (
                  link
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Sound toggle */}
          <button
            onClick={() => setMuted((m) => !m)}
            className="p-1.5 rounded-lg text-[#8892b0] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label={muted ? 'Unmute' : 'Mute'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Search */}
          <button
            className="p-1.5 rounded-lg text-[#8892b0] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Search"
            title="Search"
          >
            <Search size={15} />
          </button>

          {/* Notifications */}
          <button
            className="relative p-1.5 rounded-lg text-[#8892b0] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#6c47ff]" aria-hidden="true" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-[#6c47ff]/40 transition-all group">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6c47ff] to-[#4a2fd0] flex items-center justify-center text-white text-[10px] font-bold uppercase">
                A
              </div>
              {/* Level badge */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#f59e0b] border border-[#0b0f2a] flex items-center justify-center text-[8px] font-black text-black leading-none">
                12
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-white text-[11px] font-semibold">Aakashd20710</span>
              <span className="text-[#8892b0] text-[9px]">Level 12</span>
            </div>
            <ChevronDown size={12} className="text-[#8892b0] group-hover:text-white transition-colors" />
          </button>
        </div>
      </nav>
    </header>
  )
}
