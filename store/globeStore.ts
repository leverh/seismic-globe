import { create } from 'zustand'
import { EarthquakeFeature } from '@/types/earthquake'

interface GlobeState {
  selected:    EarthquakeFeature | null
  setSelected: (q: EarthquakeFeature | null) => void
  minMag:      number
  setMinMag:   (m: number) => void
  days:        number
  setDays:     (d: number) => void
}

export const useGlobeStore = create<GlobeState>((set) => ({
  selected:    null,
  setSelected: (q) => set({ selected: q }),
  minMag:      4,
  setMinMag:   (m) => set({ minMag: m }),
  days:        30,
  setDays:     (d) => set({ days: d }),
}))