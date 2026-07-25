'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Pencil, Map, Compass, Zap } from 'lucide-react'

/* ── Rotating globe drawn on canvas ─────────────────────────────── */
function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const SIZE = 260
    canvas.width = SIZE
    canvas.height = SIZE
    const cx = SIZE / 2
    const cy = SIZE / 2
    const R = SIZE / 2 - 6

    /* Simplified land polygons as normalized coords (lon, lat) in degrees */
    const LAND_PATCHES: Array<{ cx: number; cy: number; rx: number; ry: number; rot: number }> = [
      // North America
      { cx: -100, cy: 45, rx: 28, ry: 20, rot: -10 },
      // South America
      { cx: -60, cy: -15, rx: 14, ry: 26, rot: 10 },
      // Europe
      { cx: 15, cy: 52, rx: 16, ry: 12, rot: 0 },
      // Africa
      { cx: 20, cy: 5, rx: 16, ry: 28, rot: 0 },
      // Asia
      { cx: 90, cy: 40, rx: 42, ry: 22, rot: 5 },
      // Australia
      { cx: 134, cy: -25, rx: 16, ry: 12, rot: 0 },
    ]

    const project = (lon: number, lat: number, offsetLon: number) => {
      const adjLon = lon + offsetLon
      const φ = (lat * Math.PI) / 180
      const λ = (adjLon * Math.PI) / 180
      const x = cx + R * Math.cos(φ) * Math.sin(λ)
      const y = cy - R * Math.sin(φ)
      const visible = Math.cos(φ) * Math.cos(λ) > -0.08
      return { x, y, visible }
    }

    let lon0 = 0
    let animId: number

    const drawGlobe = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)

      /* Outer glow ring */
      const glow = ctx.createRadialGradient(cx, cy, R - 4, cx, cy, R + 22)
      glow.addColorStop(0, 'rgba(108,71,255,0.5)')
      glow.addColorStop(0.5, 'rgba(108,71,255,0.15)')
      glow.addColorStop(1, 'rgba(108,71,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R + 22, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      /* Globe body gradient */
      const bodyGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R)
      bodyGrad.addColorStop(0, '#2a1a7a')
      bodyGrad.addColorStop(0.5, '#130b4e')
      bodyGrad.addColorStop(1, '#07041a')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = bodyGrad
      ctx.fill()

      /* Clip to sphere for land and grid */
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()

      /* Lat grid lines */
      ctx.strokeStyle = 'rgba(108,71,255,0.15)'
      ctx.lineWidth = 0.5
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath()
        let first = true
        for (let lon = -180; lon <= 180; lon += 3) {
          const { x, y, visible } = project(lon, lat, lon0)
          if (!visible) { first = true; continue }
          if (first) { ctx.moveTo(x, y); first = false }
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      /* Lon grid lines */
      for (let lon = -165; lon <= 180; lon += 15) {
        ctx.beginPath()
        let first = true
        for (let lat = -90; lat <= 90; lat += 2) {
          const { x, y, visible } = project(lon, lat, lon0)
          if (!visible) { first = true; continue }
          if (first) { ctx.moveTo(x, y); first = false }
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      /* Land patches (ellipses projected at patch centre) */
      for (const p of LAND_PATCHES) {
        const { x: px, y: py, visible } = project(p.cx, p.cy, lon0)
        if (!visible) continue

        const scaleX = Math.abs(Math.cos(((p.cx + lon0) * Math.PI) / 180))
        const rx = (p.rx / 360) * (2 * Math.PI * R) * scaleX * 0.55
        const ry = (p.ry / 180) * (Math.PI * R) * 0.55

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.beginPath()
        ctx.ellipse(0, 0, Math.max(rx, 2), Math.max(ry, 2), 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74,222,128,0.35)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(74,222,128,0.5)'
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()
      }

      /* Atmospheric rim */
      const rim = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R)
      rim.addColorStop(0, 'rgba(108,71,255,0)')
      rim.addColorStop(1, 'rgba(108,71,255,0.35)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = rim
      ctx.fill()

      ctx.restore()

      /* Sphere border */
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(108,71,255,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      /* Specular highlight */
      const spec = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.2, cy - R * 0.2, R * 0.5)
      spec.addColorStop(0, 'rgba(255,255,255,0.12)')
      spec.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = spec
      ctx.fill()

      lon0 = (lon0 + 0.15) % 360
      animId = requestAnimationFrame(drawGlobe)
    }

    animId = requestAnimationFrame(drawGlobe)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={260}
      className="drop-shadow-2xl"
      aria-label="Rotating globe illustration"
    />
  )
}

/* ── Cartoon Avatar above the globe ─────────────────────────────── */
function CartoonAvatar() {
  return (
    <div className="animate-float select-none" aria-hidden="true">
      <svg width="72" height="90" viewBox="0 0 72 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow under feet */}
        <ellipse cx="36" cy="87" rx="14" ry="3.5" fill="rgba(0,0,0,0.3)" />
        {/* Body */}
        <rect x="22" y="52" width="28" height="26" rx="10" fill="#6c47ff" />
        {/* Arms */}
        <rect x="10" y="55" width="14" height="8" rx="4" fill="#6c47ff" transform="rotate(-10 10 55)" />
        <rect x="48" y="55" width="14" height="8" rx="4" fill="#6c47ff" transform="rotate(10 48 55)" />
        {/* Legs */}
        <rect x="24" y="74" width="9" height="14" rx="4.5" fill="#4a2fd0" />
        <rect x="39" y="74" width="9" height="14" rx="4.5" fill="#4a2fd0" />
        {/* Shoes */}
        <ellipse cx="28.5" cy="88" rx="7" ry="4" fill="#1a0e5c" />
        <ellipse cx="43.5" cy="88" rx="7" ry="4" fill="#1a0e5c" />
        {/* Neck */}
        <rect x="31" y="42" width="10" height="12" rx="5" fill="#f5c5a3" />
        {/* Head */}
        <ellipse cx="36" cy="32" rx="18" ry="20" fill="#f5c5a3" />
        {/* Hair */}
        <path d="M18 28 Q20 12 36 14 Q52 12 54 28 Q50 18 36 20 Q22 18 18 28Z" fill="#3d1f00" />
        {/* Eyes */}
        <circle cx="29" cy="30" r="4" fill="white" />
        <circle cx="43" cy="30" r="4" fill="white" />
        <circle cx="30" cy="31" r="2.5" fill="#2a1a00" />
        <circle cx="44" cy="31" r="2.5" fill="#2a1a00" />
        <circle cx="31" cy="30" r="1" fill="white" />
        <circle cx="45" cy="30" r="1" fill="white" />
        {/* Smile */}
        <path d="M30 38 Q36 44 42 38" stroke="#c08060" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Pin / Map icon on shirt */}
        <circle cx="36" cy="62" r="5" fill="white" opacity="0.2" />
        <path d="M36 59 C34 59 33 60.5 33 62 C33 64 36 67 36 67 C36 67 39 64 39 62 C39 60.5 38 59 36 59Z" fill="white" opacity="0.5" />
        {/* Backpack strap hint */}
        <path d="M22 56 Q28 50 36 50 Q44 50 50 56" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

/* ── Quick-play action chips ──────────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: Map, label: 'World Map', color: '#6c47ff' },
  { icon: Compass, label: 'Explorer', color: '#0ea5e9' },
  { icon: Zap, label: 'Quick Game', color: '#f59e0b' },
] as const

/* ── Main component ─────────────────────────────────────────────── */
export default function GlobeHero() {
  const [liveCount] = useState(5230)
  const [showEdit, setShowEdit] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-0 py-4 select-none">

      {/* Quick action chips — top */}
      <div className="flex items-center gap-2 mb-4">
        {QUICK_ACTIONS.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold
              transition-all duration-200 hover:scale-105 active:scale-95 hover:-translate-y-0.5"
            style={{
              borderColor: `${color}40`,
              background: `${color}15`,
              color,
              boxShadow: `0 0 10px 0 ${color}20`,
            }}
          >
            <Icon size={11} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Avatar + Globe stack */}
      <div className="relative flex flex-col items-center">
        {/* Avatar */}
        <div className="relative z-10 -mb-4">
          <CartoonAvatar />
        </div>

        {/* Globe with glow platform */}
        <div
          className="relative animate-pulse-glow rounded-full"
          style={{ filter: 'drop-shadow(0 0 32px rgba(108,71,255,0.5))' }}
        >
          <GlobeCanvas />
        </div>

        {/* Platform / shadow under globe */}
        <div
          className="w-40 h-5 rounded-full -mt-3 z-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(108,71,255,0.4) 0%, transparent 70%)',
            filter: 'blur(6px)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Edit Avatar CTA */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <button
          onMouseEnter={() => setShowEdit(true)}
          onMouseLeave={() => setShowEdit(false)}
          onClick={() => setShowEdit((v) => !v)}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-[12px] text-white uppercase tracking-widest
            transition-all duration-200 hover:scale-[1.06] active:scale-[0.97] relative overflow-hidden group"
          style={{
            background: 'linear-gradient(90deg, #6c47ff 0%, #a855f7 100%)',
            boxShadow: showEdit
              ? '0 0 28px 6px rgba(108,71,255,0.7)'
              : '0 0 16px 2px rgba(108,71,255,0.4)',
          }}
        >
          <Pencil size={12} aria-hidden="true" />
          Edit Avatar
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.14) 50%,transparent 100%)',
            }}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Live player count */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
        <Users size={12} className="text-[#8892b0]" aria-hidden="true" />
        <span className="text-[11px] text-[#8892b0]">
          <span className="text-[#22c55e] font-bold">{liveCount.toLocaleString()}</span>
          {' '}games right now
        </span>
        <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" aria-hidden="true" />
      </div>
    </div>
  )
}
