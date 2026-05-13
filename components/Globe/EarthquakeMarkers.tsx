'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { geoToCartesian } from '@/utils/geoToCartesian'
import { magnitudeToColor, magnitudeToSize } from '@/utils/magnitudeScale'
import { EarthquakeFeature } from '@/types/earthquake'
import { useGlobeStore } from '@/store/globeStore'

interface Props {
  earthquakes: EarthquakeFeature[]
  flyTo: (lat: number, lng: number) => void
}

const dummy     = new THREE.Object3D()
const raycaster = new THREE.Raycaster()

export default function EarthquakeMarkers({ earthquakes, flyTo }: Props) {
  const meshRef     = useRef<THREE.InstancedMesh>(null)
  const { camera, gl } = useThree()
  const setSelected = useGlobeStore(s => s.setSelected)

  const earthquakesRef = useRef(earthquakes)
  const flyToRef       = useRef(flyTo)
  const setSelectedRef = useRef(setSelected)
  useEffect(() => { earthquakesRef.current = earthquakes }, [earthquakes])
  useEffect(() => { flyToRef.current = flyTo }, [flyTo])
  useEffect(() => { setSelectedRef.current = setSelected }, [setSelected])

  useEffect(() => {
    if (!meshRef.current || !earthquakes.length) return
    earthquakes.forEach((quake, i) => {
      const [lng, lat] = quake.geometry.coordinates
      const size       = magnitudeToSize(quake.properties.mag)
      const pos        = geoToCartesian(lat, lng, 1.01)
      dummy.position.set(pos.x, pos.y, pos.z)
      dummy.scale.setScalar(size)
      dummy.lookAt(0, 0, 0)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, magnitudeToColor(quake.properties.mag))
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [earthquakes])

  useEffect(() => {
    const canvas = gl.domElement
    const onClick = (e: MouseEvent) => {
      if (!meshRef.current) return
      const rect  = canvas.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObject(meshRef.current)
      if (hits.length > 0) {
        const idx   = hits[0].instanceId!
        const quake = earthquakesRef.current[idx]
        if (!quake) return
        setSelectedRef.current(quake)
        const [lng, lat] = quake.geometry.coordinates
        flyToRef.current(lat, lng)
      }
    }
    canvas.addEventListener('click', onClick)
    return () => canvas.removeEventListener('click', onClick)
  }, [camera, gl])

  if (!earthquakes.length) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, earthquakes.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial toneMapped={false} />
    </instancedMesh>
  )
}