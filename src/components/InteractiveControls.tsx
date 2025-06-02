import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { gsap } from 'gsap'

interface InteractiveControlsProps {
  onNightMode: (enabled: boolean) => void
  onReset: () => void
}

const InteractiveControls: React.FC<InteractiveControlsProps> = ({ 
  onNightMode, 
  onReset 
}) => {
  const [nightMode, setNightMode] = useState(false)
  const controlsRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (controlsRef.current) {
      controlsRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.01
    }
  })

  const handleNightModeToggle = () => {
    const newNightMode = !nightMode
    setNightMode(newNightMode)
    onNightMode(newNightMode)
    
    if (controlsRef.current) {
      gsap.to(controlsRef.current.rotation, {
        x: controlsRef.current.rotation.x + Math.PI * 0.1,
        duration: 0.3,
        ease: "power2.inOut"
      })
    }
  }

  const handleReset = () => {
    onReset()
    
    if (controlsRef.current) {
      gsap.to(controlsRef.current.scale, {
        x: 1.2, y: 1.2, z: 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      })
    }
  }

  return (
    <group ref={controlsRef} position={[0, -1, 2]}>
      <mesh 
        position={[-1, 0, 0]}
        onClick={handleNightModeToggle}
        onPointerEnter={() => document.body.style.cursor = 'pointer'}
        onPointerLeave={() => document.body.style.cursor = 'none'}
      >
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshPhysicalMaterial
          color={nightMode ? "#ffd700" : "#333333"}
          metalness={0.8}
          roughness={0.2}
          emissive={nightMode ? "#ffaa00" : "#000000"}
          emissiveIntensity={nightMode ? 0.2 : 0}
        />
      </mesh>

      <mesh 
        position={[1, 0, 0]}
        onClick={handleReset}
        onPointerEnter={() => document.body.style.cursor = 'pointer'}
        onPointerLeave={() => document.body.style.cursor = 'none'}
      >
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshPhysicalMaterial
          color="#666666"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

export default InteractiveControls