'use client'

import { useGlobeStore } from '@/store/globeStore'
import { EarthquakeFeature } from '@/types/earthquake'

interface Props {
  earthquakes: EarthquakeFeature[]
  isLoading: boolean
  onReset: () => void
}

export default function HUD({ earthquakes, isLoading, onReset }: Props) {
  const selected = useGlobeStore(s => s.selected)
  const setSelected = useGlobeStore(s => s.setSelected)

  const handleReset = () => {
    setSelected(null)
    onReset()
  }

  const maxMag = earthquakes.length
    ? Math.max(...earthquakes.map(q => q.properties.mag)).toFixed(1)
    : '—'

  return (
    <div className="hudRoot">
      {/* top bar */}
      <div className="hudTopBar">
        <div className="hudTitle">
          SEISMIC <span>GLOBE</span>
        </div>

        <div className="hudControls">
          <Pill>
            <span className="liveDot" />
            <span className="optionalText">Live </span>USGS
          </Pill>

          <Pill>
            <strong>{isLoading ? '…' : earthquakes.length}</strong>
            <span className="optionalText">&nbsp;events</span>
          </Pill>

          <Pill>
            <span className="optionalText">Max </span>
            <strong>M {maxMag}</strong>
          </Pill>

          <button
            onClick={handleReset}
            className="resetButton"
            title="Reset view"
          >
            <span>⟳</span>
            <span className="resetText">Reset</span>
          </button>
        </div>
      </div>

      {/* selected quake card */}
      {selected && (
        <div className="selectedCard">
          <div className="selectedLabel">Selected event</div>

          <div
            className="selectedMagnitude"
            style={{
              color: selected.properties.mag >= 6 ? '#f0603a' : '#f0a030',
            }}
          >
            M {selected.properties.mag.toFixed(1)}
          </div>

          <div className="selectedPlace">{selected.properties.place}</div>

          <div className="selectedFields">
            <Field label="Depth">
              {selected.geometry.coordinates[2].toFixed(0)} km
            </Field>

            <Field label="Time">
              {timeAgo(selected.properties.time)}
            </Field>

            {selected.properties.felt && (
              <Field label="Felt">
                {selected.properties.felt.toLocaleString()}
              </Field>
            )}
          </div>

          <button
            onClick={() => setSelected(null)}
            className="dismissButton"
          >
            ✕ dismiss
          </button>
        </div>
      )}

      {/* legend */}
      <div className="legend">
        {[
          { color: '#f0c040', label: 'M 4–5' },
          { color: '#f0a030', label: 'M 5–6' },
          { color: '#f0603a', label: 'M 6–7' },
          { color: '#e02020', label: 'M 7+' },
        ].map(({ color, label }) => (
          <div key={label} className="legendItem">
            <span style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      <style jsx>{`
        .hudRoot {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .hudTopBar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 20px 28px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .hudTitle {
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #e8f4ff;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .hudTitle span {
          color: #4fa3e8;
        }

        .hudControls {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          min-width: 0;
        }

        .liveDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e05555;
          display: inline-block;
          animation: blink 1.4s infinite;
          flex-shrink: 0;
        }

        .resetButton {
          pointer-events: all;
          background: rgba(15, 30, 55, 0.75);
          border: 0.5px solid rgba(78, 140, 220, 0.3);
          border-radius: 20px;
          padding: 6px 14px;
          color: #9dc8f0;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .selectedCard {
          position: absolute;
          top: 72px;
          right: 28px;
          background: rgba(6, 11, 28, 0.88);
          border: 0.5px solid rgba(78, 140, 220, 0.4);
          border-radius: 12px;
          padding: 16px 20px;
          min-width: 220px;
          pointer-events: all;
          backdrop-filter: blur(8px);
        }

        .selectedLabel {
          font-size: 11px;
          color: #4a7aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .selectedMagnitude {
          font-size: 32px;
          font-weight: 500;
          line-height: 1;
        }

        .selectedPlace {
          font-size: 13px;
          color: #7aa8cc;
          margin-top: 6px;
          margin-bottom: 12px;
        }

        .selectedFields {
          display: flex;
          gap: 20px;
        }

        .dismissButton {
          margin-top: 14px;
          font-size: 11px;
          color: #4a7aaa;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .legend {
          position: absolute;
          bottom: 28px;
          left: 28px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .legendItem {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #7aa8cc;
        }

        .legendItem span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.3;
          }
        }

        @media (max-width: 430px) {
          .hudTopBar {
            padding: 20px 16px;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 8px;
          }

          .hudControls {
            width: 100%;
            justify-content: flex-start;
            gap: 6px;
          }

          .selectedCard {
            top: 112px;
            right: 16px;
            left: 16px;
            min-width: 0;
          }

          .legend {
            left: 16px;
            right: 16px;
            bottom: 20px;
            gap: 10px;
          }

          .optionalText {
            display: none;
          }

          .resetText {
            display: none;
          }

          .resetButton {
            padding: 6px 10px;
          }
        }

        @media (max-width: 360px) {
          .hudTopBar {
            padding: 18px 12px;
          }

          .legend {
            gap: 8px;
          }

          .legendItem {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="pill">
      {children}

      <style jsx>{`
        .pill {
          background: rgba(15, 30, 55, 0.75);
          border: 0.5px solid rgba(78, 140, 220, 0.3);
          border-radius: 20px;
          padding: 6px 14px;
          color: #9dc8f0;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pill strong {
          color: #e0f0ff;
        }

        @media (max-width: 360px) {
          .pill {
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ fontSize: 11 }}>
      <div style={{ color: '#4a7aaa', marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#c0d8f0', fontSize: 12 }}>{children}</div>
    </div>
  )
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const h = Math.floor(diff / 1000 / 60 / 60)

  if (h < 1) return '< 1h ago'
  if (h < 24) return `${h}h ago`

  return `${Math.floor(h / 24)}d ago`
}