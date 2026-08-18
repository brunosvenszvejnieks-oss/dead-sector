import { clamp, lineRect } from './math.js';

const CELL_SIZE = 48;
const SEARCH_LIMIT = 5_200;

function cellBlocked(map, column, row, radius = 12) {
  const x = column * CELL_SIZE + CELL_SIZE / 2;
  const y = row * CELL_SIZE + CELL_SIZE / 2;
  const obstacles = [...map.obs, ...map.barr.filter((barrier) => barrier.hp > 0)];
  return obstacles.some(
    (obstacle) =>
      x > obstacle.x - radius &&
      x < obstacle.x + obstacle.w + radius &&
      y > obstacle.y - radius &&
      y < obstacle.y + obstacle.h + radius,
  );
}

export function hasClearPath(map, entity, startX, startY, endX, endY) {
  const obstacles = [...map.obs, ...map.barr.filter((barrier) => barrier.hp > 0)];
  return !obstacles.some((obstacle) =>
    lineRect(startX, startY, endX, endY, {
      x: obstacle.x - entity.r,
      y: obstacle.y - entity.r,
      w: obstacle.w + entity.r * 2,
      h: obstacle.h + entity.r * 2,
    }),
  );
}

export function findPath(map, entity, targetX, targetY) {
  const columns = Math.ceil(map.size[0] / CELL_SIZE);
  const rows = Math.ceil(map.size[1] / CELL_SIZE);
  const startColumn = clamp(Math.floor(entity.x / CELL_SIZE), 0, columns - 1);
  const startRow = clamp(Math.floor(entity.y / CELL_SIZE), 0, rows - 1);
  const goalColumn = clamp(Math.floor(targetX / CELL_SIZE), 0, columns - 1);
  const goalRow = clamp(Math.floor(targetY / CELL_SIZE), 0, rows - 1);
  const key = (column, row) => row * columns + column;
  const start = key(startColumn, startRow);
  const goal = key(goalColumn, goalRow);
  const open = [{ x: startColumn, y: startRow, g: 0, f: 0 }];
  const cameFrom = new Map();
  const costs = new Map([[start, 0]]);
  const visited = new Set();
  const directions = [
    [1, 0, 1],
    [-1, 0, 1],
    [0, 1, 1],
    [0, -1, 1],
    [1, 1, 1.414],
    [1, -1, 1.414],
    [-1, 1, 1.414],
    [-1, -1, 1.414],
  ];

  let searched = 0;
  while (open.length && searched++ < SEARCH_LIMIT) {
    open.sort((left, right) => left.f - right.f);
    const current = open.shift();
    const currentKey = key(current.x, current.y);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    if (currentKey === goal) {
      const rawPath = [];
      let pathKey = currentKey;
      while (pathKey !== start && cameFrom.has(pathKey)) {
        const column = pathKey % columns;
        const row = Math.floor(pathKey / columns);
        rawPath.push({
          x: column * CELL_SIZE + CELL_SIZE / 2,
          y: row * CELL_SIZE + CELL_SIZE / 2,
        });
        pathKey = cameFrom.get(pathKey);
      }
      rawPath.reverse();

      const smoothPath = [];
      let anchorX = entity.x;
      let anchorY = entity.y;
      let index = 0;
      while (index < rawPath.length) {
        let best = index;
        for (
          let lookAhead = Math.min(rawPath.length - 1, index + 7);
          lookAhead > index;
          lookAhead--
        ) {
          const candidate = rawPath[lookAhead];
          if (hasClearPath(map, entity, anchorX, anchorY, candidate.x, candidate.y)) {
            best = lookAhead;
            break;
          }
        }
        smoothPath.push(rawPath[best]);
        anchorX = rawPath[best].x;
        anchorY = rawPath[best].y;
        index = best + 1;
      }
      return smoothPath;
    }

    for (const [offsetX, offsetY, stepCost] of directions) {
      const nextColumn = current.x + offsetX;
      const nextRow = current.y + offsetY;
      if (
        nextColumn < 0 ||
        nextRow < 0 ||
        nextColumn >= columns ||
        nextRow >= rows ||
        cellBlocked(map, nextColumn, nextRow, entity.r)
      ) {
        continue;
      }
      if (
        offsetX &&
        offsetY &&
        (cellBlocked(map, current.x + offsetX, current.y, entity.r) ||
          cellBlocked(map, current.x, current.y + offsetY, entity.r))
      ) {
        continue;
      }

      const nextKey = key(nextColumn, nextRow);
      const nextCost = current.g + stepCost;
      if (nextCost < (costs.get(nextKey) ?? Infinity)) {
        costs.set(nextKey, nextCost);
        cameFrom.set(nextKey, currentKey);
        const heuristic = Math.hypot(nextColumn - goalColumn, nextRow - goalRow);
        open.push({ x: nextColumn, y: nextRow, g: nextCost, f: nextCost + heuristic });
      }
    }
  }
  return [];
}
