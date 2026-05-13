'use client'

import { useMemo } from 'react'
import { EarthquakeFeature } from '@/types/earthquake'

interface Props {
  earthquakes: EarthquakeFeature[]
}

export default function StatsPanel({ earthquakes }: Props) {
  const stats = useMemo(() => {
    if (!earthquakes.length) return null
    const mags   = earthquakes.map(q => q.properties.mag)
    const major  = earthquakes.filter(q => q.properties.mag >= 6).length
    const avg    = mags.reduce((a, b) => a + b, 0) / mags.length
    const tsunami = earthquakes.filter(q => q.properties.tsunami === 1).length
    return { total: earthquakes.length, major, avg, tsunami }
  }, [earthquakes])

  if (!stats) return null

  return (
    <div style={{
      position: 'absolute', top: 72, left: 28,
      display: 'flex', flexDirection: 'column', gap: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <StatCard label="Total events"  value={stats.total.toLocaleString()} />
      <StatCard label="Major (M6+)"   value={stats.major.toString()} accent="#f0603a" />
      <StatCard label="Avg magnitude" value={`M ${stats.avg.toFixed(2)}`} />
      <StatCard label="Tsunami alerts" value={stats.tsunami.toString()} accent="#4fa3e8" />
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{
      background: 'rgba(6,11,28,0.75)',
      border: '0.5px solid rgba(78,140,220,0.25)',
      borderRadius: 8, padding: '8px 14px',
      backdropFilter: 'blur(8px)',
      minWidth: 150,
    }}>
      <div style={{ fontSize: 10, color: '#4a7aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, color: accent ?? '#e0f0ff' }}>
        {value}
      </div>
    </div>
  )
}