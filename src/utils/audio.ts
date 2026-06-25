/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Web Audio API Sound Synthesizer
 * Generates custom synthesized sounds matching user specifications.
 */

// Load persistent settings from localStorage with safe fallback defaults
let sfxEnabled = true;
let bgmEnabled = true;

if (typeof window !== 'undefined') {
  try {
    const savedSfx = localStorage.getItem('game_sfx_enabled');
    if (savedSfx !== null) sfxEnabled = savedSfx === 'true';
    const savedBgm = localStorage.getItem('game_bgm_enabled');
    if (savedBgm !== null) bgmEnabled = savedBgm !== 'false';
  } catch (e) {
    console.warn('LocalStorage settings access denied:', e);
  }
}

let audioCtx: AudioContext | null = null;
let scannerInterval: any = null;
let bgmNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('game_sfx_enabled', String(enabled));
    } catch (e) {}
  }
}

export function isBgmEnabled(): boolean {
  return bgmEnabled;
}

export function setBgmEnabled(enabled: boolean) {
  bgmEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('game_gm_enabled', String(enabled)); // maintain compat
      localStorage.setItem('game_bgm_enabled', String(enabled));
    } catch (e) {}
  }
  if (enabled) {
    startBgmSound();
  } else {
    stopBgmSound();
  }
}

export const BGM_TRACKS = {
  cover: '/music/cover.mp3',
  ending: '/music/ending.mp3',
  food: '/music/food.mp3',
  // Battles
  battle_uganda: '/music/battle_uganda.mp3',
  battle_fang: '/music/battle_fang.mp3',
  battle_yamamoto: '/music/battle_yamamoto.mp3',
  battle_murashita: '/music/battle_murashita.mp3',
  // Locations
  baoshan: '/music/baoshan.mp3',
  shrine: '/music/shrine.mp3',
  ch_high: '/music/ch_high.mp3',
  huayang: '/music/huayang.mp3',
  council: '/music/council.mp3',
  zhongshan_ele: '/music/zhongshan_ele.mp3',
  seafood_supermarket: '/music/seafood_supermarket.mp3',
  zhongshan_soy: '/music/zhongshan_soy.mp3',
  jinde: '/music/jinde.mp3'
};

export const BGM_DRIVE_BACKUPS = {
  cover: '1W93M9AIU9e21lOi2-VDdPRdg8PuasdAu',
  ending: '1OaeIOdis5Xww4VNlIQvgF7u9BkMLpXQY',
  food: '1_7r_gg0Za5rC36jq1YoAKtrQJP4Uq77L',
  battle_uganda: '1SylhUEPQBI19JSJLQaAobHgrGET_n0Ze',
  battle_fang: '1OWkdjVzbnCDZxzF7XCX4UiFeWAff5yPn',
  battle_yamamoto: '1Zfp6sO76Bl5NgeMHI6Ho3SzZ6Es-4W8Y',
  battle_murashita: '1OWkdjVzbnCDZxzF7XCX4UiFeWAff5yPn',
  baoshan: '1WZQaww4_DVJ5tZUwsOwUHsLxZAFmIB_H',
  shrine: '1Iu-61McZQPNK-snE2Ct18avyr5zW_E3D',
  ch_high: '16oCCB3_C_6VvmvQijluw0Qz-1sK5oiqh',
  huayang: '1OliER0rlo9cfF1F1KahyVeWx1sbFx0vW',
  council: '1xYLt4XOo9-h-IUyJEw7Q_-jgPIoWRqKI',
  zhongshan_ele: '1zcG8SOF4U8nUI2Av2P1AfHcwvuqUIzSd',
  seafood_supermarket: '1t0SMiXFCNDJLbd4U2fCnmujktIGTgImB',
  zhongshan_soy: '1adqa23PCqpTtcFz9bHJrXHRkWHguSxiW',
  jinde: '1KzZSOa1QicSt_ZWTUKE07korIPhMpv76'
};

let sharedAudio: HTMLAudioElement | null = null;
let currentTrackKey: keyof typeof BGM_TRACKS | null = null;
let hasRegisteredInteractionListener = false;

function getSharedAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = document.createElement('audio');
    sharedAudio.loop = true;
    sharedAudio.volume = 0.45;
  }
  return sharedAudio;
}

function ensureInteractionPlay() {
  if (hasRegisteredInteractionListener) return;
  if (typeof window === 'undefined') return;

  const startOnInteraction = () => {
    const audio = getSharedAudio();
    if (bgmEnabled && audio && audio.paused) {
      console.log("[BGM] Autoplay resume triggered by user interaction");
      audio.play().catch(e => {
        console.warn("[BGM] Audio play on interaction failed:", e);
      });
    }
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener('click', startOnInteraction);
    window.removeEventListener('touchstart', startOnInteraction);
    window.removeEventListener('keydown', startOnInteraction);
    hasRegisteredInteractionListener = false;
  };

  window.addEventListener('click', startOnInteraction);
  window.addEventListener('touchstart', startOnInteraction);
  window.addEventListener('keydown', startOnInteraction);
  hasRegisteredInteractionListener = true;
}

export function playBgm(trackKey: keyof typeof BGM_TRACKS) {
  if (typeof window === 'undefined') return;

  if (!bgmEnabled) {
    currentTrackKey = trackKey;
    return;
  }

  const audio = getSharedAudio();
  if (!audio) return;

  if (currentTrackKey === trackKey && !audio.paused) {
    return;
  }

  console.log(`[BGM] Switching BGM track to: ${trackKey}`);

  currentTrackKey = trackKey;
  const localUrl = BGM_TRACKS[trackKey];
  audio.src = localUrl;
  audio.volume = 0.45;

  let retries = 0;
  let triedBackup = false;

  audio.onerror = () => {
    if (currentTrackKey !== trackKey) return;

    // Fast-fallback to direct Google Drive download URL from the user's secure client browser
    if (!triedBackup) {
      const driveId = BGM_DRIVE_BACKUPS[trackKey];
      if (driveId) {
        triedBackup = true;
        const backupUrl = `https://docs.google.com/uc?export=download&id=${driveId}`;
        console.warn(`[BGM] Play error on local track ${trackKey}. Instantly falling back to Google Drive direct URL: ${backupUrl}`);
        audio.src = backupUrl;
        audio.load();
        audio.play().catch(err => {
          console.warn("[BGM] Direct Google Drive play failed, continuing retry loop:", err);
        });
        return;
      }
    }

    console.warn(`[BGM] Play error on local track ${trackKey} (Retry ${retries + 1}/5). Retrying...`);
    if (retries < 5 && currentTrackKey === trackKey) {
      retries++;
      setTimeout(() => {
        if (currentTrackKey === trackKey && bgmEnabled) {
          if (triedBackup) {
            const driveId = BGM_DRIVE_BACKUPS[trackKey];
            audio.src = `https://docs.google.com/uc?export=download&id=${driveId}`;
          } else {
            audio.src = BGM_TRACKS[trackKey];
          }
          audio.load();
          audio.play().catch(() => {});
        }
      }, 1500);
    }
  };

  audio.play().catch(err => {
    console.warn("BGM play was blocked/failed (autoplay restrictions, retrying on interaction):", err);
  });

  ensureInteractionPlay();
}

export function startBgmSound() {
  if (!bgmEnabled) return;
  if (currentTrackKey) {
    const lastKey = currentTrackKey;
    currentTrackKey = null; // force reload
    playBgm(lastKey);
  } else {
    playBgm('cover');
  }
}

export function stopBgmSound() {
  const audio = getSharedAudio();
  if (audio) {
    try {
      audio.pause();
    } catch (e) {}
  }
}

/**
 * Plays a cute woodblock or bubble dull click "ㄉㄡ" (dou) sound effect for dialogue clicks
 */
export function playClickSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // "ㄉㄡ" (dou) tone: Soft low-frequency round pop bubble-like sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);

  gainNode.gain.setValueAtTime(0.24, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * Plays a selection/option choice click sound effect
 */
export function playChoiceSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Balanced synthetic option tick response
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Starts scanner sound loops (ㄅㄧˉㄅㄧˉㄅㄧˉ) on a constant interval until stopScannerSound is requested
 */
export function startScannerSound(isHazardous: boolean = false) {
  // Always stop existing loop before starting a new one
  stopScannerSound();

  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const playSingleCycle = () => {
    const now = ctx.currentTime;
    
    if (isHazardous) {
      // 1. HAZARDOUS (黑燈/劇毒): Express, panic-inducing rapid heartbeat and rising frequency sweeps
      // Play a frantic double alarm beeps and double thump heart pulses, gliding higher in pitch
      const pitchOffset = Math.sin(Date.now() / 1500) * 150; // slow ominous pitch waviness
      
      // Frantic alarm scream beep
      const screamAlarms = [0.0, 0.08];
      screamAlarms.forEach((delay) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sawtooth';
        // Base pitch rises and has panic warble
        const baseFreq = 2200 + pitchOffset; 
        osc.frequency.setValueAtTime(baseFreq, now + delay);
        osc.frequency.linearRampToValueAtTime(baseFreq + 350, now + delay + 0.05); // high scream glide upwards
        
        gainNode.gain.setValueAtTime(0.08, now + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, now + delay);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.07);
      });

      // Frantic rising heartbeat sweeps (thump-thump)
      const heartbeats = [0.13, 0.19];
      heartbeats.forEach((delay, heartIdx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        // Heart rate frequencies rise on successive pulse, from 80 to 96 Hz
        const startHertz = heartIdx === 0 ? 80 : 96;
        osc.frequency.setValueAtTime(startHertz, now + delay);
        osc.frequency.exponentialRampToValueAtTime(35, now + delay + 0.08); // downward kick
        
        gain.gain.setValueAtTime(0.42, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.1);
      });

    } else {
      // 2. NORMAL (🟢/🟡 / 🔴): Calm standard triplet beeps
      const timings = [0.0, 0.06, 0.12];
      timings.forEach((delay) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1550, now + delay);
        
        gainNode.gain.setValueAtTime(0.045, now + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.05);
      });
    }
  };

  playSingleCycle();
  // Loop rate: 290ms for fast hazardous heart rate increase, 650ms for normal calm beeps
  const cycleRate = isHazardous ? 290 : 650;
  scannerInterval = setInterval(playSingleCycle, cycleRate);
}

/**
 * Stops scanner sound loops
 */
export function stopScannerSound() {
  if (scannerInterval) {
    clearInterval(scannerInterval);
    scannerInterval = null;
  }
}

/**
 * Plays a cloth or pouch stuffing sound (收進布或者褲子、口袋內摩擦雜音) when getting items/tools
 */
export function playItemObtainedSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  
  // Make a noise buffer representing cloth fabric friction rubs
  const bufferSize = ctx.sampleRate * 0.35; // 0.35 seconds length
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  
  // Bandpass filtering turns raw noise into pocket rubbing frequencies
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(350, now);
  filter.frequency.exponentialRampToValueAtTime(150, now + 0.3);
  filter.Q.value = 1.0;
  
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.0, now);
  gainNode.gain.linearRampToValueAtTime(0.22, now + 0.04); // subtle attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
  
  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  noiseSource.start(now);
  noiseSource.stop(now + 0.36);

  // Overlay a low triangle glide simulation representing weight dropping into a bag
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, now + 0.04);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
  
  oscGain.gain.setValueAtTime(0.14, now + 0.04);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  
  osc.start(now + 0.04);
  osc.stop(now + 0.22);
}

// Retro-compatible sparkly/recovering sparkle sound effect alias
export function playSparkleSound() {
  playItemObtainedSound();
}

/**
 * Plays the iconic Boss Fight/Triumph sequence: "ㄉㄥˇ ㄉㄥˊ ㄉㄥˊ ㄉㄣ"
 * Sharpened and modernized with vibrant brassy saw synth, snappy attack, and ring modulation!
 */
export function playVictorySound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Super cheerful, rapid, and majestic major arpeggio with high energy and crystal clarity
  const notes = [
    { freq: 523.25, delay: 0.0, duration: 0.11 },  // C5
    { freq: 659.25, delay: 0.08, duration: 0.11 }, // E5
    { freq: 783.99, delay: 0.16, duration: 0.11 }, // G5
    { freq: 1046.50, delay: 0.24, duration: 0.13 }, // C6
    { freq: 1174.66, delay: 0.34, duration: 0.13 }, // D6
    { freq: 1318.51, delay: 0.44, duration: 0.15 }, // E6
    { freq: 1567.98, delay: 0.58, duration: 1.8 }   // G6 (Brilliant high major root!)
  ];

  notes.forEach((note, idx) => {
    // Sharp brass sound synthesis
    const playHarmonic = (frequency: number, type: OscillatorType, volume: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now + note.delay);

      // Pitch glide adds bright heroic attack
      osc.frequency.linearRampToValueAtTime(frequency * 1.02, now + note.delay + 0.03);

      if (idx === 6) {
        // Vibrato swell for the epic climax note
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.value = 6.5; // Vibrato speed
        vibratoGain.gain.value = 8; // pitch variance
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(now + note.delay);
        vibrato.stop(now + note.delay + note.duration);
      }

      // Sharpened resonance lowpass sweeps to simulate authentic brass synth filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now + note.delay);
      filter.frequency.exponentialRampToValueAtTime(idx === 6 ? 4000 : 2200, now + note.delay + 0.1);
      filter.Q.value = 3.5; // Extra sharp resonance filter accent

      // Attack transient is snappier
      gainNode.gain.setValueAtTime(0.0, now + note.delay);
      gainNode.gain.linearRampToValueAtTime(volume, now + note.delay + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.delay + note.duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + note.delay);
      osc.stop(now + note.delay + note.duration + 0.1);
    };

    // Synthesize extremely rich brass/saw elements with sharper harmonics
    playHarmonic(note.freq, 'sawtooth', 0.24); // Powerful sharp saw core
    playHarmonic(note.freq * 1.5, 'square', 0.06); // Snappy subharmonic/fifth square
    playHarmonic(note.freq * 2.0, 'sawtooth', 0.12); // Super brilliant sharp upper octave saw
    playHarmonic(note.freq * 2.5, 'sine', 0.05); // High crystal sparkle harmonic

    // Final epic climax chord gets extra backing brass and golden harmony
    if (idx === 6) {
      playHarmonic(261.63, 'sawtooth', 0.15); // Deep C4 sub-bass rumble
      playHarmonic(523.25, 'sawtooth', 0.15); // C5 lower octave layer
      playHarmonic(659.25, 'triangle', 0.12); // E5 third harmony
      playHarmonic(783.99, 'sawtooth', 0.10); // G5 fifth harmony
      playHarmonic(1046.50, 'sawtooth', 0.10); // C6 clear upper harmony
      playHarmonic(1318.51, 'sine', 0.07); // E6 crystal shimmer
    }
  });
}

/**
 * Plays a rapid, tense double heart thump sound
 */
export function playHeartbeatSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  
  // Thump-thump heartbeat
  const beats = [0.0, 0.18];
  beats.forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, now + delay);
    osc.frequency.exponentialRampToValueAtTime(25, now + delay + 0.12);
    
    gain.gain.setValueAtTime(0.45, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + delay);
    osc.stop(now + delay + 0.15);
  });
}

/**
 * Plays high-pitched, rapid, piercing triple warning beeps (like digital aircraft cockpit system alerts)
 */
export function playCockpitWarningSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  
  // Rapid cockpit Triple Warning Beeps
  const beeps = [0.0, 0.07, 0.14];
  beeps.forEach((delay) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'square'; // Digital electronic alert buzzer tone
    osc.frequency.setValueAtTime(3000, now + delay); // ultra high alert frequency
    
    gainNode.gain.setValueAtTime(0.09, now + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now + delay);
    osc.stop(now + delay + 0.06);
  });
}

/**
 * Plays a loud, heavy physical collision / explosion impact (碰) sound
 */
export function playPlayerHurtSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // Dense low frequency thump (the primary body/bass of "碰")
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  
  subOsc.type = 'triangle';
  subOsc.frequency.setValueAtTime(145, now);
  subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.38);
  
  subGain.gain.setValueAtTime(0.72, now); // Loud base punch
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.4);

  // Severe dramatic noise explosion blast
  const bufferSize = ctx.sampleRate * 0.45;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(45, now + 0.42);
  filter.Q.value = 4.2; // Extra punchy resonance
  
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.55, now); // Loud friction rumble
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
  
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  
  noise.start(now);
  noise.stop(now + 0.46);
}

/**
 * Plays an organic throat "Urgh!" grunt sound simulating a robust man's voice (惡阿)
 */
export function playEnemyHurtSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // Combine low detuned sawtooths for thick vocal buzzing cords
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const osc3 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Specific vocal tract formant styling (Ooh-Ah)
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(460, now); // Closed vocal tone
  filter.frequency.linearRampToValueAtTime(820, now + 0.28); // Slide open "O" -> "A" (惡 -> 阿)
  filter.Q.value = 3.8;
  
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(120, now);
  osc1.frequency.exponentialRampToValueAtTime(82, now + 0.28);
  
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(124, now);
  osc2.frequency.exponentialRampToValueAtTime(85, now + 0.28);
  osc2.detune.value = 18;
  
  osc3.type = 'triangle'; // round thickness
  osc3.frequency.setValueAtTime(60, now);
  osc3.frequency.exponentialRampToValueAtTime(41, now + 0.28);
  
  gainNode.gain.setValueAtTime(0.0, now);
  gainNode.gain.linearRampToValueAtTime(0.58, now + 0.035); // Fast grunt onset
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  
  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(gainNode); // Sub-harmonic direct feed
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  osc1.stop(now + 0.3);
  osc2.stop(now + 0.3);
  osc3.stop(now + 0.3);
}

/**
 * Plays a longer, dramatic fading groan simulating a giant dynamic death scream (惡阿阿阿)
 */
export function playEnemyDeathSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const osc3 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(500, now);
  filter.frequency.linearRampToValueAtTime(950, now + 1.0);
  filter.Q.value = 4.2;
  
  // Aggressive gargling vibration LFO to emulate dynamic roaring scream cracks
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 15; // vibrating rate
  lfoGain.gain.value = 28;  // dramatic detuning
  
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(135, now);
  osc1.frequency.linearRampToValueAtTime(55, now + 1.0);
  
  osc2.type = 'square'; // buzzing overdrive
  osc2.frequency.setValueAtTime(139, now);
  osc2.frequency.linearRampToValueAtTime(57, now + 1.0);
  
  osc3.type = 'triangle';
  osc3.frequency.setValueAtTime(67, now);
  osc3.frequency.linearRampToValueAtTime(28, now + 1.0);
  
  gainNode.gain.setValueAtTime(0.0, now);
  gainNode.gain.linearRampToValueAtTime(0.6, now + 0.06);
  gainNode.gain.setValueAtTime(0.6, now + 0.35);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.35);
  
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);
  lfoGain.connect(osc2.frequency);
  
  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(gainNode);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  lfo.start(now);
  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  
  lfo.stop(now + 1.4);
  osc1.stop(now + 1.4);
  osc2.stop(now + 1.4);
  osc3.stop(now + 1.4);
}

/**
 * Plays a pitch-descending Doppler vocal scream simulating falling off a cliff deep into an abyss (阿阿阿...)
 */
export function playPlayerDeathSound() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Desperate high pitch scream filter
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1150, now);
  filter.frequency.exponentialRampToValueAtTime(300, now + 1.8); // Drop down Doppler sweep
  filter.Q.value = 3.8;
  
  // Terror rattle wobble LFO
  const screamLfo = ctx.createOscillator();
  const screamLfoGain = ctx.createGain();
  screamLfo.frequency.value = 19; // tremulous panic
  screamLfoGain.gain.value = 45;
  
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(460, now); // Shrilling scream high start
  osc1.frequency.exponentialRampToValueAtTime(90, now + 1.8);
  
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(464, now);
  osc2.frequency.exponentialRampToValueAtTime(92, now + 1.8);
  
  gainNode.gain.setValueAtTime(0.0, now);
  gainNode.gain.linearRampToValueAtTime(0.52, now + 0.08); // Screams up
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.95); // Descends into absolute deep silence
  
  screamLfo.connect(screamLfoGain);
  screamLfoGain.connect(osc1.frequency);
  screamLfoGain.connect(osc2.frequency);
  
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  screamLfo.start(now);
  osc1.start(now);
  osc2.start(now);
  
  screamLfo.stop(now + 2.0);
  osc1.stop(now + 2.0);
  osc2.stop(now + 2.0);
}
