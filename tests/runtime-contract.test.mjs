import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { RANGE_SCALE, WALKER_VARIANTS, weaponDefs } from '../src/config.js';
import { circleRect, clamp, lerp, lineRect, resolveCircleRect } from '../src/math.js';
import { findPath, hasClearPath } from '../src/navigation.js';
import { pathLength, pointOnPath, traceShot } from '../src/projectiles.js';
import {
  ACCURACY_SCORE_MULTIPLIER,
  accuracyMultiplier,
  barricadeRepairCost,
} from '../src/scoring.js';
import { makeMap } from '../maps.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('HTML keeps the direct-source startup order', async () => {
  const html = await read('index.html');
  const expectedOrder = ['audio.js', 'mobile.js', 'pc-ui.js', 'game.js'];
  const positions = expectedOrder.map((name) => html.indexOf(name));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b),
  );
  assert.equal(html.includes('game-loader.js'), false);
  assert.equal((html.match(/rel="stylesheet"/g) ?? []).length, 1);
  assert.match(html, /<script type="module" src="game\.js/);
});

test('published gameplay contract remains unchanged', async () => {
  const game = await read('game.js');

  const required = [
    'speed: (95 + v.speedBonus',
    'hp: scale((100 + w * 10) * 1.5)',
    'hp: scale((55 + w * 6) * 1.5)',
    'score: 1000',
    'speed: (86 + w * 0.85)',
    'dmg: waveDamage(40)',
    'dmg: waveDamage(70)',
    '300 * (1 - d / 260)',
    'game.wave >= 10',
    'game.healDropChance * (game.wave > 6 ? 0.5 : 1)',
    'p.freeze = 1',
    'damagePlayer(2, true)',
    "shootState: 'cooldown'",
    "e.shootState = 'raising'",
    "e.shootState = 'lowering'",
    'Math.hypot(e.x - p.x, e.y - p.y) <= 300',
    'game.shots += d.pellets',
  ];

  for (const fragment of required) assert.ok(game.includes(fragment), fragment);
  assert.ok(game.includes("d: '+25 health now.'"));
  assert.ok(game.includes("d: '+2% grenade drop chance.'"));
  assert.equal(game.includes("t: 'Light Step'"), false);
  assert.equal(RANGE_SCALE, 7);
  assert.equal(weaponDefs.pistol.rangeRating, 70);
  assert.equal(weaponDefs.pistol.range, 70 * RANGE_SCALE);
  assert.equal(weaponDefs.pistol2.rangeRating, 60);
  assert.equal(weaponDefs.shotgun.cost, 6_000);
  assert.equal(weaponDefs.pistol2.cost, 2_500);
  assert.equal(weaponDefs.rifle.cost, 15_000);
  assert.deepEqual(
    WALKER_VARIANTS.map(({ speedBonus }) => speedBonus),
    [0, 4, 8, 12],
  );
});

test('accuracy bonus and proportional barricade repair costs remain balanced', () => {
  assert.equal(accuracyMultiplier(9), 1);
  assert.equal(accuracyMultiplier(10), ACCURACY_SCORE_MULTIPLIER);
  assert.equal(ACCURACY_SCORE_MULTIPLIER, 1.25);
  assert.equal(barricadeRepairCost({ hp: 0, maxHp: 150 }), 300);
  assert.equal(barricadeRepairCost({ hp: 75, maxHp: 150 }), 150);
  assert.equal(barricadeRepairCost({ hp: 149, maxHp: 150 }), 5);
});

test('save keys remain backward compatible', async () => {
  const game = await read('game.js');
  const pcUi = await read('pc-ui.js');

  assert.ok(game.includes("'deadSectorSave'"));
  assert.ok(game.includes("'deadSectorBinds'"));
  assert.ok(pcUi.includes("'deadSectorUIScale'"));
});

test('Level II geometry contract remains unchanged', () => {
  const metro = makeMap(1);
  assert.equal(metro.obs.filter(({ type }) => type === 'metroPillar').length, 9);
  assert.equal(metro.barr.length, 4);
  assert.ok(metro.barr.every(({ hp, maxHp }) => hp === 150 && maxHp === 150));
  assert.ok(metro.barr.every(({ playerPass, bulletPass }) => playerPass && bulletPass));

  metro.barr[0].hp = 0;
  assert.equal(makeMap(1).barr[0].hp, 150, 'map instances must not share mutable barrier state');
});

test('math helpers preserve collision behavior', () => {
  assert.equal(clamp(12, 0, 10), 10);
  assert.equal(lerp(10, 20, 0.25), 12.5);
  assert.equal(circleRect(5, 5, 2, { x: 6, y: 4, w: 3, h: 3 }), true);
  assert.equal(lineRect(0, 0, 10, 10, { x: 4, y: 4, w: 2, h: 2 }), true);
  const entity = { x: 5, y: 5, r: 2 };
  assert.equal(resolveCircleRect(entity, { x: 6, y: 4, w: 3, h: 3 }), true);
  assert.deepEqual(entity, { x: 4, y: 5, r: 2 });
});

test('projectile paths keep travel, wall collision, and one ricochet', () => {
  const clearMap = { obs: [], barr: [] };
  const straight = traceShot(clearMap, 10, 10, 0, 100);
  assert.equal(pathLength(straight), 100);
  assert.deepEqual(pointOnPath(straight, 40), { x: 50, y: 10 });

  const wallMap = { obs: [{ x: 50, y: 0, w: 10, h: 100 }], barr: [] };
  const ricochet = traceShot(wallMap, 10, 25, 0, 100);
  assert.ok(ricochet.length >= 3);
  assert.ok(ricochet.at(-1).x < ricochet[1].x);
});

test('navigation respects obstacles and live barriers', () => {
  const entity = { x: 24, y: 24, r: 10 };
  const clearMap = { size: [240, 240], obs: [], barr: [] };
  assert.equal(hasClearPath(clearMap, entity, 24, 24, 200, 24), true);

  const blockedMap = {
    size: [240, 240],
    obs: [{ x: 80, y: 0, w: 30, h: 150 }],
    barr: [],
  };
  assert.equal(hasClearPath(blockedMap, entity, 24, 24, 200, 24), false);
  assert.ok(findPath(blockedMap, entity, 200, 24).length > 0);

  const metro = makeMap(1);
  const metroTarget = { x: metro.size[0] / 2, y: metro.size[1] / 2 };
  for (const spawn of metro.spawns) {
    assert.ok(
      findPath(metro, { ...spawn, r: 18 }, metroTarget.x, metroTarget.y).length > 0,
      `Metro spawn at ${spawn.x},${spawn.y} must reach the player area`,
    );
  }
});
