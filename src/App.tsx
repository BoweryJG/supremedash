import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import GaugeCluster from './components/GaugeCluster'
import './styles.css'

function App() {
  return (
    <div className="app">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffd700" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ff6b35" />
          <spotLight 
            position={[0, 0, 15]} 
            angle={0.6} 
            penumbra={0.5} 
            intensity={1}
            color="#ffffff"
            castShadow
          />
          
          <GaugeCluster />
          
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
          <h1>SUPREME SALES COCKPIT</h1>
          <p>Elite Performance Dashboard</p>
        </div>
        
        <div className="controls">
          <button className="night-mode">Night Mode</button>
          <button className="reset-view">Reset View</button>
        </div>
      </div>
    </div>
  )
}

export default App