import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import GaugeCluster from './components/GaugeCluster'
import { audioManager } from './utils/AudioManager'
import './styles.css'

function App() {
  const [nightMode, setNightMode] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  useEffect(() => {
    const initAudio = async () => {
      if (!audioInitialized) {
        await audioManager.initialize()
        setAudioInitialized(true)
      }
    }

    const handleClick = () => {
      if (!audioInitialized) {
        initAudio()
      }
    }

    document.addEventListener('click', handleClick, { once: true })
    return () => document.removeEventListener('click', handleClick)
  }, [audioInitialized])

  const handleNightMode = () => {
    setNightMode(!nightMode)
    if (audioInitialized) {
      audioManager.generateTone(800, 0.1, 0.2)
    }
  }

  const handleReset = () => {
    if (audioInitialized) {
      audioManager.generateTone(600, 0.1, 0.2)
    }
  }

  return (
    <div className={`app ${nightMode ? 'night-mode' : ''}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={nightMode ? 0.05 : 0.1} />
          <pointLight position={[10, 10, 10]} intensity={nightMode ? 0.3 : 0.5} color="#ffd700" />
          <pointLight position={[-10, -10, -5]} intensity={nightMode ? 0.2 : 0.3} color="#ff6b35" />
          <spotLight 
            position={[0, 0, 15]} 
            angle={0.6} 
            penumbra={0.5} 
            intensity={nightMode ? 0.5 : 1}
            color={nightMode ? "#ffaa00" : "#ffffff"}
            castShadow
          />
          
          <GaugeCluster nightMode={nightMode} />
          
          <Environment preset="night" />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={5}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
      
      <div className="ui-overlay">
        <div className="title">
          <h1>REPSPHERES SALES COCKPIT</h1>
          <p>Elite Performance Dashboard</p>
        </div>
        
        <div className="controls">
          <button className={`night-mode ${nightMode ? 'active' : ''}`} onClick={handleNightMode}>
            {nightMode ? 'Day Mode' : 'Night Mode'}
          </button>
          <button className="reset-view" onClick={handleReset}>Reset View</button>
        </div>
      </div>
    </div>
  )
}

export default App