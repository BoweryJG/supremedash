import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Plane, Float, Html } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Extend THREE namespace with any custom geometries
extend({ BoxGeometry: THREE.BoxGeometry });

// AudioManager Singleton
class AudioManager {
  constructor() {
    this.initialized = false;
    this.audioContext = null;
    this.sounds = {};
    this.isPlaying = false;
    this.ambientGain = null;
  }

  async init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Try to load actual sound files first
      try {
        await Promise.all([
          this.loadSound('tick', '/tick.mp3'),
          this.loadSound('snap', '/snap.mp3'),
          this.loadSound('ambient', '/ambient.mp3')
        ]);
      } catch (error) {
        console.log('Could not load sound files, using generated tones instead');
        this.createGeneratedSounds();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  createGeneratedSounds() {
    // Create tick sound (short click)
    this.sounds.tick = () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.05);
    };

    // Create snap sound (mechanical click)
    this.sounds.snap = () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);
      
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
    };

    // Create ambient hum
    this.sounds.ambient = () => {
      if (this.ambientGain) return; // Already playing
      
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      this.ambientGain = gain;
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);
      
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      
      osc1.frequency.value = 60;
      osc2.frequency.value = 120;
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      gain.gain.value = 0.02;
      
      osc1.start();
      osc2.start();
      
      // Store references for stopping
      this.ambientOscillators = [osc1, osc2];
    };
  }

  async loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    this.sounds[name] = () => {
      const source = this.audioContext.createBufferSource();
      const gain = this.audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gain);
      gain.connect(this.audioContext.destination);
      
      gain.gain.value = name === 'ambient' ? 0.1 : 0.3;
      
      source.start();
      
      if (name === 'ambient') {
        source.loop = true;
        this.ambientSource = source;
      }
    };
  }

  play(soundName) {
    if (!this.initialized || !this.sounds[soundName]) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.sounds[soundName]();
  }

  stopAmbient() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
    
    if (this.ambientOscillators) {
      this.ambientOscillators.forEach(osc => osc.stop());
      this.ambientOscillators = null;
    }
    
    if (this.ambientGain) {
      this.ambientGain = null;
    }
  }
}

const audioManager = new AudioManager();

// GaugeNeedle Component
function GaugeNeedle({ angle, nightMode }) {
  const needleRef = useRef();
  
  useFrame(() => {
    if (needleRef.current) {
      needleRef.current.rotation.z = angle;
    }
  });

  return (
    <group ref={needleRef}>
      {/* Needle */}
      <mesh position={[0, 0.35, 0.02]}>
        <boxGeometry args={[0.02, 0.7, 0.01]} />
        <meshStandardMaterial 
          color="#ff0000" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ff0000"
          emissiveIntensity={nightMode ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Needle tip */}
      <mesh position={[0, 0.68, 0.02]}>
        <coneGeometry args={[0.03, 0.08, 4]} />
        <meshStandardMaterial 
          color="#ff0000" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ff0000"
          emissiveIntensity={nightMode ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Center cap */}
      <mesh position={[0, 0, 0.03]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Center cap detail */}
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 32]} />
        <meshStandardMaterial 
          color="#ff0000" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// GaugeFace Component
function GaugeFace({ max, type, nightMode }) {
  const majorTicks = 11;
  const minorTicks = 50;
  
  const generateSerialNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = '';
    for (let i = 0; i < 8; i++) {
      serial += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return serial;
  };

  return (
    <group>
      {/* Face background */}
      <mesh>
        <circleGeometry args={[0.95, 64]} />
        <meshStandardMaterial 
          color={nightMode ? "#0a0a0a" : "#f5f5f5"} 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>
      
      {/* Major tick marks */}
      {[...Array(majorTicks)].map((_, i) => {
        const angle = (i / (majorTicks - 1)) * Math.PI + Math.PI;
        const x = Math.cos(angle) * 0.85;
        const y = Math.sin(angle) * 0.85;
        
        return (
          <group key={`major-${i}`}>
            <mesh position={[x, y, 0.01]} rotation={[0, 0, angle - Math.PI/2]}>
              <boxGeometry args={[0.02, 0.15, 0.01]} />
              <meshStandardMaterial 
                color={nightMode ? "#ffffff" : "#000000"} 
                emissive={nightMode ? "#ffffff" : "#000000"}
                emissiveIntensity={nightMode ? 0.2 : 0}
              />
            </mesh>
            
            {/* Numbers */}
            <Html
              position={[x * 0.75, y * 0.75, 0.02]}
              center
              style={{
                color: nightMode ? '#ffffff' : '#000000',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                userSelect: 'none',
                textShadow: nightMode ? '0 0 5px rgba(255,255,255,0.5)' : 'none'
              }}
            >
              {Math.round((i / (majorTicks - 1)) * max)}
            </Html>
          </group>
        );
      })}
      
      {/* Minor tick marks */}
      {[...Array(minorTicks)].map((_, i) => {
        if (i % 5 === 0) return null; // Skip major tick positions
        
        const angle = (i / minorTicks) * Math.PI + Math.PI;
        const x = Math.cos(angle) * 0.9;
        const y = Math.sin(angle) * 0.9;
        
        return (
          <mesh key={`minor-${i}`} position={[x, y, 0.01]} rotation={[0, 0, angle - Math.PI/2]}>
            <boxGeometry args={[0.01, 0.08, 0.01]} />
            <meshStandardMaterial 
              color={nightMode ? "#666666" : "#333333"}
              emissive={nightMode ? "#666666" : "#000000"}
              emissiveIntensity={nightMode ? 0.1 : 0}
            />
          </mesh>
        );
      })}
      
      {/* Brand label */}
      <Html
        position={[0, -0.3, 0.02]}
        center
        style={{
          color: nightMode ? '#888888' : '#666666',
          fontSize: '10px',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '1px',
          userSelect: 'none'
        }}
      >
        REPSPHERES series
      </Html>
      
      {/* Serial number */}
      <Html
        position={[0, -0.45, 0.02]}
        center
        style={{
          color: nightMode ? '#666666' : '#999999',
          fontSize: '8px',
          fontFamily: 'monospace',
          userSelect: 'none'
        }}
      >
        SN: {generateSerialNumber()}
      </Html>
    </group>
  );
}

// GaugeFrame Component
function GaugeFrame({ nightMode }) {
  const frameRef = useRef();
  
  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  return (
    <group ref={frameRef}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[1.1, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[0.95, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      
      {/* Glass cover */}
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[1, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={0.95}
          opacity={0.3}
          metalness={0}
          roughness={0}
          thickness={0.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Decorative studs */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 1.1;
        const y = Math.sin(angle) * 1.1;
        
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial 
              color="#silver"
              metalness={0.95}
              roughness={0.1}
              emissive={nightMode ? "#ffffff" : "#000000"}
              emissiveIntensity={nightMode ? 0.1 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// PremiumGauge Component
function PremiumGauge({ label, value, max, unit, position, color, type, nightMode }) {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate needle angle
  const targetAngle = (value / max) * Math.PI;
  const currentAngle = useRef(0);
  
  useEffect(() => {
    gsap.to(currentAngle, {
      current: targetAngle,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (groupRef.current) {
          groupRef.current.needleAngle = currentAngle.current;
        }
      }
    });
    
    gsap.to({ val: displayValue }, {
      val: value,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: function() {
        setDisplayValue(Math.round(this.targets()[0].val));
      }
    });
  }, [value, max, targetAngle, displayValue]);

  // Dynamic color based on value
  const getGaugeColor = () => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return "#00ff00";
    if (percentage > 60) return "#ffff00";
    if (percentage > 40) return "#ff9900";
    return "#ff0000";
  };

  const handlePointerOver = () => {
    setIsHovered(true);
    setShowTooltip(true);
    audioManager.play('tick');
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  const handleClick = () => {
    audioManager.play('snap');
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <Float
        speed={2}
        rotationIntensity={0.1}
        floatIntensity={0.1}
        floatingRange={[-0.05, 0.05]}
      >
        <group scale={isHovered ? 1.05 : 1}>
          <GaugeFrame nightMode={nightMode} />
          <GaugeFace max={max} type={type} nightMode={nightMode} />
          <GaugeNeedle angle={currentAngle.current} nightMode={nightMode} />
          
          {/* Digital display */}
          <group position={[0, 0.5, 0.05]}>
            {/* Display background */}
            <mesh>
              <boxGeometry args={[0.4, 0.2, 0.05]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            
            {/* Display digits */}
            <Html
              center
              position={[0, 0, 0.03]}
              style={{
                color: getGaugeColor(),
                fontSize: '24px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                textShadow: `0 0 10px ${getGaugeColor()}`,
                userSelect: 'none'
              }}
            >
              {displayValue.toString().padStart(2, '0')}{unit}
            </Html>
          </group>
          
          {/* Label */}
          <Html
            center
            position={[0, -1.5, 0]}
            style={{
              color: nightMode ? '#ffffff' : '#000000',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              userSelect: 'none',
              textShadow: nightMode ? '0 0 10px rgba(255,255,255,0.5)' : '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {label}
          </Html>
          
          {/* Chrome bezel */}
          <mesh position={[0, 0, -0.1]}>
            <cylinderGeometry args={[1.25, 1.3, 0.3, 64]} />
            <meshStandardMaterial
              color="#silver"
              metalness={0.95}
              roughness={0.05}
              envMapIntensity={1}
            />
          </mesh>
          
          {/* Tooltip */}
          {showTooltip && (
            <Html
              center
              position={[1.5, 0.5, 0]}
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              <div>
                <strong>{label}</strong><br/>
                Current: {value}{unit}<br/>
                Target: {max}{unit}<br/>
                Progress: {Math.round((value/max)*100)}%
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}

// GaugeCluster Component
function GaugeCluster({ nightMode }) {
  const groupRef = useRef();
  const [gauges] = useState([
    { label: 'QUOTA', value: 75, max: 100, unit: '%', position: [-3, 2, 0], color: '#ffd700', type: 'quota' },
    { label: 'PIPELINE', value: 45, max: 60, unit: 'M', position: [3, 2, 0], color: '#00ff00', type: 'pipeline' },
    { label: 'REVENUE', value: 125, max: 200, unit: 'K', position: [-3, -2, 0], color: '#ff6b6b', type: 'revenue' },
    { label: 'ACTIVITY', value: 85, max: 100, unit: '%', position: [3, -2, 0], color: '#4ecdc4', type: 'activity' },
    { label: 'WIN RATE', value: 68, max: 100, unit: '%', position: [0, 0, -1], color: '#a8e6cf', type: 'winrate' }
  ]);

  useEffect(() => {
    if (groupRef.current) {
      gsap.from(groupRef.current.children, {
        scale: 0,
        y: -5,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {gauges.map((gauge, index) => (
        <PremiumGauge key={index} {...gauge} nightMode={nightMode} />
      ))}
      
      {/* Shadow plane */}
      <Plane 
        args={[20, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -4, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={nightMode ? "#000000" : "#f0f0f0"} 
          opacity={0.5} 
          transparent 
        />
      </Plane>
    </group>
  );
}

// InteractiveControls Component
function InteractiveControls({ nightMode, setNightMode }) {
  const { camera } = useThree();
  
  const handleNightModeToggle = () => {
    setNightMode(!nightMode);
    audioManager.play('snap');
  };
  
  const handleResetView = () => {
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 15,
      duration: 1,
      ease: "power2.inOut"
    });
    gsap.to(camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "power2.inOut"
    });
    audioManager.play('snap');
  };

  return (
    <group position={[0, -5, 0]}>
      {/* Night mode toggle */}
      <mesh 
        position={[-2, 0, 0]}
        onClick={handleNightModeToggle}
        onPointerOver={() => audioManager.play('tick')}
      >
        <boxGeometry args={[1.5, 0.5, 0.2]} />
        <meshStandardMaterial 
          color={nightMode ? "#ffd700" : "#1a1a1a"}
          metalness={0.8}
          roughness={0.2}
          emissive={nightMode ? "#ffd700" : "#000000"}
          emissiveIntensity={nightMode ? 0.3 : 0}
        />
      </mesh>
      <Html position={[-2, 0, 0.15]} center>
        <div style={{ 
          color: 'white', 
          fontSize: '12px', 
          fontWeight: 'bold',
          userSelect: 'none'
        }}>
          {nightMode ? '☀️' : '🌙'}
        </div>
      </Html>
      
      {/* Reset view button */}
      <mesh 
        position={[2, 0, 0]}
        onClick={handleResetView}
        onPointerOver={() => audioManager.play('tick')}
      >
        <boxGeometry args={[1.5, 0.5, 0.2]} />
        <meshStandardMaterial 
          color="#4ecdc4"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Html position={[2, 0, 0.15]} center>
        <div style={{ 
          color: 'white', 
          fontSize: '12px', 
          fontWeight: 'bold',
          userSelect: 'none'
        }}>
          RESET
        </div>
      </Html>
    </group>
  );
}

// Main App Component
export default function SupremeDashboard() {
  const [nightMode, setNightMode] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      if (!audioInitialized) {
        await audioManager.init();
        setAudioInitialized(true);
        audioManager.play('ambient');
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      audioManager.stopAmbient();
    };
  }, [audioInitialized]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: nightMode 
        ? 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)' 
        : 'radial-gradient(ellipse at center, #f5f5f5 0%, #e0e0e0 100%)',
      transition: 'background 0.5s ease'
    }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: nightMode ? 0.8 : 1.2
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={nightMode ? 0.1 : 0.3} />
          <pointLight 
            position={[10, 10, 10]} 
            intensity={nightMode ? 0.5 : 1} 
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight 
            position={[-10, -10, -10]} 
            intensity={nightMode ? 0.2 : 0.5} 
            color={nightMode ? "#4444ff" : "#ffffff"}
          />
          <spotLight
            position={[0, 10, 0]}
            angle={0.5}
            penumbra={1}
            intensity={nightMode ? 0.5 : 1}
            castShadow
          />
          
          {nightMode && (
            <>
              <pointLight position={[0, 0, 5]} intensity={0.2} color="#ff6b6b" />
              <pointLight position={[5, 0, 0]} intensity={0.2} color="#4ecdc4" />
              <pointLight position={[-5, 0, 0]} intensity={0.2} color="#ffd700" />
            </>
          )}

          {/* Main content */}
          <GaugeCluster nightMode={nightMode} />
          <InteractiveControls nightMode={nightMode} setNightMode={setNightMode} />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={30}
            minDistance={5}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: nightMode ? '#ffffff' : '#000000',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textShadow: nightMode ? '0 0 20px rgba(255,255,255,0.5)' : '2px 2px 4px rgba(0,0,0,0.1)',
        userSelect: 'none'
      }}>
        SUPREME DASHBOARD
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: nightMode ? '#888888' : '#666666',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        userSelect: 'none'
      }}>
        Click gauges to interact • Scroll to zoom • Drag to rotate
      </div>

      {/* Loading indicator */}
      {!audioInitialized && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: nightMode ? '#ffffff' : '#000000',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Click anywhere to initialize audio
        </div>
      )}
    </div>
  );
}