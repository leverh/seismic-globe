'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { geoToCartesian } from '@/utils/geoToCartesian'
import { useTectonicData } from '@/hooks/useTectonicData'

export default function TectonicLines() {
  const { data } = useTectonicData()

  const lineSegments = useMemo(() => {
    if (!data?.features) return null

    const points: THREE.Vector3[] = []

    data.features.forEach((feature: any) => {
      const coords: [number, number][] = feature.geometry.coordinates
      for (let i = 0; i < coords.length - 1; i++) {
        const a = geoToCartesian(coords[i][1],   coords[i][0],   1.02)
        const b = geoToCartesian(coords[i+1][1], coords[i+1][0], 1.02)
        points.push(new THREE.Vector3(a.x, a.y, a.z))
        points.push(new THREE.Vector3(b.x, b.y, b.z))
      }
    })

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [data])

  if (!lineSegments) return null

  return (
    <lineSegments geometry={lineSegments}>
      <lineBasicMaterial
        color="#4fa3e8"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </lineSegments>
  )
}