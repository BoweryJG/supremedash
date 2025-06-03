import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import { Group, Mesh, MeshBasicMaterial, BoxGeometry } from 'three'
import { gsap } from 'gsap'
import GaugeFrame from './GaugeFrame'
import GaugeNeedle from './GaugeNeedle'
import GaugeFace from './GaugeFace'

interface PremiumGaugeProps {
  label: string
  value: number
  max: number
  unit: string
  position: [number, number, number]
  color: string
  type: string
  nightMode?: boolean
}

const PremiumGauge: React.FC<PremiumGaugeProps> = ({
  label,
  value,
  max,
  unit,
  position,
  color: _color,
  type: _type,
  nightMode: _nightMode = false
}) => {
  const groupRef = useRef<Group>(null)
  const needleRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const ledGlowRef = useRef<Mesh>(null)
  const [currentValue, setCurrentValue] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { } = useThree()

  const needleAngle = useMemo(() => {
    const percentage = Math.min(currentValue / max, 1)
    return -Math.PI * 0.75 + (percentage * Math.PI * 1.5)
  }, [currentValue, max])

  const gaugeColor = useMemo(() => {
    const percentage = currentValue / max
    if (percentage > 0.8) return '#00ff88'
    if (percentage > 0.6) return '#ffd700'
    if (percentage > 0.4) return '#ffaa00'
    return '#ff6b35'
  }, [currentValue, max])

  useEffect(() => {
    gsap.to({ val: currentValue }, {
      val: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: function() {
        setCurrentValue(this.targets()[0].val)
      }
    })
  }, [value])

  useEffect(() => {
    if (needleRef.current) {
      gsap.to(needleRef.current.rotation, {
        z: needleAngle,
        duration: 1.5,
        ease: "elastic.out(1, 0.75)"
      })
    }
  }, [needleAngle])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const idleVibration = Math.sin(clock.elapsedTime * 2) * 0.001
      const hoverScale = isHovered ? 1 + Math.sin(clock.elapsedTime * 4) * 0.02 : 1
      
      groupRef.current.position.x = position[0] + idleVibration
      groupRef.current.position.y = position[1] + Math.cos(clock.elapsedTime * 1.5) * 0.001
      groupRef.current.scale.setScalar(hoverScale)
    }

    if (glowRef.current) {
      const pulseIntensity: number = Math.max(0.3, (currentValue / max) * 0.8);
      (glowRef.current.material as MeshBasicMaterial).opacity = 
        pulseIntensity + Math.sin(clock.elapsedTime * 2) * 0.1
    }

    if (ledGlowRef.current) {
      const ledPulse = 0.3 + Math.sin(clock.elapsedTime * 3) * 0.2;
      (ledGlowRef.current.material as MeshBasicMaterial).opacity = ledPulse
    }
  })

  const handlePointerEnter = () => {
    setIsHovered(true)
    setShowTooltip(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    setShowTooltip(false)
    document.body.style.cursor = 'none'
  }

  const handleClick = () => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut"
      })
    }
  }

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <GaugeFrame color={gaugeColor} />
      <GaugeFace label={label} max={max} color={gaugeColor} />
      <GaugeNeedle ref={needleRef} color={gaugeColor} />
      
      <mesh ref={glowRef} position={[0, 0, 0.1]}>
        <circleGeometry args={[0.85, 32]} />
        <meshBasicMaterial 
          color={gaugeColor}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* LED Display Background */}
      <mesh position={[0, 0.55, 0.05]}>
        <boxGeometry args={[0.4, 0.15, 0.02]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      
      {/* LED Display Frame */}
      <mesh position={[0, 0.55, 0.06]}>
        <boxGeometry args={[0.42, 0.17, 0.01]} />
        <meshBasicMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* LED Glow Effect */}
      <mesh ref={ledGlowRef} position={[0, 0.55, 0.07]}>
        <planeGeometry args={[0.38, 0.13]} />
        <meshBasicMaterial 
          color={gaugeColor}
          transparent
          opacity={0.3}
          blending={2}
        />
      </mesh>

      {/* LED Digital Display */}
      <Text
        position={[0, 0.55, 0.08]}
        fontSize={0.1}
        color={gaugeColor}
        anchorX="center"
        anchorY="middle"
        font={undefined}
        letterSpacing={0.02}
        outlineWidth={0.003}
        outlineColor={gaugeColor}
        outlineOpacity={0.5}
      >
        {Math.round(currentValue).toString().padStart(2, '0')}
      </Text>

      {/* LED Segments Decoration */}
      {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 0.075]}>
          <boxGeometry args={[0.005, 0.08, 0.001]} />
          <meshBasicMaterial 
            color={gaugeColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}

      <Text
        position={[0, -0.3, 0.15]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        outlineWidth={0.002}
        outlineColor="#000000"
      >
        {Math.round(currentValue)}{unit}
      </Text>

      {showTooltip && (
        <Html
          position={[1.2, 0.5, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="gauge-tooltip">
            <div className="value">{Math.round(currentValue)}{unit}</div>
            <div>Target: {max}{unit}</div>
            <div className="delta">
              {currentValue > max * 0.8 ? '+' : ''}
              {((currentValue / max) * 100).toFixed(1)}%
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default PremiumGauge