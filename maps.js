export const maps = [
  {
    id: 'yard',
    name: 'BLACKSITE YARD',
    shortDesc: 'Open lanes and simple chokepoints.',
    desc: 'This is where the first evacuation fell apart. You have room to move in the service yard, but the storage blocks can trap you if you stop watching the side lanes.',
    unlock: 1,
    stars: 1,
    difficulty: 1,
    size: [2200, 1500],
    floor: '#15191b',
  },
  {
    id: 'metro',
    name: 'METRO 13',
    shortDesc: 'Tight platforms with dangerous flanks.',
    desc: 'The last trains never left Metro 13. Stay alert around the stalled carriages—the narrow passages make it easy for infected to come around behind you.',
    unlock: 2,
    stars: 2,
    difficulty: 1.08,
    size: [2100, 1450],
    floor: '#11151a',
  },
  {
    id: 'lab',
    name: 'BIOCORE LAB',
    shortDesc: 'Cramped rooms and stronger infected.',
    desc: 'Biocore studied the first infected brought into the sector. Its labs are cramped, the exits are awkward, and the things left inside are tougher than what you have faced so far.',
    unlock: 3,
    stars: 3,
    difficulty: 1.16,
    size: [2000, 1400],
    floor: '#171519',
  },
  {
    id: 'refinery',
    name: 'ASHFALL REFINERY',
    shortDesc: 'Long lanes with constant pressure.',
    desc: 'Ashfall supplied the containment crews until the workers disappeared. The machinery creates long firing lanes, but once a crowd reaches you there is very little room to slip past.',
    unlock: 4,
    stars: 4,
    difficulty: 1.26,
    size: [2250, 1500],
    floor: '#181513',
  },
  {
    id: 'vault',
    name: 'OBLIVION VAULT',
    shortDesc: 'Close quarters. No easy escape.',
    desc: 'The Oblivion Vault was supposed to be the safe place. It was sealed too late. Its security rooms are tight, its infected are vicious, and you will rarely have a clean escape route.',
    unlock: 5,
    stars: 5,
    difficulty: 1.38,
    size: [2050, 1450],
    floor: '#121216',
  },
];

export function makeMap(idx) {
  const m = maps[idx],
    obs = [],
    spawns = [],
    barr = [];
  if (m.id === 'yard') {
    obs.push(
      { x: 620, y: 340, w: 280, h: 170, type: 'stone' },
      { x: 1280, y: 300, w: 310, h: 190, type: 'stone' },
      { x: 850, y: 930, w: 450, h: 170, type: 'stone' },
      { x: 150, y: 650, w: 250, h: 90, type: 'wood' },
      { x: 1710, y: 780, w: 280, h: 100, type: 'wood' },
    );
    spawns.push(
      { x: 60, y: 60 },
      { x: 1100, y: 40 },
      { x: 2140, y: 100 },
      { x: 2150, y: 1350 },
      { x: 1100, y: 1450 },
      { x: 50, y: 1360 },
    );
  } else if (m.id === 'metro') {
    obs.push(
      { x: 350, y: 0, w: 120, h: 520, type: 'metroPillar' },
      { x: 350, y: 820, w: 120, h: 630, type: 'metroPillar' },
      { x: 920, y: 160, w: 130, h: 370, type: 'metroPillar' },
      { x: 920, y: 920, w: 130, h: 370, type: 'metroPillar' },
      { x: 1500, y: 0, w: 120, h: 510, type: 'metroPillar' },
      { x: 1500, y: 840, w: 120, h: 610, type: 'metroPillar' },
      { x: 350, y: 520, w: 260, h: 68, type: 'metroPillar' },
      { x: 760, y: 852, w: 290, h: 68, type: 'metroPillar' },
      { x: 1500, y: 510, w: 280, h: 68, type: 'metroPillar' },
      { x: 520, y: 650, w: 250, h: 110, type: 'metal' },
      { x: 560, y: 1080, w: 260, h: 100, type: 'metal' },
      { x: 1260, y: 640, w: 240, h: 110, type: 'wood' },
      { x: 1280, y: 1060, w: 240, h: 100, type: 'wood' },
    );
    spawns.push(
      { x: 50, y: 100 },
      { x: 60, y: 1350 },
      { x: 650, y: 50 },
      { x: 1320, y: 70 },
      { x: 2040, y: 100 },
      { x: 2050, y: 1350 },
    );
    barr.push(
      { x: 770, y: 690, w: 150, h: 24, hp: 600, maxHp: 600, playerPass: true, bulletPass: true },
      { x: 1050, y: 680, w: 210, h: 24, hp: 600, maxHp: 600, playerPass: true, bulletPass: true },
      { x: 820, y: 1120, w: 100, h: 24, hp: 600, maxHp: 600, playerPass: true, bulletPass: true },
      {
        x: 1050,
        y: 1100,
        w: 230,
        h: 24,
        hp: 600,
        maxHp: 600,
        playerPass: true,
        bulletPass: true,
      },
    );
  } else if (m.id === 'lab') {
    obs.push(
      { x: 440, y: 230, w: 260, h: 210, type: 'lab' },
      { x: 930, y: 180, w: 180, h: 390, type: 'lab' },
      { x: 1360, y: 250, w: 250, h: 210, type: 'lab' },
      { x: 300, y: 890, w: 330, h: 190, type: 'lab' },
      { x: 850, y: 860, w: 350, h: 210, type: 'lab' },
      { x: 1460, y: 850, w: 260, h: 210, type: 'lab' },
    );
    spawns.push(
      { x: 50, y: 50 },
      { x: 1000, y: 35 },
      { x: 1940, y: 60 },
      { x: 1940, y: 1330 },
      { x: 1000, y: 1360 },
      { x: 60, y: 1320 },
    );
    barr.push(
      { x: 790, y: 300, w: 24, h: 140, hp: 560, maxHp: 560 },
      { x: 1260, y: 920, w: 24, h: 140, hp: 560, maxHp: 560 },
    );
  } else if (m.id === 'refinery') {
    obs.push(
      { x: 280, y: 210, w: 420, h: 150, type: 'building' },
      { x: 980, y: 120, w: 260, h: 330, type: 'building' },
      { x: 1540, y: 230, w: 430, h: 150, type: 'building' },
      { x: 520, y: 700, w: 210, h: 480, type: 'wall' },
      { x: 940, y: 720, w: 370, h: 190, type: 'train' },
      { x: 1510, y: 690, w: 210, h: 500, type: 'wall' },
      { x: 250, y: 1280, w: 520, h: 90, type: 'crate' },
      { x: 1450, y: 1270, w: 520, h: 90, type: 'crate' },
    );
    spawns.push(
      { x: 45, y: 70 },
      { x: 1120, y: 35 },
      { x: 2190, y: 80 },
      { x: 2190, y: 1420 },
      { x: 1120, y: 1460 },
      { x: 50, y: 1410 },
      { x: 1120, y: 760 },
    );
    barr.push(
      { x: 820, y: 690, w: 24, h: 150, hp: 620, maxHp: 620 },
      { x: 1390, y: 690, w: 24, h: 150, hp: 620, maxHp: 620 },
      { x: 1080, y: 500, w: 120, h: 24, hp: 620, maxHp: 620 },
    );
  } else {
    obs.push(
      { x: 250, y: 180, w: 280, h: 250, type: 'lab' },
      { x: 760, y: 0, w: 120, h: 560, type: 'wall' },
      { x: 1130, y: 300, w: 340, h: 170, type: 'lab' },
      { x: 1690, y: 100, w: 180, h: 470, type: 'wall' },
      { x: 280, y: 900, w: 300, h: 260, type: 'lab' },
      { x: 800, y: 780, w: 450, h: 160, type: 'lab' },
      { x: 1480, y: 860, w: 300, h: 270, type: 'lab' },
      { x: 680, y: 1200, w: 150, h: 245, type: 'wall' },
      { x: 1260, y: 1180, w: 150, h: 265, type: 'wall' },
    );
    spawns.push(
      { x: 35, y: 40 },
      { x: 1030, y: 35 },
      { x: 2010, y: 45 },
      { x: 2010, y: 1400 },
      { x: 1030, y: 1410 },
      { x: 35, y: 1400 },
      { x: 1030, y: 710 },
      { x: 1540, y: 680 },
    );
    barr.push(
      { x: 910, y: 590, w: 120, h: 24, hp: 700, maxHp: 700 },
      { x: 1510, y: 590, w: 24, h: 140, hp: 700, maxHp: 700 },
      { x: 610, y: 980, w: 24, h: 140, hp: 700, maxHp: 700 },
    );
  }
  return { ...m, obs, spawns, shops: [], barr: barr.map((b) => ({ ...b })) };
}
