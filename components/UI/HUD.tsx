'use client'

import { useGlobeStore } from '@/store/globeStore'
import { EarthquakeFeature } from '@/types/earthquake'

interface Props {
  earthquakes: EarthquakeFeature[]
  isLoading:   boolean
}

export default function HUD({ earthquakes, isLoading }: Props) {
  const selected = useGlobeStore(s => s.selected)
  const setSelected = useGlobeStore(s => s.setSelected)

  const maxMag = earthquakes.length
    ? Math.max(...earthquakes.map(q => q.properties.mag)).toFixed(1)
    : '—'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      zIndex: 10,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 28px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.1em', color: '#e8f4ff' }}>
          SEISMIC <span style={{ color: '#4fa3e8' }}>GLOBE</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Pill>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e05555', display: 'inline-block', animation: 'blink 1.4s infinite' }} />
            Live USGS
          </Pill>
          <Pill><strong style={{ color: '#e0f0ff' }}>{isLoading ? '…' : earthquakes.length}</strong>&nbsp;events</Pill>
          <Pill>Max <strong style={{ color: '#e0f0ff' }}>M {maxMag}</strong></Pill>
        </div>
      </div>

      {/* selected quake card */}
      {selected && (
        <div style={{
          position: 'absolute', top: 72, right: 28,
          background: 'rgba(6,11,28,0.88)',
          border: '0.5px solid rgba(78,140,220,0.4)',
          borderRadius: 12, padding: '16px 20px',
          minWidth: 220, pointerEvents: 'all',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontSize: 11, color: '#4a7aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Selected event
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, color: selected.properties.mag >= 6 ? '#f0603a' : '#f0a030', lineHeight: 1 }}>
            M {selected.properties.mag.toFixed(1)}
          </div>
          <div style={{ fontSize: 13, color: '#7aa8cc', marginTop: 6, marginBottom: 12 }}>
            {selected.properties.place}
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Field label="Depth">{selected.geometry.coordinates[2].toFixed(0)} km</Field>
            <Field label="Time">{timeAgo(selected.properties.time)}</Field>
            {selected.properties.felt && <Field label="Felt">{selected.properties.felt.toLocaleString()}</Field>}
          </div>
          <button
            onClick={() => setSelected(null)}
            style={{
              marginTop: 14, fontSize: 11, color: '#4a7aaa',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            ✕ dismiss
          </button>
        </div>
      )}

      {/* legend */}
      <div style={{
        position: 'absolute', bottom: 28, left: 28,
        display: 'flex', gap: 14, alignItems: 'center',
      }}>
        {[
          { color: '#f0c040', label: 'M 4–5' },
          { color: '#f0a030', label: 'M 5–6' },
          { color: '#f0603a', label: 'M 6–7' },
          { color: '#e02020', label: 'M 7+'  },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7aa8cc' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(15,30,55,0.75)',
      border: '0.5px solid rgba(78,140,220,0.3)',
      borderRadius: 20, padding: '6px 14px',
      color: '#9dc8f0', fontSize: 12,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11 }}>
      <div style={{ color: '#4a7aaa', marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#c0d8f0', fontSize: 12 }}>{children}</div>
    </div>
  )
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const h    = Math.floor(diff / 1000 / 60 / 60)
  if (h < 1)   return '< 1h ago'
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}