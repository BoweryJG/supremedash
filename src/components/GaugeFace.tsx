import React from 'react'
import { Text } from '@react-three/drei'

interface GaugeFaceProps {
  label: string
  max: number
  color: string
}

const GaugeFace: React.FC<GaugeFaceProps> = ({ label, max, color }) => {
  const generateTicks = () => {
    const ticks = []
    const steps = 8
    
    for (let i = 0; i <= steps; i++) {
      const percentage = i / steps
      const angle = -Math.PI * 0.75 + (percentage * Math.PI * 1.5)
      const radius = 0.7
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const value = Math.round((percentage * max))
      
      ticks.push(
        <group key={i}>
          <mesh position={[x * 1.1, y * 1.1, 0.04]}>
            <circleGeometry args={[0.008, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          
          <Text
            position={[x * 1.25, y * 1.25, 0.15]}
            fontSize={0.04}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {value}
          </Text>
        </group>
      )
    }
    
    return ticks
  }

  const generateMinorTicks = () => {
    const ticks = []
    const steps = 32
    
    for (let i = 0; i <= steps; i++) {
      const percentage = i / steps
      const angle = -Math.PI * 0.75 + (percentage * Math.PI * 1.5)
      const radius = 0.78
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (i % 4 !== 0) {
        ticks.push(
          <mesh key={i} position={[x, y, 0.04]}>
            <circleGeometry args={[0.003, 6]} />
            <meshBasicMaterial color="#666666" />
          </mesh>
        )
      }
    }
    
    return ticks
  }

  return (
    <group>
      <Text
        position={[0, 0.6, 0.15]}
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
        font={undefined}
        outlineWidth={0.003}
        outlineColor="#000000"
      >
        {label}
      </Text>

      <Text
        position={[0, -0.5, 0.15]}
        fontSize={0.03}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        SUPREME SERIES
      </Text>

      <Text
        position={[0, -0.6, 0.15]}
        fontSize={0.025}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        EST. 2024
      </Text>

      {generateTicks()}
      {generateMinorTicks()}

      <mesh position={[0, 0.75, 0.04]}>
        <ringGeometry args={[0.03, 0.04, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      <mesh position={[-0.7, -0.2, 0.04]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.06, 0.015, 0.01]} />
        <meshBasicMaterial color="#444444" />
      </mesh>
      
      <Text
        position={[-0.7, -0.35, 0.15]}
        fontSize={0.02}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        S/N: SX{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
      </Text>
    </group>
  )
}

export default GaugeFace