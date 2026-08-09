(() => {
'use strict';
/* Load the stable core, applying the current PC rules in one isolated compatibility layer. */
fetch('game.js?v=pc2',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Could not load game core');return r.text()}).then(src=>{
  src=src.replace("${'★'.repeat(m.stars)}${'☆'.repeat(5-m.stars)}","${'★'.repeat(m.stars)}");
  src=src.replace("UI.ammo.innerHTML=`${w.ammo} <span>/ ${w.reserve}</span>`","UI.ammo.textContent=String(w.ammo)");
  src=src.replace("if(p.reloading>0||w.ammo>=d.mag||w.reserve<=0)return;p.reloading=d.reload","if(p.reloading>0||w.ammo>=d.mag)return;p.reloading=d.reload");
  src=src.replace("const p=game.player,w=p.weapons[p.slot],d=weaponDefs[w.id],need=d.mag-w.ammo,take=Math.min(need,w.reserve);w.ammo+=take;w.reserve-=take;updateHUD()","const p=game.player,w=p.weapons[p.slot],d=weaponDefs[w.id];w.ammo=d.mag;updateHUD()");
  src=src.replace("let type=r<.27?'ammo':r<.49?'armor':r<.67?'grenade':r<.84?'double':'rapid'","let type=r<.40?'armor':r<.64?'grenade':r<.82?'double':'rapid'");
  src=src.replace("{t:'Scavenger',d:'Gain 2 grenades and refill weapon reserves.',f:()=>{game.player.grenades=Math.min(5,game.player.grenades+2);for(const w of game.player.weapons){const d=weaponDefs[w.id];w.reserve=Math.min(d.reserve*2,w.reserve+d.mag*2)}}},","{t:'Scavenger',d:'Gain 3 grenades.',f:()=>{game.player.grenades=Math.min(5,game.player.grenades+3)}},");
  src=src.replace("const has=p.weapons.some(w=>w.id===s.weapon);txt=`${touchMode?'[USE]':'['+prettyKey(binds.interact)+']'} ${has?'BUY AMMO — 450':'BUY '+weaponDefs[s.weapon].name+' — '+s.cost}`","const has=p.weapons.some(w=>w.id===s.weapon);txt=has?'':`${touchMode?'[USE]':'['+prettyKey(binds.interact)+']'} BUY ${weaponDefs[s.weapon].name} — ${s.cost}`");
  src=src.replace("if(has){const w=p.weapons.find(w=>w.id===best.weapon),def=weaponDefs[w.id],cost=450;if(game.score>=cost){game.score-=cost;w.reserve=Math.min(w.reserve+def.mag*2,def.reserve*2);toast('AMMO PURCHASED');sfx('buy',.05)}else toast('NOT ENOUGH SCORE')}else if(game.score>=best.cost)","if(has){toast('WEAPON ALREADY OWNED')}else if(game.score>=best.cost)");
  src=src.replace(/function drawShop\(s\)\{.*?\}\nfunction drawPickup/s,`function drawShop(s){
    const id=s.weapon,d=weaponDefs[id];ctx.save();ctx.translate(s.x,s.y);
    ctx.fillStyle='rgba(8,12,16,.78)';ctx.fillRect(-38,-24,76,48);ctx.strokeStyle='rgba(255,255,255,.10)';ctx.lineWidth=2;ctx.strokeRect(-38,-24,76,48);
    ctx.translate(-27,0);ctx.fillStyle='#66717b';ctx.fillRect(0,-5,42,10);ctx.fillStyle='#89949d';ctx.fillRect(4,-8,24,5);
    if(id==='pistol'){ctx.fillRect(22,3,8,15);ctx.fillStyle='#424a51';ctx.fillRect(30,-3,13,6)}
    if(id==='smg'){ctx.fillStyle='#4d565e';ctx.fillRect(20,4,8,16);ctx.fillRect(34,-3,17,6);ctx.fillStyle='#79848d';ctx.fillRect(9,-10,12,4)}
    if(id==='shotgun'){ctx.fillStyle='#765c42';ctx.fillRect(1,5,15,6);ctx.fillStyle='#444c53';ctx.fillRect(39,-3,19,6);ctx.fillRect(20,4,7,14)}
    if(id==='rifle'){ctx.fillStyle='#4b535a';ctx.fillRect(18,4,9,17);ctx.fillRect(39,-3,20,6);ctx.fillStyle='#7c674d';ctx.fillRect(-5,4,13,8)}
    ctx.restore();ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle=d.color;ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText(d.name,0,-34);ctx.restore()}
function drawPickup`);
  (0,eval)(src+'\n//# sourceURL=game-core-pc.js');
  setTimeout(()=>window.DeadSectorPCUI?.mountScale(),0);
}).catch(err=>{console.error(err);document.body.innerHTML='<div style="padding:30px;color:white;font-family:system-ui">DEAD SECTOR failed to load. Refresh the page.</div>'});
})();
