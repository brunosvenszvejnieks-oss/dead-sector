'use strict';
// Lightweight layered WebAudio effects. Each weapon uses its own transient and body profile.
(() => {
let ctx=null;
function ensureAudio(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{ctx=new AC();if(ctx.state==='suspended')ctx.resume?.().catch?.(()=>{});return ctx}catch(e){console.warn('Audio unavailable',e);return null}}
function tone(start,end,duration,volume,type='sine',delay=0){const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(30,start),t);o.frequency.exponentialRampToValueAtTime(Math.max(30,end),t+duration);g.gain.setValueAtTime(Math.max(.0001,volume),t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+duration)}
function noise(duration,volume,frequency=1800,filterType='lowpass',delay=0){const rate=ctx.sampleRate,length=Math.max(1,Math.floor(rate*duration)),buffer=ctx.createBuffer(1,length,rate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length*.35);const t=ctx.currentTime+delay,source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type=filterType;filter.frequency.setValueAtTime(frequency,t);gain.gain.setValueAtTime(Math.max(.0001,volume),t);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start(t);source.stop(t+duration)}
function sfx(type,vol=.1){if(!ctx)return;const v=Math.min(.34,vol*2.5);
 if(type==='pistol'){noise(.065,v*1.05,1750,'highpass');tone(155,58,.13,v*.7,'triangle');noise(.14,v*.27,720,'lowpass',.018)}
 else if(type==='bluePistol'){noise(.055,v*.78,2100,'highpass');tone(480,145,.12,v*.52,'sawtooth');tone(190,72,.14,v*.43,'triangle',.008);noise(.1,v*.2,1000,'bandpass',.015)}
 else if(type==='shotgun'){noise(.24,v*1.22,1550,'lowpass');tone(105,34,.3,v*.95,'triangle');noise(.32,v*.38,430,'lowpass',.025)}
 else if(type==='ak'){noise(.075,v*.95,1450,'bandpass');tone(125,48,.11,v*.72,'square');tone(1450,620,.025,v*.24,'triangle',.012)}
 else if(type==='reload')tone(420,260,.08,v*.42,'triangle');
 else if(type==='pickup')tone(520,940,.12,v*.5,'sine');
 else if(type==='hurt')tone(95,50,.15,v*.65,'sawtooth');
 else if(type==='boom'){noise(.34,v,520,'lowpass');tone(90,30,.34,v*.8,'square')}
 else if(type==='buy')tone(300,650,.18,v*.5,'triangle');
}
window.DeadSectorAudio={ensure:ensureAudio,sfx};
})();
