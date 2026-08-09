'use strict';
// WebAudio is isolated so unsupported/restricted mobile browsers cannot break game startup.
(() => {
let ctx=null;
function ensureAudio(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{ctx=new AC();if(ctx.state==='suspended')ctx.resume?.().catch?.(()=>{});return ctx}catch(e){console.warn('Audio unavailable',e);return null}}
function sfx(type,vol=.1){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);let t=ctx.currentTime;const set=(f1,f2,d,w='square')=>{o.type=w;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,f2),t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d)};if(type==='shot')set(170,70,.07,'square');if(type==='smg')set(240,90,.045,'sawtooth');if(type==='rifle')set(130,55,.09,'square');if(type==='reload')set(420,260,.08,'triangle');if(type==='pickup')set(520,940,.12,'sine');if(type==='hurt')set(95,50,.15,'sawtooth');if(type==='boom')set(90,30,.34,'square');if(type==='buy')set(300,650,.18,'triangle');}

window.DeadSectorAudio={ensure:ensureAudio,sfx};
})();
