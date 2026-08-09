(() => {
  'use strict';
  const root = document.documentElement;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  let stored = Number(localStorage.getItem('deadSectorUIScale'));
  let scale = Number.isFinite(stored) && stored >= .5 && stored <= 1 ? stored : .80;
  scale = clamp(scale,.50,1.00);
  function applyScale(){
    root.style.setProperty('--ui-scale', scale);
    const out=document.getElementById('uiScaleValue');
    if(out) out.textContent=Math.round(scale*100)+'%';
  }
  function mountScale(){
    const mount=document.getElementById('uiScaleMount');
    if(!mount || mount.dataset.ready) return;
    mount.dataset.ready='1';
    mount.innerHTML='<div class="uiScaleRow"><div><b>UI SIZE</b><div class="small">Adjust the in-game HUD size.</div></div><div class="uiScaleControls"><button id="uiScaleDown">−</button><span id="uiScaleValue"></span><button id="uiScaleUp">+</button></div></div>';
    document.getElementById('uiScaleDown').onclick=()=>{scale=clamp(Math.round((scale-.05)*100)/100,.50,1.00);localStorage.setItem('deadSectorUIScale',scale);applyScale()};
    document.getElementById('uiScaleUp').onclick=()=>{scale=clamp(Math.round((scale+.05)*100)/100,.50,1.00);localStorage.setItem('deadSectorUIScale',scale);applyScale()};
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
