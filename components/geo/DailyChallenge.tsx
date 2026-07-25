'use client'

import { useEffect, useState } from 'react'
import { Flame, ChevronLeft, ChevronRight, Trophy, Star } from 'lucide-react'

/* ── Calendar data ── */
const MONTH = 'July 2026'
const DAYS_IN_MONTH = 31
const FIRST_DAY_OF_WEEK = 3 // Wednesday (0=Sun)
const STREAK_DAYS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20, 21, 22] as const
const TODAY = 22

/* ── Countdown timer ── */
function useCountdown(endHour = 23, endMin = 59, endSec = 59) {
  const calcRemaining = () => {
    const now = new Date()
    const end = new Date()
    end.setHours(endHour, endMin, endSec, 0)
    let diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))
    if (diff === 0) diff = 86399 // wrap to next day
    const h = String(Math.floor(diff / 3600)).padStart(2, '0')
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
    const s = String(diff % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }
  const [time, setTime] = useState(calcRemaining)
  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ── Player data ── */
const PLAYERS = [
  {
    name: 'Aakash',
    sub: 'You',
    score: '24,850',
    rank: 1,
    highlight: false,
    color: '#b45309',
    bg: 'from-[#78350f] to-[#451a03]',
    initials: 'A',
  },
  {
    name: 'TerraQuest',
    sub: 'Rival',
    score: '23,410',
    rank: 2,
    highlight: true,
    color: '#00e5c8',
    bg: 'from-[#064e3b] to-[#022c22]',
    initials: 'T',
  },
] as const

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

export default function DailyChallenge() {
  const timer = useCountdown()

  return (
    <div className="glass-card rounded-2xl flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-bold text-[15px]">Daily Challenge</h2>
          <Flame size={16} className="text-[#f97316]" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" aria-hidden="true" />
          <span className="text-[#8892b0] text-[11px]">
            current streak: <span className="text-[#f97316] font-bold">18</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-4 bg-white/[0.06]" />

      {/* Calendar */}
      <div className="px-4 pt-3">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-2">
          <button
            className="p-1 rounded-md text-[#8892b0] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-white text-[12px] font-semibold">{MONTH}</span>
          <button
            className="p-1 rounded-md text-[#8892b0] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1" role="row">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[9px] font-semibold text-[#8892b0] uppercase py-0.5"
              role="columnheader"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5" role="grid" aria-label="July 2026">
          {/* Empty cells for offset */}
          {Array.from({ length: FIRST_DAY_OF_WEEK }).map((_, i) => (
            <div key={`empty-${i}`} role="gridcell" aria-hidden="true" />
          ))}

          {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((day) => {
            const isToday = day === TODAY
            const isStreak = (STREAK_DAYS as readonly number[]).includes(day)
            const isFuture = day > TODAY

            return (
              <button
                key={day}
                role="gridcell"
                aria-label={`July ${day}, 2026${isToday ? ' (today)' : ''}${isStreak ? ', completed' : ''}`}
                aria-current={isToday ? 'date' : undefined}
                disabled={isFuture}
                className={`
                  aspect-square flex items-center justify-center rounded-md text-[11px] font-medium
                  transition-all duration-150 mx-auto w-7
                  ${isFuture ? 'text-[#4a5568] cursor-not-allowed' : 'hover:bg-white/[0.06] cursor-pointer'}
                  ${isToday
                    ? 'bg-[#6c47ff] text-white font-bold ring-1 ring-[#8b6bff] ring-offset-1 ring-offset-[#12173a]'
                    : isStreak
                      ? 'text-[#22c55e] bg-[#22c55e]/10'
                      : 'text-[#8892b0]'
                  }
                `}
              >
                {isToday ? (
                  <span className="flex flex-col items-center leading-none gap-px">
                    <span>{day}</span>
                  </span>
                ) : isStreak ? (
                  <span className="flex flex-col items-center leading-none gap-px">
                    <span>{day}</span>
                    <span className="w-1 h-1 rounded-full bg-[#22c55e]" aria-hidden="true" />
                  </span>
                ) : (
                  day
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Timer */}
      <div className="px-4 pt-3 pb-2">
        <div className="rounded-xl bg-black/20 border border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
          <span className="text-[#8892b0] text-[11px] font-medium">Ends in</span>
          <span
            className="font-black text-[20px] tabular-nums tracking-wider animate-timer-pulse"
            style={{
              color: '#f59e0b',
              textShadow: '0 0 12px rgba(245,158,11,0.6)',
            }}
            aria-live="polite"
            aria-label={`Challenge ends in ${timer}`}
          >
            {timer}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-4 bg-white/[0.06]" />

      {/* Players */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#8892b0] text-[11px] font-semibold uppercase tracking-wide">
            Leaderboard
          </span>
          <Trophy size={12} className="text-[#f59e0b]" aria-hidden="true" />
        </div>

        {PLAYERS.map((player) => (
          <div
            key={player.name}
            className={`
              flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200
              hover:scale-[1.01] cursor-pointer
              ${
                player.highlight
                  ? 'teal-glow bg-[#022c22]/60 border-[#00e5c8]/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:border-white/10'
              }
            `}
          >
            {/* Rank */}
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
              style={{
                background:
                  player.rank === 1
                    ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                    : 'rgba(255,255,255,0.08)',
                color: player.rank === 1 ? '#000' : '#8892b0',
              }}
              aria-hidden="true"
            >
              {player.rank}
            </span>

            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${player.bg} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}
              style={player.highlight ? { boxShadow: '0 0 10px 2px rgba(0,229,200,0.35)' } : {}}
              aria-hidden="true"
            >
              {player.initials}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-white text-[12px] font-semibold truncate">{player.name}</span>
                {player.sub && (
                  <span
                    className="text-[9px] px-1 py-0.5 rounded font-medium"
                    style={{
                      background: player.highlight ? 'rgba(0,229,200,0.15)' : 'rgba(108,71,255,0.2)',
                      color: player.highlight ? '#00e5c8' : '#8b6bff',
                    }}
                  >
                    {player.sub}
                  </span>
                )}
              </div>
              {/* Score bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: player.rank === 1 ? '100%' : '94%',
                      background: player.highlight
                        ? 'linear-gradient(90deg,#00e5c8,#0ea5e9)'
                        : 'linear-gradient(90deg,#6c47ff,#a855f7)',
                    }}
                  />
                </div>
                <span className="text-[#8892b0] text-[10px] font-mono tabular-nums shrink-0">
                  {player.score}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 shrink-0">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={9}
                  className={i < (player.rank === 1 ? 5 : 4) ? 'text-[#f59e0b]' : 'text-white/20'}
                  fill={i < (player.rank === 1 ? 5 : 4) ? '#f59e0b' : 'none'}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        ))}

        {/* Play button */}
        <button
          className="mt-auto w-full py-2.5 rounded-xl font-bold text-[13px] text-white tracking-wide
            transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
          style={{
            background: 'linear-gradient(90deg,#059669,#10b981)',
            boxShadow: '0 0 14px 2px rgba(16,185,129,0.35)',
          }}
        >
          <span className="relative z-10">PLAY TODAY&apos;S CHALLENGE</span>
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.1) 50%,transparent 100%)',
            }}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  )
}
