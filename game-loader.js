(() => {
'use strict';
fetch('game.js?v=pc3',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Could not load game core');return r.text()}).then(src=>{
  // Sequential level progression + readable level cards.
  src=src.replace("saved.unlock=saved.unlock||1;",`saved.unlock=saved.unlock||1;if(saved.unlock>5){saved.unlock=saved.unlock>=30?5:saved.unlock>=22?4:saved.unlock>=15?3:saved.unlock>=8?2:1;save();}`);
  src=src.replace(/function renderMapList\(\)\{.*?\}\nrenderMapList\(\);/s,`function renderMapList(){const el=$('mapList');el.innerHTML='';maps.forEach((m,i)=>{const unlocked=saved.unlock>=m.unlock;const b=document.createElement('button');b.className='mapBtn '+(selectedMap===i?'active ':'')+(unlocked?'':'lockedLevel');b.disabled=!unlocked;b.style.opacity=unlocked?1:.28;if(!unlocked)b.dataset.lockhint='Complete Level '+i+' to unlock';b.innerHTML=\`<div><div class="mapLevel">LEVEL \${i+1}</div><div class="mapSite">\${m.name}</div><div class="stars">\${'★'.repeat(m.stars)}</div><div class="mapMeta">\${m.desc}</div></div>\`;b.onclick=()=>{if(unlocked){selectedMap=i;renderMapList()}};el.appendChild(b)});$('records').innerHTML=\`Best wave: <b>\${saved.bestWave}</b><br>High score: <b>\${saved.highScore.toLocaleString()}</b><br>Unlocked levels: <b>\${Math.min(saved.unlock,maps.length)}/\${maps.length}</b>\`}renderMapList();`);

  // Remove grenades from PC controls and HUD.
  src=src.replace("grenades:$('grenadeText'),","grenades:null,");
  src=src.replace("grenade:'KeyG',","");
  src=src.replace("grenade:'Throw Grenade',","");
  src=src.replace("if(e.code===binds.grenade)throwGrenade();","");
  src=src.replace("tap('touchGrenade',throwGrenade);","");
  src=src.replace(/UI\.grenades\.textContent=`Grenades: \$\{p\.grenades\}.*?`/s,"void 0");

  // Magazine-only ammo.
  src=src.replace("${'★'.repeat(m.stars)}${'☆'.repeat(5-m.stars)}","${'★'.repeat(m.stars)}");
  src=src.replace("UI.ammo.innerHTML=`${w.ammo} <span>/ ${w.reserve}</span>`","UI.ammo.textContent=String(w.ammo)");
  src=src.replace("if(p.reloading>0||w.ammo>=d.mag||w.reserve<=0)return;p.reloading=d.reload","if(p.reloading>0||w.ammo>=d.mag)return;p.reloading=d.reload");
  src=src.replace("const p=game.player,w=p.weapons[p.slot],d=weaponDefs[w.id],need=d.mag-w.ammo,take=Math.min(need,w.reserve);w.ammo+=take;w.reserve-=take;updateHUD()","const p=game.player,w=p.weapons[p.slot],d=weaponDefs[w.id];w.ammo=d.mag;updateHUD()");
  src=src.replace("let type=r<.27?'ammo':r<.49?'armor':r<.67?'grenade':r<.84?'double':'rapid'","let type=r<.48?'armor':r<.74?'double':'rapid'");
  src=src.replace("const has=p.weapons.some(w=>w.id===s.weapon);txt=`${touchMode?'[USE]':'['+prettyKey(binds.interact)+']'} ${has?'BUY AMMO — 450':'BUY '+weaponDefs[s.weapon].name+' — '+s.cost}`","const has=p.weapons.some(w=>w.id===s.weapon);txt=has?'':`${touchMode?'[USE]':'['+prettyKey(binds.interact)+']'} BUY ${weaponDefs[s.weapon].name} — ${s.cost}`");
  src=src.replace("if(has){const w=p.weapons.find(w=>w.id===best.weapon),def=weaponDefs[w.id],cost=450;if(game.score>=cost){game.score-=cost;w.reserve=Math.min(w.reserve+def.mag*2,def.reserve*2);toast('AMMO PURCHASED');sfx('buy',.05)}else toast('NOT ENOUGH SCORE')}else if(game.score>=best.cost)","if(has){toast('WEAPON ALREADY OWNED')}else if(game.score>=best.cost)");

  // Healing drops start at 5%, can be upgraded by +10 percentage points.
  src=src.replace("power:{double:0,rapid:0},player:","power:{double:0,rapid:0},healDropChance:.05,player:");
  src=src.replace("regen:0},};","regen:0,healPower:40},};");
  src=src.replace("if(Math.random()<.04)dropHealing(e.x,e.y);else if(Math.random()<.19)dropPickup(e.x,e.y);","if(Math.random()<game.healDropChance)dropHealing(e.x,e.y);else if(Math.random()<.16)dropPickup(e.x,e.y);");
  src=src.replace("const amount=Math.min(40,p.maxHp-p.hp);p.hp=Math.min(p.maxHp,p.hp+40)","const amount=Math.min(p.healPower,p.maxHp-p.hp);p.hp=Math.min(p.maxHp,p.hp+p.healPower)");

  // More varied intermission upgrades, no grenades.
  src=src.replace(/function chooseUpgrades\(\)\{.*?\}\nfunction endGame/s,`function chooseUpgrades(){const pool=[
 {t:'Stopping Power',d:'+20% weapon damage.',f:()=>game.player.damageMult*=1.2},
 {t:'Fleet Foot',d:'+12% movement speed.',f:()=>game.player.moveMult*=1.12},
 {t:'Fast Hands',d:'+16% fire rate.',f:()=>game.player.fireMult*=1.16},
 {t:'Juggernaut',d:'+25 max health and restore 25 health.',f:()=>{game.player.maxHp+=25;game.player.hp=Math.min(game.player.maxHp,game.player.hp+25)}},
 {t:'Armor Plate',d:'+30 max armor and restore 45 armor.',f:()=>{game.player.maxArmor+=30;game.player.armor=Math.min(game.player.maxArmor,game.player.armor+45)}},
 {t:'Field Medicine',d:'+10 percentage points to zombie healing-drop chance.',f:()=>game.healDropChance=Math.min(.55,game.healDropChance+.10)},
 {t:'Potent Aid',d:'Healing pickups restore +15 more health.',f:()=>game.player.healPower+=15},
 {t:'Emergency Care',d:'Immediately restore 45 health.',f:()=>game.player.hp=Math.min(game.player.maxHp,game.player.hp+45)},
 {t:'Field Engineer',d:'Restore 35% health to every surviving barricade.',f:()=>game.map.barr.forEach(b=>{if(b.hp>0)b.hp=Math.min(b.maxHp,b.hp+b.maxHp*.35)})}
 ].sort(()=>Math.random()-.5).slice(0,3);const grid=$('upgradeGrid');grid.innerHTML='';pool.forEach(u=>{const d=document.createElement('div');d.className='upgrade';d.innerHTML=\`<h4>\${u.t}</h4><p>\${u.d}</p><button>SELECT</button>\`;d.querySelector('button').onclick=()=>{u.f();UI.between.classList.add('hidden');state='playing';document.body.classList.add('game-live');nextWave();updateHUD()};grid.appendChild(d)});state='between';document.body.classList.add('game-live');UI.between.classList.remove('hidden')}
function endGame`);

  // Completing wave 8 of the current level unlocks the next level.
  src=src.replace("if(game.wave>=8)saved.unlock=Math.max(saved.unlock,8);if(game.wave>=15)saved.unlock=Math.max(saved.unlock,15);if(game.wave>=22)saved.unlock=Math.max(saved.unlock,22);if(game.wave>=30)saved.unlock=Math.max(saved.unlock,30);","if(game.wave>=8&&selectedMap<maps.length-1)saved.unlock=Math.max(saved.unlock,selectedMap+2);");

  // Player can move while choosing an intermission upgrade; combat remains paused.
  src=src.replace("if(state!=='playing'||!game)return;","if((state!=='playing'&&state!=='between')||!game)return;");
  src=src.replace("if(touchMode){mouse.worldX=p.x+touchAim.x*500;mouse.worldY=p.y+touchAim.y*500} if(mouse.down)shoot();","if(touchMode){mouse.worldX=p.x+touchAim.x*500;mouse.worldY=p.y+touchAim.y*500} if(state==='playing'&&mouse.down)shoot();");

  // Lightweight wall-aware zombie steering.
  src=src.replace("function update(dt){",`function enemyPathClear(e,x1,y1,x2,y2){for(const o of game.map.obs){const pad=e.r+12,ex={x:o.x-pad,y:o.y-pad,w:o.w+pad*2,h:o.h+pad*2};if(lineRect(x1,y1,x2,y2,ex))return false}return true}
function moveEnemySmart(e,tx,ty,dt){let gx=tx,gy=ty;if(!enemyPathClear(e,e.x,e.y,tx,ty)){let blocker=null,bestHit=Infinity;for(const o of game.map.obs){const pad=e.r+12,ex={x:o.x-pad,y:o.y-pad,w:o.w+pad*2,h:o.h+pad*2};if(lineRect(e.x,e.y,tx,ty,ex)){const dd=Math.hypot((o.x+o.w/2)-e.x,(o.y+o.h/2)-e.y);if(dd<bestHit){bestHit=dd;blocker=o}}}if(blocker){const pad=e.r+22,corners=[{x:blocker.x-pad,y:blocker.y-pad},{x:blocker.x+blocker.w+pad,y:blocker.y-pad},{x:blocker.x-pad,y:blocker.y+blocker.h+pad},{x:blocker.x+blocker.w+pad,y:blocker.y+blocker.h+pad}];let best=null,score=Infinity;for(const c of corners){c.x=clamp(c.x,e.r,game.map.size[0]-e.r);c.y=clamp(c.y,e.r,game.map.size[1]-e.r);if(!enemyPathClear(e,e.x,e.y,c.x,c.y))continue;const s=Math.hypot(c.x-e.x,c.y-e.y)+Math.hypot(tx-c.x,ty-c.y);if(s<score){score=s;best=c}}if(best){gx=best.x;gy=best.y}}}const dx=gx-e.x,dy=gy-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*e.speed*dt;e.y+=dy/d*e.speed*dt}
function update(dt){`);
  src=src.replace("}else{e.x+=ax/d*e.speed*dt;e.y+=ay/d*e.speed*dt}for(const o of m.obs)resolveCircleRect(e,o);","}else{moveEnemySmart(e,p.x,p.y,dt)}for(const o of m.obs)resolveCircleRect(e,o);");

  // Simple recognizable geometric weapon caches.
  src=src.replace(/function drawShop\(s\)\{.*?\}\nfunction drawPickup/s,`function drawShop(s){const id=s.weapon,d=weaponDefs[id];ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle='rgba(8,12,16,.78)';ctx.fillRect(-38,-24,76,48);ctx.strokeStyle='rgba(255,255,255,.10)';ctx.lineWidth=2;ctx.strokeRect(-38,-24,76,48);ctx.translate(-27,0);ctx.fillStyle='#66717b';ctx.fillRect(0,-5,42,10);ctx.fillStyle='#89949d';ctx.fillRect(4,-8,24,5);if(id==='pistol'){ctx.fillRect(22,3,8,15);ctx.fillStyle='#424a51';ctx.fillRect(30,-3,13,6)}if(id==='smg'){ctx.fillStyle='#4d565e';ctx.fillRect(20,4,8,16);ctx.fillRect(34,-3,17,6);ctx.fillStyle='#79848d';ctx.fillRect(9,-10,12,4)}if(id==='shotgun'){ctx.fillStyle='#765c42';ctx.fillRect(1,5,15,6);ctx.fillStyle='#444c53';ctx.fillRect(39,-3,19,6);ctx.fillRect(20,4,7,14)}if(id==='rifle'){ctx.fillStyle='#4b535a';ctx.fillRect(18,4,9,17);ctx.fillRect(39,-3,20,6);ctx.fillStyle='#7c674d';ctx.fillRect(-5,4,13,8)}ctx.restore();ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle=d.color;ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText(d.name,0,-34);ctx.restore()}
function drawPickup`);

  // Subtle moving menu particles.
  src=src.replace(/function drawMenuBG\(\)\{.*?\}\nfunction loop/s,`function drawMenuBG(){const t=performance.now()/1000;ctx.fillStyle='#07090c';ctx.fillRect(0,0,W,H);for(let i=0;i<42;i++){const seed=i*97.37,x=((seed*13+t*(3+(i%5)))*1.7)%W,y=((seed*7+t*(1+(i%3)))*1.3)%H,a=.035+(i%4)*.012;ctx.fillStyle='rgba(190,210,225,'+a+')';ctx.fillRect(x,y,(i%7===0)?2:1,(i%7===0)?2:1)}ctx.strokeStyle='rgba(255,255,255,.015)';for(let x=((t*5)%110)-110;x<W;x+=110){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+120,H);ctx.stroke()}}
function loop`);

  (0,eval)(src+'\n//# sourceURL=game-core-pc.js');
  setTimeout(()=>window.DeadSectorPCUI?.mountScale(),0);
}).catch(err=>{console.error(err);document.body.innerHTML='<div style="padding:30px;color:white;font-family:system-ui">DEAD SECTOR failed to load. Refresh the page.</div>'});
})();
