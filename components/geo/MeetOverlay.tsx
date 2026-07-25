'use client'

import { useRef, useState, useCallback } from 'react'
import {
  Mic, MicOff, Video, VideoOff,
  Monitor, PhoneOff, ChevronUp, X,
} from 'lucide-react'

interface Participant {
  id: number
  initials: string
  name: string
  gradient: string
  muted?: boolean
}

const PARTICIPANTS: Participant[] = [
  { id: 1, initials: 'A', name: 'Aakash', gradient: 'from-[#6c47ff] to-[#4a2fd0]' },
  { id: 2, initials: 'T', name: 'Terra', gradient: 'from-[#0ea5e9] to-[#0369a1]' },
  { id: 3, initials: 'S', name: 'Sara', gradient: 'from-[#ec4899] to-[#9d174d]' },
  { id: 4, initials: 'M', name: 'Max', gradient: 'from-[#f59e0b] to-[#b45309]' },
]

export default function MeetOverlay() {
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [presenting, setPresenting] = useState(true)
  const [minimised, setMinimised] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  /* Drag logic */
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
  }, [pos])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.mx
    const dy = e.clientY - dragStart.current.my
    setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy })
  }, [])

  const onPointerUp = useCallback(() => {
    dragStart.current = null
  }, [])

  return (
    <div
      className="fixed bottom-6 right-6 z-40"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      role="region"
      aria-label="Google Meet-style call overlay"
    >
      <div
        className="rounded-2xl overflow-hidden select-none"
        style={{
          background: 'rgba(18,23,58,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          width: minimised ? '200px' : '248px',
          maxWidth: 'calc(100vw - 24px)',
        }}
      >
        {/* Drag handle header */}
        <div
          className="flex items-center justify-between px-3 py-2.5 cursor-grab active:cursor-grabbing border-b border-white/[0.06]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            {/* Google Meet-ish icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect width="18" height="18" rx="4" fill="#1a73e8" />
              <path d="M5 6h5v6H5zM10 7.5l3-2v7l-3-2z" fill="white" />
            </svg>
            <div className="pointer-events-none">
              <p className="text-white text-[11px] font-semibold leading-none">Aakash Dutta</p>
              <p className="text-[#8892b0] text-[9px] leading-none mt-0.5">
                {presenting ? 'You, presenting' : 'In call'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMinimised((m) => !m)}
            className="p-0.5 rounded text-[#8892b0] hover:text-white hover:bg-white/[0.06] transition-all pointer-events-auto"
            aria-label={minimised ? 'Expand call' : 'Minimise call'}
          >
            <ChevronUp
              size={14}
              className="transition-transform duration-200"
              style={{ transform: minimised ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>

        {/* Body — hidden when minimised */}
        {!minimised && (
          <>
            {/* Participant row */}
            <div className="px-3 py-2.5 flex items-center gap-2">
              <div className="flex -space-x-2">
                {PARTICIPANTS.map((p) => (
                  <div
                    key={p.id}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center
                      text-white text-[11px] font-bold border-2 border-[#12173a] ring-1 ring-white/[0.08]`}
                    title={p.name}
                    aria-label={p.name}
                  >
                    {p.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-[11px] font-semibold">{PARTICIPANTS.length} participants</p>
                <p className="text-[#8892b0] text-[9px]">GeoGuessr party</p>
              </div>
            </div>

            {/* Screen preview placeholder */}
            {presenting && (
              <div
                className="mx-3 mb-2 rounded-lg overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#0b0f2a,#1a1f4d)', aspectRatio: '16/9' }}
              >
                <div className="w-full h-full flex items-center justify-center text-[#8892b0] text-[10px]">
                  <div className="flex flex-col items-center gap-1">
                    <Monitor size={18} className="text-[#6c47ff]" aria-hidden="true" />
                    <span>Sharing GeoGuessr</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 px-3 py-3 border-t border-white/[0.06]">
              {/* Mic */}
              <button
                onClick={() => setMicOn((v) => !v)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150
                  hover:scale-110 active:scale-95
                  ${micOn ? 'bg-white/[0.1] text-white hover:bg-white/[0.15]' : 'bg-red-500/80 text-white'}`}
                aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                aria-pressed={!micOn}
              >
                {micOn ? <Mic size={14} /> : <MicOff size={14} />}
              </button>

              {/* Camera */}
              <button
                onClick={() => setCamOn((v) => !v)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150
                  hover:scale-110 active:scale-95
                  ${camOn ? 'bg-white/[0.1] text-white hover:bg-white/[0.15]' : 'bg-red-500/80 text-white'}`}
                aria-label={camOn ? 'Turn off camera' : 'Turn on camera'}
                aria-pressed={!camOn}
              >
                {camOn ? <Video size={14} /> : <VideoOff size={14} />}
              </button>

              {/* Present */}
              <button
                onClick={() => setPresenting((v) => !v)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150
                  hover:scale-110 active:scale-95
                  ${presenting ? 'bg-[#6c47ff]/80 text-white' : 'bg-white/[0.1] text-white hover:bg-white/[0.15]'}`}
                aria-label={presenting ? 'Stop presenting' : 'Present screen'}
                aria-pressed={presenting}
              >
                <Monitor size={14} />
              </button>

              {/* End call */}
              <button
                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center
                  text-white transition-all duration-150 hover:scale-110 active:scale-95"
                aria-label="End call"
                style={{ boxShadow: '0 0 12px 2px rgba(239,68,68,0.4)' }}
              >
                <PhoneOff size={13} />
              </button>

              {/* More options */}
              <button
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center
                  text-[#8892b0] hover:text-white transition-all duration-150"
                aria-label="More options"
              >
                <X size={13} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
