class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private enabled: boolean = false

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.enabled = true
      // Skip loading sound files since they don't exist
      // We'll use generated tones instead
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }

  play(soundName: string, volume: number = 0.3) {
    // Use generated tones instead of loading files
    switch(soundName) {
      case 'tick':
        this.generateTone(1000, 0.05, volume)
        break
      case 'snap':
        this.generateTone(600, 0.1, volume)
        break
      case 'ambient':
        // For ambient, create a low frequency hum
        this.generateTone(60, 2, volume * 0.3)
        break
    }
  }

  playTick() {
    if (!this.enabled || !this.audioContext) return
    this.generateTone(1200, 0.03, 0.2)
  }

  playSnap() {
    if (!this.enabled || !this.audioContext) return
    this.generateTone(800, 0.08, 0.4)
  }

  playAmbient() {
    if (!this.enabled || !this.audioContext) return
    // Create a low frequency hum
    this.generateTone(80, 1.5, 0.05)
  }

  generateTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }
}

export const audioManager = new AudioManager()