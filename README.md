# Supreme Sales Dashboard

## 🎯 Elite Performance Cockpit

An iconic, collectible-grade 3D gauge cluster built with Three.js and React Three Fiber. Inspired by vintage performance dashboards and Swiss chronograph watches, this is the centerpiece of an elite mobile-first sales platform.

## ✨ Features

### 🔵 Gauge Cluster (5 Gauges)
- **Quota (%)** - Sales quota completion percentage
- **Pipeline Health (%)** - Pipeline quality indicator  
- **Revenue (K/mo)** - Monthly revenue performance
- **Activity Score** - Sales activity metrics
- **Win Rate (%)** - Deal closure percentage

### 🎨 Visual Style
- **Brushed aluminum** gauge faces with subtle radial etching
- **Chrome needles** with red tips and jeweled pivot points
- **High-polygon metal bezels** with reflective Fresnel shaders
- **Swiss-made tachometer typography** with engraved numerals
- **Real-time physics** animations with inertia and bounce

### 🌀 Interactions & Effects
- **Hover expansion** with cinematic camera effects
- **Night mode** toggle with warm backlit gauges
- **Interactive tooltips** with live data and trends
- **GSAP spring physics** for needle transitions
- **Bloom & chromatic aberration** post-processing
- **Premium audio effects** (optional)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧰 Technology Stack

- **React 19** + **TypeScript**
- **Three.js** + **React Three Fiber**
- **@react-three/drei** for helpers
- **@react-three/postprocessing** for effects
- **GSAP** for premium animations
- **Vite** for lightning-fast development

## 🎮 Usage

1. **Launch** the application
2. **Click anywhere** to enable premium audio experience
3. **Hover** over gauges for detailed tooltips
4. **Toggle Night Mode** for ambient cockpit lighting
5. **Use mouse** to orbit and zoom the camera
6. **Click gauges** for satisfying rotation animations

## 🎨 Customization

The dashboard values can be easily customized in `src/components/GaugeCluster.tsx`:

```tsx
const gauges = [
  {
    label: "QUOTA",
    value: 87,        // Current value
    max: 100,         // Maximum value
    unit: "%",        // Display unit
    color: "#00ff88", // Theme color
    // ... position and type
  }
  // ... more gauges
]
```

## 🎯 Performance

- Optimized for **60 FPS** on mobile devices
- **High-DPI** display support
- **Efficient rendering** with Three.js best practices
- **Responsive design** for all screen sizes

## 🔊 Audio Features

- **Ambient cabin hum** for immersion
- **Needle snap** sound effects
- **Interactive tones** for UI feedback
- **Auto-initialization** on first user interaction

---

*"This isn't UI. This is a tool of ritual. Every screw, glow, and twitch whispers: You're in control now."*