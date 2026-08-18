'use strict';
// Touch-device detection, orientation gate, and virtual-stick plumbing.
(() => {
  const touchMode =
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  function viewportSize() {
    const vv = window.visualViewport;
    return {
      w: Math.round(
        vv?.width || window.innerWidth || document.documentElement.clientWidth || screen.width,
      ),
      h: Math.round(
        vv?.height || window.innerHeight || document.documentElement.clientHeight || screen.height,
      ),
    };
  }

  function isPortraitTouch() {
    const v = viewportSize();
    return touchMode && v.h > v.w;
  }
  function syncOrientation(onLandscape) {
    const portrait = isPortraitTouch();
    document.body.classList.toggle('portrait-lock', portrait);
    document.body.classList.toggle('force-portrait-block', portrait);
    if (!portrait && onLandscape) setTimeout(onLandscape, 60);
  }

  function initDeviceUI() {
    if (!touchMode) return;
    document.body.classList.add('touch-mode', 'mobile-device');
    const controls = document.getElementById('pauseControlsTab');
    const desktopHow = document.getElementById('desktopHow');
    const mobileHow = document.getElementById('mobileHow');
    if (controls) controls.style.display = 'none';
    desktopHow?.classList.add('hidden');
    mobileHow?.classList.remove('hidden');
  }

  function installBrowserGuards() {
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((type) =>
      document.addEventListener(type, (e) => e.preventDefault(), { passive: false }),
    );
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('touchcancel', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
    document.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey) e.preventDefault();
      },
      { passive: false },
    );
  }

  function setupStick(id, onMove, onEnd) {
    const zone = document.getElementById(id);
    if (!zone) return;
    const knob = zone.querySelector('.stickKnob');
    let active = null;
    function apply(t) {
      const r = zone.getBoundingClientRect(),
        cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      let dx = t.clientX - cx,
        dy = t.clientY - cy,
        max = r.width * 0.31,
        l = Math.hypot(dx, dy) || 1,
        k = Math.min(1, max / l);
      dx *= k;
      dy *= k;
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      onMove(dx / max, dy / max);
    }
    zone.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        const t = e.changedTouches[0];
        active = t.identifier;
        apply(t);
      },
      { passive: false },
    );
    zone.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        for (const t of e.changedTouches) if (t.identifier === active) apply(t);
      },
      { passive: false },
    );
    function end(e) {
      for (const t of e.changedTouches)
        if (t.identifier === active) {
          active = null;
          knob.style.transform = 'translate(0,0)';
          onEnd();
          break;
        }
    }
    zone.addEventListener('touchend', end, { passive: false });
    zone.addEventListener('touchcancel', end, { passive: false });
  }

  window.DeadSectorMobile = {
    touchMode,
    viewportSize,
    isPortraitTouch,
    syncOrientation,
    initDeviceUI,
    installBrowserGuards,
    setupStick,
  };
})();
