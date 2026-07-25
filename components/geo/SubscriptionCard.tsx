'use client'

import { Check, Sparkles } from 'lucide-react'

const PERKS = [
  'Ad free, unlimited play',
  '1000s of maps',
  'Play on web, apps or Steam',
  'Exclusive weekly challenges',
  'Custom avatars & themes',
] as const

export default function SubscriptionCard() {
  return (
    <div className="purple-card rounded-2xl overflow-hidden flex flex-col h-full relative">
      {/* Decorative glow blob */}
      <div
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.35) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Illustration area */}
      <div className="relative h-[160px] flex items-center justify-center overflow-hidden">
        {/* Layered globe rings as illustration */}
        <div className="relative w-32 h-32">
          {/* outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#6c47ff]/40 animate-[spin_18s_linear_infinite]" />
          {/* second ring */}
          <div className="absolute inset-3 rounded-full border border-[#8b6bff]/30 animate-[spin_12s_linear_infinite_reverse]" />
          {/* globe body */}
          <div
            className="absolute inset-6 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, #3a1fa8 0%, #1a0e5c 50%, #0d0830 100%)',
              boxShadow: '0 0 30px 8px rgba(108,71,255,0.3)',
            }}
          />
          {/* continent blobs */}
          <div className="absolute inset-6 rounded-full overflow-hidden opacity-60">
            <div className="absolute top-[25%] left-[20%] w-6 h-4 bg-[#4ade80]/40 rounded-full rotate-12" />
            <div className="absolute top-[40%] left-[45%] w-7 h-5 bg-[#4ade80]/40 rounded-full -rotate-6" />
            <div className="absolute top-[55%] left-[25%] w-5 h-3 bg-[#4ade80]/40 rounded-full rotate-45" />
          </div>
          {/* orbit dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"
              style={{
                animation: 'orbit 6s linear infinite',
                boxShadow: '0 0 8px 2px rgba(245,158,11,0.6)',
              }}
            />
          </div>
        </div>

        {/* "PRO" badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
          style={{ background: 'linear-gradient(90deg,#6c47ff,#a855f7)' }}
        >
          <Sparkles size={9} />
          Pro
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-4">
        <div>
          <h2 className="text-white font-bold text-[15px] leading-snug text-balance">
            Subscribe to play without limits!
          </h2>
          <p className="text-[#8892b0] text-[11px] mt-1">
            Unlock the full GeoGuessr experience
          </p>
        </div>

        {/* Perks list */}
        <ul className="flex flex-col gap-2">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2">
              <span
                className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(108,71,255,0.25)', border: '1px solid rgba(108,71,255,0.5)' }}
                aria-hidden="true"
              >
                <Check size={9} className="text-[#8b6bff]" strokeWidth={3} />
              </span>
              <span className="text-[#c8cfe8] text-[12px] leading-snug">{perk}</span>
            </li>
          ))}
        </ul>

        {/* Pricing + CTA */}
        <div className="mt-auto pt-2">
          <p className="text-[#8892b0] text-[11px] mb-2">
            Starting from{' '}
            <span className="text-white font-bold text-[13px]">₹69</span>
            <span className="text-[10px]">/month</span>
          </p>

          <button
            className="w-full py-2.5 rounded-xl font-bold text-[13px] text-white tracking-wide
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              relative overflow-hidden group"
            style={{
              background: 'linear-gradient(90deg, #6c47ff 0%, #a855f7 100%)',
              boxShadow: '0 0 16px 2px rgba(108,71,255,0.4)',
            }}
          >
            <span className="relative z-10">VIEW PLANS</span>
            {/* hover shimmer */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
              }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
