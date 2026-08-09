(() => {
  'use strict';
  const root = document.documentElement;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  let scale = Number(localStorage.getItem('deadSectorUIScale')) || 1.15;
  scale = clamp(scale,.85,1.4);
  function applyScale(){
    root.style.setProperty('--ui-scale', scale);
    const out=document.getElementById('uiScaleValue');
    if(out) out.textContent=Math.round(scale*100)+'%';
  }
  function mountScale(){
    const mount=document.getElementById('uiScaleMount');
    if(!mount || mount.dataset.ready) return;
    mount.dataset.ready='1';
    mount.innerHTML='<div class="uiScaleRow"><div><b>UI SIZE</b><div class="small">Scale the in-game HUD and interface.</div></div><div class="uiScaleControls"><button id="uiScaleDown">−</button><span id="uiScaleValue"></span><button id="uiScaleUp">+</button></div></div>';
    document.getElementById('uiScaleDown').onclick=()=>{scale=clamp(Math.round((scale-.05)*100)/100,.85,1.4);localStorage.setItem('deadSectorUIScale',scale);applyScale()};
    document.getElementById('uiScaleUp').onclick=()=>{scale=clamp(Math.round((scale+.05)*100)/100,.85,1.4);localStorage.setItem('deadSectorUIScale',scale);applyScale()};
    applyScale();
  }
  document.addEventListener('DOMContentLoaded',()=>{
    applyScale(); mountScale();
    const open=document.getElementById('openControlsBtn');
    const hiddenTab=document.getElementById('pauseControlsTab');
    if(open&&hiddenTab) open.onclick=()=>hiddenTab.click();
  });
  window.DeadSectorPCUI={applyScale,mountScale};
})();
