import React, { useRef } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import PremiumGauge from './PremiumGauge'

interface GaugeClusterProps {
  nightMode?: boolean
}

const GaugeCluster: React.FC<GaugeClusterProps> = ({ nightMode = false }) => {
  const groupRef = useRef<Group>(null)

  const gauges = [
    {
      label: "QUOTA",
      value: 87,
      max: 100,
      unit: "%",
      position: [-4, 1.5, 0] as [number, number, number],
      color: "#00ff88",
      type: "quota"
    },
    {
      label: "PIPELINE",
      value: 64,
      max: 100,
      unit: "%",
      position: [-2, 1.5, 0] as [number, number, number],
      color: "#ffaa00",
      type: "pipeline"
    },
    {
      label: "REVENUE",
      value: 142,
      max: 200,
      unit: "K/mo",
      position: [0, 1.5, 0] as [number, number, number],
      color: "#ffd700",
      type: "revenue"
    },
    {
      label: "ACTIVITY",
      value: 78,
      max: 100,
      unit: "",
      position: [2, 1.5, 0] as [number, number, number],
      color: "#00aaff",
      type: "activity"
    },
    {
      label: "WIN RATE",
      value: 34,
      max: 100,
      unit: "%",
      position: [4, 1.5, 0] as [number, number, number],
      color: "#ff6b35",
      type: "winrate"
    }
  ]

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.1) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {gauges.map((gauge, index) => (
        <PremiumGauge
          key={`${gauge.type}-${index}`}
          label={gauge.label}
          value={gauge.value}
          max={gauge.max}
          unit={gauge.unit}
          position={gauge.position}
          color={gauge.color}
          type={gauge.type}
          nightMode={nightMode}
        />
      ))}
      
      <mesh position={[0, -2, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial 
          color="#0f0f0f" 
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {gauges.map((gauge, index) => (
        <mesh 
          key={`shadow-${index}`}
          position={[gauge.position[0], gauge.position[1] - 1.8, gauge.position[2] - 0.4]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export default GaugeCluster