class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private enabled: boolean = false

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.enabled = true
      await this.loadSounds()
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }

  private async loadSounds() {
    const soundFiles = [
      { name: 'tick', url: '/sounds/tick.mp3' },
      { name: 'snap', url: '/sounds/snap.mp3' },
      { name: 'ambient', url: '/sounds/ambient.mp3' }
    ]

    for (const sound of soundFiles) {
      try {
        const response = await fetch(sound.url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.sounds.set(sound.name, audioBuffer)
      } catch (error) {
        console.warn(`Failed to load sound ${sound.name}:`, error)
      }
    }
  }

  play(soundName: string, volume: number = 0.3) {
    if (!this.enabled || !this.audioContext || !this.sounds.has(soundName)) {
      return
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = this.sounds.get(soundName)!
    gainNode.gain.value = volume
    
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    source.start(0)
  }

  playTick() {
    this.play('tick', 0.2)
  }

  playSnap() {
    this.play('snap', 0.4)
  }

  playAmbient() {
    this.play('ambient', 0.1)
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