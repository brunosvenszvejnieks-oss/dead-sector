'use strict';
// Lightweight layered WebAudio effects. Each weapon uses its own transient and body profile.
(() => {
let ctx=null;
function ensureAudio(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{ctx=new AC();if(ctx.state==='suspended')ctx.resume?.().catch?.(()=>{});return ctx}catch(e){console.warn('Audio unavailable',e);return null}}
function tone(start,end,duration,volume,type='sine',delay=0){const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(30,start),t);o.frequency.exponentialRampToValueAtTime(Math.max(30,end),t+duration);g.gain.setValueAtTime(Math.max(.0001,volume),t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+duration)}
function noise(duration,volume,frequency=1800,filterType='lowpass',delay=0){const rate=ctx.sampleRate,length=Math.max(1,Math.floor(rate*duration)),buffer=ctx.createBuffer(1,length,rate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length*.35);const t=ctx.currentTime+delay,source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type=filterType;filter.frequency.setValueAtTime(frequency,t);gain.gain.setValueAtTime(Math.max(.0001,volume),t);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start(t);source.stop(t+duration)}
function sfx(type,vol=.1){if(!ctx)return;const v=Math.min(.44,vol*3.1);
 if(type==='pistol'){noise(.052,v*1.45,820,'highpass');noise(.15,v*.92,1050,'bandpass',.002);tone(105,34,.2,v*.9,'sine');noise(.24,v*.48,360,'lowpass',.012);tone(1500,480,.026,v*.18,'triangle',.008)}
 else if(type==='bluePistol'){noise(.14,v*1.16,1120,'bandpass')}
 else if(type==='shotgun'){noise(.3,v*1.5,1250,'lowpass');noise(.12,v*.95,780,'bandpass');tone(88,28,.38,v*1.15,'sine');noise(.42,v*.58,330,'lowpass',.018)}
 else if(type==='ak'){noise(.09,v*1.3,1120,'bandpass');noise(.16,v*.62,540,'lowpass',.006);tone(112,36,.16,v*.92,'square');tone(1320,420,.03,v*.3,'triangle',.009)}
 else if(type==='reload')tone(420,260,.08,v*.42,'triangle');
 else if(type==='pickup')tone(520,940,.12,v*.5,'sine');
 else if(type==='hurt')tone(95,50,.15,v*.65,'sawtooth');
 else if(type==='boom'){noise(.34,v,520,'lowpass');tone(90,30,.34,v*.8,'square')}
 else if(type==='buy')tone(300,650,.18,v*.5,'triangle');
 else if(type==='waveStart'){tone(180,360,.16,v*.62,'sawtooth');tone(360,720,.2,v*.48,'triangle',.12);noise(.16,v*.2,900,'bandpass')}
 else if(type==='victory'){tone(260,520,.22,v*.62,'triangle');tone(390,780,.28,v*.58,'sine',.18);tone(520,1040,.4,v*.52,'triangle',.4)}
}
window.DeadSectorAudio={ensure:ensureAudio,sfx};
})();
