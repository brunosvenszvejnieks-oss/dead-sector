'use strict';
// Level definitions and geometry live here so new sectors can be added without touching game logic.
(() => {
const maps=[
 {id:'yard',name:'BLACKSITE YARD',desc:'Open lanes, manageable chokepoints.',unlock:1,stars:1,difficulty:1,size:[2200,1500],floor:'#15191b',accent:'#30383c'},
 {id:'metro',name:'METRO 13',desc:'Tight corridors and brutal flanks.',unlock:8,stars:2,difficulty:1.08,size:[2100,1450],floor:'#11151a',accent:'#29323b'},
 {id:'lab',name:'BIOCORE LAB',desc:'Elite density and little room to breathe.',unlock:15,stars:3,difficulty:1.16,size:[2000,1400],floor:'#171519',accent:'#392d38'},
 {id:'refinery',name:'ASHFALL REFINERY',desc:'Industrial kill lanes, hot choke points, relentless pressure.',unlock:22,stars:4,difficulty:1.26,size:[2250,1500],floor:'#181513',accent:'#49352b'},
 {id:'vault',name:'OBLIVION VAULT',desc:'The final sector. Claustrophobic, fast, and unforgiving.',unlock:30,stars:5,difficulty:1.38,size:[2050,1450],floor:'#121216',accent:'#34263d'}
];
function makeMap(idx){const m=maps[idx],obs=[],spawns=[],shops=[],barr=[];if(m.id==='yard'){
 obs.push({x:620,y:340,w:280,h:170,type:'building'},{x:1280,y:300,w:310,h:190,type:'building'},{x:850,y:930,w:450,h:170,type:'building'},{x:150,y:650,w:250,h:90,type:'crate'},{x:1710,y:780,w:280,h:100,type:'crate'});
 spawns.push({x:60,y:60},{x:1100,y:40},{x:2140,y:100},{x:2150,y:1350},{x:1100,y:1450},{x:50,y:1360});shops.push({x:540,y:520,weapon:'smg',cost:1700},{x:1570,y:570,weapon:'shotgun',cost:2200},{x:1380,y:1110,weapon:'rifle',cost:3000});barr.push({x:1040,y:190,w:120,h:24,hp:420,maxHp:420},{x:420,y:1040,w:24,h:140,hp:420,maxHp:420},{x:1660,y:1050,w:24,h:140,hp:420,maxHp:420});
 } else if(m.id==='metro'){
 obs.push({x:350,y:0,w:120,h:560,type:'wall'},{x:350,y:780,w:120,h:670,type:'wall'},{x:920,y:250,w:130,h:950,type:'wall'},{x:1500,y:0,w:120,h:550,type:'wall'},{x:1500,y:800,w:120,h:650,type:'wall'},{x:470,y:560,w:330,h:140,type:'train'},{x:1120,y:610,w:380,h:140,type:'train'});
 spawns.push({x:50,y:100},{x:60,y:1350},{x:650,y:50},{x:1320,y:70},{x:2040,y:100},{x:2050,y:1350});shops.push({x:560,y:770,weapon:'smg',cost:1900},{x:1240,y:530,weapon:'shotgun',cost:2400},{x:1740,y:660,weapon:'rifle',cost:3200});barr.push({x:735,y:320,w:24,h:130,hp:500,maxHp:500},{x:1270,y:950,w:24,h:130,hp:500,maxHp:500});
 } else if(m.id==='lab'){
 obs.push({x:440,y:230,w:260,h:210,type:'lab'},{x:930,y:180,w:180,h:390,type:'lab'},{x:1360,y:250,w:250,h:210,type:'lab'},{x:300,y:890,w:330,h:190,type:'lab'},{x:850,y:860,w:350,h:210,type:'lab'},{x:1460,y:850,w:260,h:210,type:'lab'});
 spawns.push({x:50,y:50},{x:1000,y:35},{x:1940,y:60},{x:1940,y:1330},{x:1000,y:1360},{x:60,y:1320});shops.push({x:730,y:640,weapon:'smg',cost:2100},{x:1260,y:650,weapon:'shotgun',cost:2600},{x:1740,y:600,weapon:'rifle',cost:3500});barr.push({x:790,y:300,w:24,h:140,hp:560,maxHp:560},{x:1260,y:920,w:24,h:140,hp:560,maxHp:560});
 } else if(m.id==='refinery'){
 obs.push({x:280,y:210,w:420,h:150,type:'building'},{x:980,y:120,w:260,h:330,type:'building'},{x:1540,y:230,w:430,h:150,type:'building'},{x:520,y:700,w:210,h:480,type:'wall'},{x:940,y:720,w:370,h:190,type:'train'},{x:1510,y:690,w:210,h:500,type:'wall'},{x:250,y:1280,w:520,h:90,type:'crate'},{x:1450,y:1270,w:520,h:90,type:'crate'});
 spawns.push({x:45,y:70},{x:1120,y:35},{x:2190,y:80},{x:2190,y:1420},{x:1120,y:1460},{x:50,y:1410},{x:1120,y:760});shops.push({x:800,y:560,weapon:'smg',cost:2300},{x:1390,y:560,weapon:'shotgun',cost:2900},{x:1110,y:1100,weapon:'rifle',cost:3800});barr.push({x:820,y:690,w:24,h:150,hp:620,maxHp:620},{x:1390,y:690,w:24,h:150,hp:620,maxHp:620},{x:1080,y:500,w:120,h:24,hp:620,maxHp:620});
 } else {
 obs.push({x:250,y:180,w:280,h:250,type:'lab'},{x:760,y:0,w:120,h:560,type:'wall'},{x:1130,y:300,w:340,h:170,type:'lab'},{x:1690,y:100,w:180,h:470,type:'wall'},{x:280,y:900,w:300,h:260,type:'lab'},{x:800,y:780,w:450,h:160,type:'lab'},{x:1480,y:860,w:300,h:270,type:'lab'},{x:680,y:1200,w:150,h:245,type:'wall'},{x:1260,y:1180,w:150,h:265,type:'wall'});
 spawns.push({x:35,y:40},{x:1030,y:35},{x:2010,y:45},{x:2010,y:1400},{x:1030,y:1410},{x:35,y:1400},{x:1030,y:710},{x:1540,y:680});shops.push({x:640,y:650,weapon:'smg',cost:2600},{x:1410,y:620,weapon:'shotgun',cost:3200},{x:1030,y:1030,weapon:'rifle',cost:4200});barr.push({x:910,y:590,w:120,h:24,hp:700,maxHp:700},{x:1510,y:590,w:24,h:140,hp:700,maxHp:700},{x:610,y:980,w:24,h:140,hp:700,maxHp:700});
 }
 return {...m,obs,spawns,shops,barr:barr.map(b=>({...b}))};}
window.DeadSectorMaps={maps,makeMap};
})();
