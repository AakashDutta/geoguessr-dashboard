import StarField from '@/components/geo/StarField'
import Navbar from '@/components/geo/Navbar'
import SubscriptionCard from '@/components/geo/SubscriptionCard'
import GlobeHero from '@/components/geo/GlobeHero'
import DailyChallenge from '@/components/geo/DailyChallenge'
import MeetOverlay from '@/components/geo/MeetOverlay'

export default function Home() {
  return (
    <>
      {/* Ambient background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(160deg, #0b0f2a 0%, #0e1330 40%, #131845 70%, #0b0f2a 100%)',
        }}
        aria-hidden="true"
      />

      {/* Additional radial glows for depth */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(108,71,255,0.12) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 30% at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 60%),' +
            'radial-gradient(ellipse 30% 20% at 80% 20%, rgba(168,85,247,0.07) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Animated starfield */}
      <StarField />

      {/* Fixed navbar */}
      <Navbar />

      {/* Main layout */}
      <main className="relative z-10 min-h-screen flex flex-col pt-14">

        {/* ── 3-column content area ── */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[300px_1fr_320px] gap-4 px-4 lg:px-5 py-5 max-w-[1400px] mx-auto w-full">

          {/* ── LEFT — Subscription card ── */}
          <section
            className="order-2 lg:order-1"
            aria-label="Subscription plans"
          >
            <SubscriptionCard />
          </section>

          {/* ── CENTER — Globe hero ── */}
          <section
            className="order-1 lg:order-2 flex items-center justify-center min-h-[520px]"
            aria-label="Globe hero and avatar"
          >
            <GlobeHero />
          </section>

          {/* ── RIGHT — Daily challenge ── */}
          <section
            className="order-3"
            aria-label="Daily challenge"
          >
            <DailyChallenge />
          </section>
        </div>

        {/* ── Bottom feature ribbon ── */}
        <footer className="relative z-10 border-t border-white/[0.05] mt-auto">
          <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[#8892b0] text-[11px]">
              &copy; 2026 GeoGuessr &mdash; Explore the World
            </p>
            <div className="flex items-center gap-4">
              {['Blog', 'Help', 'Privacy', 'Terms', 'Careers'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[#8892b0] text-[11px] hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Google Meet overlay */}
      <MeetOverlay />
    </>
  )
}
