'use strict';
// Lightweight layered WebAudio effects. Each weapon uses its own transient and body profile.
(() => {
  let ctx = null;
  function ensureAudio() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume?.().catch?.(() => {});
      return ctx;
    } catch (e) {
      console.warn('Audio unavailable', e);
      return null;
    }
  }
  function tone(start, end, duration, volume, type = 'sine', delay = 0) {
    const t = ctx.currentTime + delay,
      o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(30, start), t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, end), t + duration);
    g.gain.setValueAtTime(Math.max(0.0001, volume), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + duration);
  }
  function noise(duration, volume, frequency = 1800, filterType = 'lowpass', delay = 0) {
    const rate = ctx.sampleRate,
      length = Math.max(1, Math.floor(rate * duration)),
      buffer = ctx.createBuffer(1, length, rate),
      data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - (i / length) * 0.35);
    const t = ctx.currentTime + delay,
      source = ctx.createBufferSource(),
      filter = ctx.createBiquadFilter(),
      gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.setValueAtTime(frequency, t);
    gain.gain.setValueAtTime(Math.max(0.0001, volume), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(t);
    source.stop(t + duration);
  }
  function sfx(type, vol = 0.1) {
    if (!ctx) return;
    const v = Math.min(0.44, vol * 3.1);
    if (type === 'pistol') {
      noise(0.052, v * 1.45, 820, 'highpass');
      noise(0.15, v * 0.92, 1050, 'bandpass', 0.002);
      tone(105, 34, 0.2, v * 0.9, 'sine');
      noise(0.24, v * 0.48, 360, 'lowpass', 0.012);
      tone(1500, 480, 0.026, v * 0.18, 'triangle', 0.008);
    } else if (type === 'bluePistol') {
      noise(0.14, v * 1.16, 1120, 'bandpass');
    } else if (type === 'shotgun') {
      noise(0.3, v * 1.5, 1250, 'lowpass');
      noise(0.12, v * 0.95, 780, 'bandpass');
      tone(88, 28, 0.38, v * 1.15, 'sine');
      noise(0.42, v * 0.58, 330, 'lowpass', 0.018);
    } else if (type === 'ak') {
      noise(0.09, v * 1.3, 1120, 'bandpass');
      noise(0.16, v * 0.62, 540, 'lowpass', 0.006);
      tone(112, 36, 0.16, v * 0.92, 'square');
      tone(1320, 420, 0.03, v * 0.3, 'triangle', 0.009);
    } else if (type === 'reload') tone(420, 260, 0.08, v * 0.42, 'triangle');
    else if (type === 'pickup') tone(520, 940, 0.12, v * 0.5, 'sine');
    else if (type === 'hurt') tone(95, 50, 0.15, v * 0.65, 'sawtooth');
    else if (type === 'boom') {
      noise(0.34, v, 520, 'lowpass');
      tone(90, 30, 0.34, v * 0.8, 'square');
    } else if (type === 'buy') tone(300, 650, 0.18, v * 0.5, 'triangle');
    else if (type === 'waveStart') {
      tone(180, 360, 0.16, v * 0.62, 'sawtooth');
      tone(360, 720, 0.2, v * 0.48, 'triangle', 0.12);
      noise(0.16, v * 0.2, 900, 'bandpass');
    } else if (type === 'victory') {
      tone(260, 520, 0.22, v * 0.62, 'triangle');
      tone(390, 780, 0.28, v * 0.58, 'sine', 0.18);
      tone(520, 1040, 0.4, v * 0.52, 'triangle', 0.4);
    }
  }
  window.DeadSectorAudio = { ensure: ensureAudio, sfx };
})();
