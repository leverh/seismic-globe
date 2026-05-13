'use client'

import { useTexture } from '@react-three/drei'

export default function EarthMesh() {
  const texture = useTexture('/textures/earth.jpg')

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}