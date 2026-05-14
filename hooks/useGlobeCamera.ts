import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { geoToCartesian } from '@/utils/geoToCartesian'

export function useGlobeCamera() {
  const controlsRef = useRef<any>(null)

  const flyTo = useCallback((lat: number, lng: number) => {
    const controls = controlsRef.current
    if (!controls) return

    const currentDistance = controls.object.position.length()

    const pos      = geoToCartesian(lat, lng, currentDistance)
    const endPos   = new THREE.Vector3(pos.x, pos.y, pos.z)
    const startPos = controls.object.position.clone()
    const startTime = performance.now()
    const duration  = 1400

    controls.autoRotate = false

    const animate = (now: number) => {
      const raw  = Math.min((now - startTime) / duration, 1)
      const ease = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw

      controls.object.position.lerpVectors(startPos, endPos, ease)
      controls.object.lookAt(0, 0, 0)
      controls.update()

      if (raw < 1) {
        requestAnimationFrame(animate)
      } else {
        controls.autoRotate = true
      }
    }

    requestAnimationFrame(animate)
  }, [])

  const resetCamera = useCallback(() => {
  const controls = controlsRef.current
  if (!controls) return

  const endPos    = new THREE.Vector3(0, 0, 2.8)
  const startPos  = controls.object.position.clone()
  const startTime = performance.now()
  const duration  = 1000

  controls.autoRotate = false

  const animate = (now: number) => {
    const raw  = Math.min((now - startTime) / duration, 1)
    const ease = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw

    controls.object.position.lerpVectors(startPos, endPos, ease)
    controls.object.lookAt(0, 0, 0)
    controls.update()

    if (raw < 1) {
      requestAnimationFrame(animate)
    } else {
      controls.autoRotate = true
    }
  }

  requestAnimationFrame(animate)
}, [])

  return { controlsRef, flyTo, resetCamera  }
}