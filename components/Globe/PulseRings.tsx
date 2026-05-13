'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { geoToCartesian } from '@/utils/geoToCartesian'
import { EarthquakeFeature } from '@/types/earthquake'

interface Props {
  earthquakes: EarthquakeFeature[]
}

const up = new THREE.Vector3(0, 1, 0)

export default function PulseRings({ earthquakes }: Props) {
  const groupRef  = useRef<THREE.Group>(null)
  const progress  = useRef<number[]>([])

  const recent = useMemo(() =>
    [...earthquakes]
      .sort((a, b) => b.properties.time - a.properties.time)
      .slice(0, 10),
    [earthquakes]
  )

  useMemo(() => {
    progress.current = recent.map((_, i) => i / recent.length)
  }, [recent])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      progress.current[i] = (progress.current[i] + delta * 0.5) % 1
      const p = progress.current[i]
      child.scale.setScalar(0.01 + p * 0.08)
      ;(child as THREE.Mesh).material &&
        ((child as any).material.opacity = (1 - p) * 0.8)
    })
  })

  return (
    <group ref={groupRef}>
      {recent.map((quake, i) => {
        const [lng, lat] = quake.geometry.coordinates
        const pos        = geoToCartesian(lat, lng, 1.013)
        const position   = new THREE.Vector3(pos.x, pos.y, pos.z)

        // quaternion that rotates the ring to face outward from globe center
        const normal = position.clone().normalize()
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal)

        return (
          <mesh
            key={quake.id}
            position={position}
            quaternion={quaternion}
          >
            <ringGeometry args={[0.6, 1, 32]} />
            <meshBasicMaterial
              color={quake.properties.mag >= 6 ? '#f0603a' : '#4fa3e8'}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}