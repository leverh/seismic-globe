'use client'

import { useGlobeStore } from '@/store/globeStore'

export default function FilterPanel() {
  const minMag    = useGlobeStore(s => s.minMag)
  const days      = useGlobeStore(s => s.days)
  const setMinMag = useGlobeStore(s => s.setMinMag)
  const setDays   = useGlobeStore(s => s.setDays)

  // Stop touch events from reaching the globe canvas beneath
  const stopTouch = (e: React.TouchEvent) => e.stopPropagation()

  return (
    <div
      onTouchStart={stopTouch}
      onTouchMove={stopTouch}
      onTouchEnd={stopTouch}
      style={{
        position: 'absolute',

        bottom: 'max(16px, calc(env(safe-area-inset-bottom, 0px) + 16px))',

        left: 'clamp(16px, 5vw, 9999px)',
        right: 'clamp(16px, 5vw, 9999px)',
        maxWidth: 320,

        marginLeft: 'auto',

        maxHeight: '45dvh',
        overflowY: 'auto',

        touchAction: 'pan-y',
        zIndex: 10,
        pointerEvents: 'all',
        background: 'rgba(6,11,28,0.88)',
        border: '0.5px solid rgba(78,140,220,0.4)',
        borderRadius: 12,
        padding: '16px 20px',
        backdropFilter: 'blur(8px)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

        scrollbarWidth: 'none',
      }}
    >
      {/* Hide webkit scrollbar */}
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      <div style={{
        fontSize: 11,
        color: '#4a7aaa',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 14,
      }}>
        Filters
      </div>

      <SliderField
        label="Min magnitude"
        value={minMag}
        min={2} max={7} step={0.5}
        display={`M ${minMag.toFixed(1)}+`}
        onChange={setMinMag}
      />

      <SliderField
        label="Time window"
        value={days}
        min={1} max={90} step={1}
        display={`${days}d`}
        onChange={setDays}
      />

      <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[7, 14, 30, 60, 90].map(d => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 20,
              background: days === d ? 'rgba(78,140,220,0.25)' : 'transparent',
              border: `0.5px solid ${days === d ? 'rgba(78,140,220,0.7)' : 'rgba(78,140,220,0.25)'}`,
              color: days === d ? '#4fa3e8' : '#4a7aaa',
              cursor: 'pointer',
            }}
          >
            {d}d
          </button>
        ))}
      </div>
    </div>
  )
}

interface SliderProps {
  label:    string
  value:    number
  min:      number
  max:      number
  step:     number
  display:  string
  onChange: (v: number) => void
}

function SliderField({ label, value, min, max, step, display, onChange }: SliderProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#7aa8cc' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#e0f0ff' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#4fa3e8' }}
      />
    </div>
  )
}