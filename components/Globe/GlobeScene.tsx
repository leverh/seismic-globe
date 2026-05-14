'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import EarthMesh from './EarthMesh'
import EarthquakeMarkers from './EarthquakeMarkers'
import PulseRings from './PulseRings'
import AtmosphereGlow from './AtmosphereGlow'
import TectonicLines from './TectonicLines'
import HUD from '@/components/UI/HUD'
import FilterPanel from '@/components/UI/FilterPanel'
import StatsPanel from '@/components/UI/StatsPanel'
import { useEarthquakeData } from '@/hooks/useEarthquakeData'
import { useGlobeStore } from '@/store/globeStore'
import { useGlobeCamera } from '@/hooks/useGlobeCamera'

export default function GlobeScene() {
  const minMag = useGlobeStore(s => s.minMag)
  const days   = useGlobeStore(s => s.days)
  const { data, isLoading } = useEarthquakeData(days, minMag)
  const earthquakes = data?.features ?? []
  const { controlsRef, flyTo, resetCamera  } = useGlobeCamera()

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }} style={{ background: '#060b14' }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={1.8} />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} />
        <Stars radius={300} depth={60} count={4000} factor={3} fade />
        <AtmosphereGlow />
        <EarthMesh />
        <TectonicLines />
        <EarthquakeMarkers earthquakes={earthquakes} flyTo={flyTo} />
        <PulseRings earthquakes={earthquakes} />
        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
      <HUD earthquakes={earthquakes} isLoading={isLoading} onReset={resetCamera} />
      <StatsPanel earthquakes={earthquakes} />
      <FilterPanel />
    </div>
  )
}