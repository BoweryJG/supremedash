import { forwardRef } from 'react'
import { Mesh } from 'three'

interface GaugeNeedleProps {
  color: string
}

const GaugeNeedle = forwardRef<Mesh, GaugeNeedleProps>((_, ref) => {
  return (
    <group>
      <mesh ref={ref} position={[0, 0, 0.08]}>
        <group>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.008, 0.7, 0.02]} />
            <meshPhysicalMaterial
              color="#ff4444"
              metalness={0.9}
              roughness={0.1}
              emissive="#ff2222"
              emissiveIntensity={0.2}
            />
          </mesh>
          
          <mesh position={[0, 0.68, 0]}>
            <coneGeometry args={[0.015, 0.04, 8]} />
            <meshPhysicalMaterial
              color="#ff6666"
              metalness={0.8}
              roughness={0.2}
              emissive="#ff3333"
              emissiveIntensity={0.3}
            />
          </mesh>
          
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.02, 0.1, 0.02]} />
            <meshPhysicalMaterial
              color="#888888"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      </mesh>

      <mesh position={[0, 0, 0.09]}>
        <circleGeometry args={[0.03, 16]} />
        <meshPhysicalMaterial
          color="#444444"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[0, 0, 0.095]}>
        <circleGeometry args={[0.015, 16]} />
        <meshPhysicalMaterial
          color="#ff4444"
          metalness={0.8}
          roughness={0.2}
          emissive="#ff2222"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial
          color="#ff4444"
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh position={[0, 0, 0.075]}>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial
          color="#ff2222"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  )
})

GaugeNeedle.displayName = 'GaugeNeedle'

export default GaugeNeedle