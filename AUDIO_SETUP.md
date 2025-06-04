# Audio Setup Guide for RepSpheres Sales Cockpit

## Adding Rich Audio to Your Dashboard

The dashboard supports professional audio effects but currently uses generated tones as fallback. To add rich audio:

### Required Audio Files

Place these files in `/public/sounds/`:

1. **tick.mp3** - Mechanical tick sound
   - Duration: 50-100ms
   - Style: Watch/clock tick, mechanical relay click
   - Example: Luxury watch tick, vintage clock mechanism

2. **snap.mp3** - Satisfying snap/click sound  
   - Duration: 100-200ms
   - Style: Switch engaging, metal snap, precision click
   - Example: High-end camera shutter, toggle switch

3. **ambient.mp3** - Background ambience
   - Duration: 2-10 seconds (will loop)
   - Style: Cabin hum, electrical buzz, machine room
   - Example: Luxury car interior, aircraft cockpit ambience

### Where to Get Audio

#### Free Sources:
- [Freesound.org](https://freesound.org) - Community sounds (check licenses)
- [Zapsplat.com](https://www.zapsplat.com) - Free with account
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/) - Archive collection

#### Premium Sources:
- [AudioJungle](https://audiojungle.net) - Professional sound effects
- [Pond5](https://www.pond5.com) - High-quality audio library
- [Epidemic Sound](https://www.epidemicsound.com) - Subscription service

#### AI Generation:
- [ElevenLabs](https://elevenlabs.io) - AI sound effects
- [Mubert](https://mubert.com) - AI-generated music/ambience

### Audio Specifications

- **Format**: MP3 (preferred) or WAV
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128-320 kbps for MP3
- **Channels**: Mono or Stereo

### Installation

1. Create the sounds directory:
   ```bash
   mkdir -p public/sounds
   ```

2. Add your audio files:
   ```bash
   public/
     sounds/
       tick.mp3
       snap.mp3
       ambient.mp3
   ```

3. The AudioManager will automatically detect and use these files when available.

### Testing

1. Click anywhere on the page to initialize audio
2. Hover over gauges to hear tick sound
3. Click gauges to hear snap sound
4. Ambient sound can be triggered programmatically

### Fallback Behavior

If audio files are not found, the system automatically falls back to generated tones:
- Tick: 1000Hz tone for 50ms
- Snap: 600Hz tone for 100ms  
- Ambient: 60Hz tone for 2 seconds

This ensures the dashboard always has audio feedback, even without custom files.