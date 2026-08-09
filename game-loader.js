(() => {
'use strict';
fetch('game.js?v=pc4',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Could not load game core');return r.text()}).then(src=>{
  // Sequential level progression + readable locked level cards.
  src=src.replace("saved.unlock=saved.unlock||1;",`saved.unlock=saved.unlock||1;if(saved.unlock>5){saved.unlock=saved.unlock>=30?5:saved.unlock>=22?4:saved.unlock>=15?3:saved.unlock>=8?2:1;save();}`);
  src=src.replace(/function renderMapList\(\)\{.*?\}\nrenderMapList\(\);/s,`function renderMapList(){const el=$('mapList');el.innerHTML='';maps.forEach((m,i)=>{const unlocked=saved.unlock>=m.unlock;const b=document.createElement('button');b.className='mapBtn '+(selectedMap===i?'active ':'')+(unlocked?'':'lockedLevel');b.disabled=!unlocked;b.style.opacity=unlocked?1:.28;if(!unlocked)b.dataset.lockhint='Complete Level '+i+' to unlock';b.innerHTML=\`<div><div class="mapLevel">LEVEL \${i+1}</div><div class="mapSite">\${m.name}</div><div class="stars">\${'★'.repeat(m.stars)}</div><div class="mapMeta">\${m.desc}</div></div>\`;b.onclick=()=>{if(unlocked){selectedMap=i;renderMapList()}};el.appendChild(b)});$('records').innerHTML=\`Best wave: <b>\${saved.bestWave}</b><br>High score: <b>\${saved.highScore.toLocaleString()}</b><br>Unlocked levels: <b>\${Math.min(saved.unlock,maps.length)}/\${maps.length}</b>\`}renderMapList();`);

  // HUD object: armor removed, grenades restored.
  src=src.replace("armor:$('armorFill'),armorText:$('armorText'),","");

  // Larger damage across all weapons.
  src=src.replace("pistol:{name:'M9 Sidearm',damage:28","pistol:{name:'M9 Sidearm',damage:38");
  src=src.replace("smg:{name:'VX-9 SMG',damage:17","smg:{name:'VX-9 SMG',damage:24");
  src=src.replace("shotgun:{name:'M12 Breacher',damage:15","shotgun:{name:'M12 Breacher',damage:20");
  src=src.replace("rifle:{name:'AR-47',damage:35","rifle:{name:'AR-47',damage:48");

  // Start with no armor, no grenades, 5% healing chance.
  src=src.replace("power:{double:0,rapid:0},player:","power:{double:0,rapid:0},healDropChance:.05,player:");
  src=src.replace("hp:100,maxHp:100,armor:0,maxArmor:100","hp:100,maxHp:100,armor:0,maxArmor:0");
  src=src.replace("slot:0,grenades:1","slot:0,grenades:0");
  src=src.replace("regen:0},};","regen:0,healPower:40},};");

  // Magazine-only ammo, unlimited reloads.
  src=src.replace("${'★'.repeat(m.stars)}${'☆'.repeat(5-m.stars)}","${'★'.repeat(m.stars)}");
  src=src.replace("UI.ammo.innerHTML=`${w.ammo} <span>/ ${w.reserve}</span>`","UI.ammo.textContent=String(w.ammo)");
  src=src.replace("if(p.reloading>0||w.ammo>=d.mag||w.reserve<=0)return;p.reloading=d.reload","if(p.reloading>0||w.ammo>=d.mag)return;p.reloading=d.reload");
  src=src.replace("const p=game.player,w=p.weapons[p.slot],d=weaponDefs[w.id],need=d.mag-w.ammo,take=Math.min(need,w.reserve);w.ammo+=take;w.reserve-=take;updateHUD()","const p=game.player,w=p.weapons[p.slot],d=weaponDefs[w.id];w.ammo=d.mag;updateHUD()");

  // Standard walker = exactly 10 damage. Other classes remain stronger.
  src=src.replace("dmg:scale(16),color:'#769057'","dmg:10,color:'#769057'");

  // Drops: healing 5% base, grenades 2%, other temporary pickups remain rare. No armor/ammo/weapon drops.
  src=src.replace("if(Math.random()<.04)dropHealing(e.x,e.y);else if(Math.random()<.19)dropPickup(e.x,e.y);",`const dropRoll=Math.random();if(dropRoll<game.healDropChance)dropHealing(e.x,e.y);else if(dropRoll<game.healDropChance+.02)game.pickups.push({x:e.x,y:e.y,r:13,type:'grenade',life:14,bob:Math.random()*TAU});else if(dropRoll<game.healDropChance+.14)dropPickup(e.x,e.y);`);
  src=src.replace("let type=r<.27?'ammo':r<.49?'armor':r<.67?'grenade':r<.84?'double':'rapid'","let type=r<.56?'double':'rapid'");
  src=src.replace("const amount=Math.min(40,p.maxHp-p.hp);p.hp=Math.min(p.maxHp,p.hp+40)","const amount=Math.min(p.healPower,p.maxHp-p.hp);p.hp=Math.min(p.maxHp,p.hp+p.healPower)");

  // Armor mechanic fully removed.
  src=src.replace(/if\(p\.armor>0\)\{let absorb=Math\.min\(p\.armor,left\*\.65\);p\.armor-=absorb;left-=absorb\}/,"void 0");
  src=src.replace(/UI\.armor\.style\.width=.*?UI\.armorText\.textContent=`\$\{Math\.ceil\(p\.armor\)\} \/ \$\{p\.maxArmor\}`;/s,"");

  // Healing upgrade = +3 percentage points up to 20%; wider randomized pool; weapon shop appears every intermission.
  src=src.replace(/function chooseUpgrades\(\)\{.*?\}\nfunction endGame/s,`function renderBetweenShop(){const shop=$('betweenWeaponShop');if(!shop)return;shop.innerHTML='';const offers=[['smg',1700],['shotgun',2200],['rifle',3000]];for(const [id,cost] of offers){const owned=game.player.weapons.some(w=>w.id===id),row=document.createElement('div');row.className='shopChoice';row.innerHTML=\`<div><b>\${weaponDefs[id].name}</b><br><span>\${owned?'OWNED':cost.toLocaleString()+' SCORE'}</span></div><button \${owned?'disabled':''}>\${owned?'OWNED':'BUY'}</button>\`;row.querySelector('button').onclick=()=>{if(game.score<cost){toast('NOT ENOUGH SCORE');return}if(game.player.weapons.length>=3){toast('3 WEAPON LIMIT');return}game.score-=cost;game.player.weapons.push({id,ammo:weaponDefs[id].mag,reserve:0});game.player.slot=game.player.weapons.length-1;sfx('buy',.07);toast(weaponDefs[id].name+' ACQUIRED');updateHUD();updateWeaponSlots();renderBetweenShop()};shop.appendChild(row)}}
function chooseUpgrades(){const pool=[
 {t:'Stopping Power',d:'+20% weapon damage.',f:()=>game.player.damageMult*=1.2},
 {t:'Fleet Foot',d:'+12% movement speed.',f:()=>game.player.moveMult*=1.12},
 {t:'Fast Hands',d:'+16% fire rate.',f:()=>game.player.fireMult*=1.16},
 {t:'Juggernaut',d:'+25 max health and restore 25.',f:()=>{game.player.maxHp+=25;game.player.hp=Math.min(game.player.maxHp,game.player.hp+25)}},
 {t:'Field Medicine',d:'+3% healing-drop chance. Max 20%.',f:()=>game.healDropChance=Math.min(.20,game.healDropChance+.03)},
 {t:'Potent Aid',d:'Healing pickups restore +15 health.',f:()=>game.player.healPower+=15},
 {t:'Emergency Care',d:'Restore 45 health now.',f:()=>game.player.hp=Math.min(game.player.maxHp,game.player.hp+45)},
 {t:'Field Engineer',d:'Repair surviving barricades by 35%.',f:()=>game.map.barr.forEach(b=>{if(b.hp>0)b.hp=Math.min(b.maxHp,b.hp+b.maxHp*.35)})},
 {t:'Quick Step',d:'+8% movement and +8% fire rate.',f:()=>{game.player.moveMult*=1.08;game.player.fireMult*=1.08}},
 {t:'Heavy Rounds',d:'+12% damage and +10 max health.',f:()=>{game.player.damageMult*=1.12;game.player.maxHp+=10;game.player.hp+=10}}
 ].sort(()=>Math.random()-.5).slice(0,3);const grid=$('upgradeGrid');grid.innerHTML='';pool.forEach(u=>{const d=document.createElement('div');d.className='upgrade';d.innerHTML=\`<h4>\${u.t}</h4><p>\${u.d}</p><button>SELECT</button>\`;d.querySelector('button').onclick=()=>{u.f();UI.between.classList.add('hidden');state='playing';document.body.classList.add('game-live');nextWave();updateHUD()};grid.appendChild(d)});renderBetweenShop();state='between';document.body.classList.add('game-live');UI.between.classList.remove('hidden')}
function endGame`);

  // Completing wave 8 of current level unlocks next level.
  src=src.replace("if(game.wave>=8)saved.unlock=Math.max(saved.unlock,8);if(game.wave>=15)saved.unlock=Math.max(saved.unlock,15);if(game.wave>=22)saved.unlock=Math.max(saved.unlock,22);if(game.wave>=30)saved.unlock=Math.max(saved.unlock,30);","if(game.wave>=8&&selectedMap<maps.length-1)saved.unlock=Math.max(saved.unlock,selectedMap+2);");

  // Player can walk during upgrade selection; combat stays frozen.
  src=src.replace("if(state!=='playing'||!game)return;","if((state!=='playing'&&state!=='between')||!game)return;");
  src=src.replace("if(touchMode){mouse.worldX=p.x+touchAim.x*500;mouse.worldY=p.y+touchAim.y*500} if(mouse.down)shoot();","if(touchMode){mouse.worldX=p.x+touchAim.x*500;mouse.worldY=p.y+touchAim.y*500} if(state==='playing'&&mouse.down)shoot();");
  src=src.replace("if(game.waveActive&&game.waveQueue>0){","if(state==='playing'&&game.waveActive&&game.waveQueue>0){");
  src=src.replace("for(const e of game.enemies){e.attackCd-=dt;","if(state==='playing')for(const e of game.enemies){e.attackCd-=dt;");

  // Robust long-distance A* pathfinding around walls.
  src=src.replace("function update(dt){",`function navBlocked(x,y,r){for(const o of game.map.obs){if(x>o.x-r&&x<o.x+o.w+r&&y>o.y-r&&y<o.y+o.h+r)return true}return false}
function findEnemyPath(e,tx,ty){const cell=70,cols=Math.ceil(game.map.size[0]/cell),rows=Math.ceil(game.map.size[1]/cell),sx=clamp(Math.floor(e.x/cell),0,cols-1),sy=clamp(Math.floor(e.y/cell),0,rows-1),gx=clamp(Math.floor(tx/cell),0,cols-1),gy=clamp(Math.floor(ty/cell),0,rows-1),key=(x,y)=>y*cols+x,open=[{x:sx,y:sy,g:0,f:0}],came=new Map(),cost=new Map([[key(sx,sy),0]]),dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];let found=null,steps=0;while(open.length&&steps++<1600){open.sort((a,b)=>a.f-b.f);const n=open.shift();if(n.x===gx&&n.y===gy){found=n;break}for(const [dx,dy] of dirs){const nx=n.x+dx,ny=n.y+dy;if(nx<0||ny<0||nx>=cols||ny>=rows)continue;const wx=(nx+.5)*cell,wy=(ny+.5)*cell;if(navBlocked(wx,wy,e.r*.55+8))continue;const ng=n.g+(dx&&dy?1.414:1),nk=key(nx,ny);if(ng>=(cost.get(nk)??Infinity))continue;cost.set(nk,ng);came.set(nk,key(n.x,n.y));open.push({x:nx,y:ny,g:ng,f:ng+Math.hypot(gx-nx,gy-ny)})}}if(!found)return[];let cur=key(gx,gy),arr=[];while(cur!==key(sx,sy)&&came.has(cur)){const x=cur%cols,y=Math.floor(cur/cols);arr.push({x:(x+.5)*cell,y:(y+.5)*cell});cur=came.get(cur)}return arr.reverse()}
function moveEnemySmart(e,tx,ty,dt){if(lineRect&&!game.map.obs.some(o=>lineRect(e.x,e.y,tx,ty,{x:o.x-e.r*.55-6,y:o.y-e.r*.55-6,w:o.w+e.r*1.1+12,h:o.h+e.r*1.1+12}))){e.path=null}else{e.pathTimer=(e.pathTimer||0)-dt;if(!e.path||e.pathTimer<=0){e.path=findEnemyPath(e,tx,ty);e.pathTimer=.55+Math.random()*.25}}let target=e.path&&e.path.length?e.path[0]:{x:tx,y:ty};if(e.path&&e.path.length&&Math.hypot(e.x-target.x,e.y-target.y)<35){e.path.shift();target=e.path[0]||{x:tx,y:ty}}const dx=target.x-e.x,dy=target.y-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*e.speed*dt;e.y+=dy/d*e.speed*dt}
function separateEnemies(){const a=game.enemies;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const A=a[i],B=a[j],dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||.001,min=(A.r+B.r)*.38;if(d<min){const push=(min-d)*.5,nx=dx/d,ny=dy/d;A.x-=nx*push;A.y-=ny*push;B.x+=nx*push;B.y+=ny*push}}}
function updateWeaponSlots(){if(!game)return;document.querySelectorAll('.weaponSlot').forEach((el,i)=>{const w=game.player.weapons[i];el.querySelector('.slotWeapon').textContent=w?weaponDefs[w.id].name:'EMPTY';el.classList.toggle('active',i===game.player.slot)})}
function renderReorder(){if(!game)return;const grid=$('slotReorderGrid');grid.innerHTML='';for(let i=0;i<3;i++){const box=document.createElement('div');box.className='dragSlot';box.dataset.slot=i;box.innerHTML=\`<div class="dragSlotLabel">SLOT \${i+1}</div>\`;const w=game.player.weapons[i];if(w){const item=document.createElement('div');item.className='dragWeapon';item.draggable=true;item.dataset.from=i;item.textContent=weaponDefs[w.id].name;item.addEventListener('dragstart',ev=>ev.dataTransfer.setData('text/plain',String(i)));box.appendChild(item)}box.addEventListener('dragover',ev=>{ev.preventDefault();box.classList.add('dragOver')});box.addEventListener('dragleave',()=>box.classList.remove('dragOver'));box.addEventListener('drop',ev=>{ev.preventDefault();box.classList.remove('dragOver');const from=Number(ev.dataTransfer.getData('text/plain')),to=i;if(from===to||!game.player.weapons[from])return;const temp=game.player.weapons[to];game.player.weapons[to]=game.player.weapons[from];if(temp)game.player.weapons[from]=temp;else game.player.weapons.splice(from,1);game.player.slot=Math.min(game.player.slot,game.player.weapons.length-1);renderReorder();updateWeaponSlots();updateHUD()});grid.appendChild(box)}}
function toggleReorder(){if(!game||state==='menu'||state==='gameover')return;const panel=$('slotReorder'),opening=panel.classList.contains('hidden');panel.classList.toggle('hidden',!opening);if(opening){mouse.down=false;renderReorder()}}
function update(dt){`);
  src=src.replace("}else{e.x+=ax/d*e.speed*dt;e.y+=ay/d*e.speed*dt}for(const o of m.obs)resolveCircleRect(e,o);","}else{moveEnemySmart(e,p.x,p.y,dt)}for(const o of m.obs)resolveCircleRect(e,o);");
  src=src.replace("for(let i=game.pickups.length-1;i>=0;i--){","if(state==='playing')separateEnemies();for(let i=game.pickups.length-1;i>=0;i--){");

  // Better simple grenade drawings, both pickup and thrown grenade.
  src=src.replace("for(const g of game.grenades){ctx.fillStyle='#25303a';ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,TAU);ctx.fill();ctx.strokeStyle='#f2c14e';ctx.stroke()}","for(const g of game.grenades)drawGrenadeShape(g.x,g.y,1)");
  src=src.replace(/function drawPickup\(pu\)\{.*?\}\nfunction drawEnemy/s,`function drawGrenadeShape(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.fillStyle='#39434a';ctx.beginPath();ctx.arc(0,2,7*s,0,TAU);ctx.fill();ctx.strokeStyle='#69757e';ctx.lineWidth=2*s;ctx.stroke();ctx.fillStyle='#56626b';ctx.fillRect(-4*s,-8*s,8*s,5*s);ctx.strokeStyle='#c1a45d';ctx.lineWidth=2*s;ctx.beginPath();ctx.arc(5*s,-7*s,4*s,Math.PI*.2,Math.PI*1.5);ctx.stroke();ctx.restore()}
function drawPickup(pu){const colors={heal:'#59d98e',grenade:'#c7aa63',double:'#f2c14e',rapid:'#b16cff'},y=pu.y+Math.sin(pu.bob)*4;ctx.save();ctx.translate(pu.x,y);ctx.shadowBlur=14;ctx.shadowColor=colors[pu.type]||'#fff';if(pu.type==='grenade'){ctx.shadowBlur=10;drawGrenadeShape(0,0,1.15);ctx.restore();return}ctx.fillStyle=colors[pu.type]||'#fff';ctx.beginPath();ctx.arc(0,0,pu.r,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#0a0d10';ctx.font='900 9px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText({heal:'+',double:'2X',rapid:'>>'}[pu.type]||'',0,1);ctx.restore()}
function drawEnemy`);

  // HUD updates include slots, no armor.
  src=src.replace(/UI\.armor\.style\.width=.*?;/s,"");
  src=src.replace(/UI\.armorText\.textContent=.*?;/s,"");
  src=src.replace("UI.grenades.textContent=`Grenades: ${p.grenades}${game.power.double>0?' · 2X '+game.power.double.toFixed(0)+'s':''}${game.power.rapid>0?' · OVERDRIVE '+game.power.rapid.toFixed(0)+'s':''}`","UI.grenades.textContent=`Grenades: ${p.grenades}${game.power.double>0?' · 2X '+game.power.double.toFixed(0)+'s':''}${game.power.rapid>0?' · OVERDRIVE '+game.power.rapid.toFixed(0)+'s':''}`;updateWeaponSlots()");

  // Tab loadout toggle before normal key handling.
  src=src.replace("addEventListener('keydown',e=>{if(rebinding){","addEventListener('keydown',e=>{if(e.code==='Tab'&&!rebinding){e.preventDefault();toggleReorder();return}if(rebinding){");

  // No in-map shops: maps now provide none. Keep interactions only for barricades.

  // Subtle menu particles.
  src=src.replace(/function drawMenuBG\(\)\{.*?\}\nfunction loop/s,`function drawMenuBG(){const t=performance.now()/1000;ctx.fillStyle='#07090c';ctx.fillRect(0,0,W,H);for(let i=0;i<42;i++){const seed=i*97.37,x=((seed*13+t*(3+(i%5)))*1.7)%W,y=((seed*7+t*(1+(i%3)))*1.3)%H,a=.035+(i%4)*.012;ctx.fillStyle='rgba(190,210,225,'+a+')';ctx.fillRect(x,y,(i%7===0)?2:1,(i%7===0)?2:1)}ctx.strokeStyle='rgba(255,255,255,.015)';for(let x=((t*5)%110)-110;x<W;x+=110){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+120,H);ctx.stroke()}}
function loop`);

  (0,eval)(src+'\n//# sourceURL=game-core-pc.js');
  setTimeout(()=>{window.DeadSectorPCUI?.mountScale();},0);
}).catch(err=>{console.error(err);document.body.innerHTML='<div style="padding:30px;color:white;font-family:system-ui">DEAD SECTOR failed to load. Refresh the page.</div>'});
})();
