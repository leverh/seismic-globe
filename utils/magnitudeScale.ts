import * as THREE from 'three'

export function magnitudeToColor(magnitude: number): THREE.Color {
  if (magnitude >= 7)   return new THREE.Color('#e02020')
  if (magnitude >= 6)   return new THREE.Color('#f0603a')
  if (magnitude >= 5)   return new THREE.Color('#f0a030')
  if (magnitude >= 4)   return new THREE.Color('#f0c040')
  return new THREE.Color('#ffffff')
}

export function magnitudeToSize(magnitude: number): number {
  return Math.max(0.004, (magnitude - 2) * 0.006)
}