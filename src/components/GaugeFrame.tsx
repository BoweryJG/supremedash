import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface GaugeFrameProps {
  color: string
  nightMode?: boolean
}

const GaugeFrame: React.FC<GaugeFrameProps> = ({ color, nightMode = false }) => {
  const outerRingRef = useRef<Mesh>(null)
  const innerRingRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = clock.elapsedTime * 0.1
    }
  })

  return (
    <group>
      <mesh ref={outerRingRef} position={[0, 0, 0.05]}>
        <ringGeometry args={[0.9, 1.0, 64]} />
        <meshPhysicalMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      <mesh position={[0, 0, 0.03]}>
        <ringGeometry args={[0.85, 0.9, 64]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh ref={innerRingRef} position={[0, 0, 0.02]}>
        <circleGeometry args={[0.85, 64]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.1}
          roughness={0.9}
          transparent
          opacity={0.95}
        />
      </mesh>

      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x = Math.cos(angle) * 0.92
        const y = Math.sin(angle) * 0.92
        
        return (
          <mesh 
            key={i} 
            position={[x, y, 0.06]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <boxGeometry args={[0.02, 0.06, 0.01]} />
            <meshPhysicalMaterial
              color="#666666"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        )
      })}

      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.05, 16]} />
        <meshPhysicalMaterial
          color="#333333"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.88, 64]} />
        <meshPhysicalMaterial
          color="#2a2a2a"
          metalness={0}
          roughness={0}
          transmission={0.98}
          thickness={0.01}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.15}
          ior={1.1}
        />
      </mesh>
    </group>
  )
}

export default GaugeFrame