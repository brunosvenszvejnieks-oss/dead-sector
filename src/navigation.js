import { clamp, lineRect } from './math.js';

const CELL_SIZE = 32;
const SEARCH_LIMIT = 12_000;

function pushCandidate(heap, candidate) {
  heap.push(candidate);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (heap[parent].f <= candidate.f) break;
    heap[index] = heap[parent];
    index = parent;
  }
  heap[index] = candidate;
}

function popCandidate(heap) {
  const first = heap[0];
  const last = heap.pop();
  if (!heap.length) return first;
  let index = 0;
  while (true) {
    const left = index * 2 + 1;
    const right = left + 1;
    if (left >= heap.length) break;
    const smaller = right < heap.length && heap[right].f < heap[left].f ? right : left;
    if (heap[smaller].f >= last.f) break;
    heap[index] = heap[smaller];
    index = smaller;
  }
  heap[index] = last;
  return first;
}

function cellBlocked(map, column, row, radius = 12) {
  const x = column * CELL_SIZE + CELL_SIZE / 2;
  const y = row * CELL_SIZE + CELL_SIZE / 2;
  const containsPoint = (obstacle) =>
    x > obstacle.x - radius &&
    x < obstacle.x + obstacle.w + radius &&
    y > obstacle.y - radius &&
    y < obstacle.y + obstacle.h + radius;
  return (
    map.obs.some(containsPoint) ||
    map.barr.some((barrier) => barrier.hp > 0 && containsPoint(barrier))
  );
}

export function hasClearPath(map, entity, startX, startY, endX, endY) {
  const intersects = (obstacle) =>
    lineRect(startX, startY, endX, endY, {
      x: obstacle.x - entity.r,
      y: obstacle.y - entity.r,
      w: obstacle.w + entity.r * 2,
      h: obstacle.h + entity.r * 2,
    });
  return (
    !map.obs.some(intersects) && !map.barr.some((barrier) => barrier.hp > 0 && intersects(barrier))
  );
}

function closestOpenCell(map, column, row, columns, rows, radius) {
  if (!cellBlocked(map, column, row, radius)) return { column, row };
  for (let ring = 1; ring <= 8; ring++) {
    let best = null;
    let bestDistance = Infinity;
    for (let offsetY = -ring; offsetY <= ring; offsetY++) {
      for (let offsetX = -ring; offsetX <= ring; offsetX++) {
        if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) !== ring) continue;
        const candidateColumn = column + offsetX;
        const candidateRow = row + offsetY;
        if (
          candidateColumn < 0 ||
          candidateRow < 0 ||
          candidateColumn >= columns ||
          candidateRow >= rows ||
          cellBlocked(map, candidateColumn, candidateRow, radius)
        ) {
          continue;
        }
        const distance = offsetX ** 2 + offsetY ** 2;
        if (distance < bestDistance) {
          best = { column: candidateColumn, row: candidateRow };
          bestDistance = distance;
        }
      }
    }
    if (best) return best;
  }
  return { column, row };
}

export function findPath(map, entity, targetX, targetY) {
  const columns = Math.ceil(map.size[0] / CELL_SIZE);
  const rows = Math.ceil(map.size[1] / CELL_SIZE);
  const requestedStartColumn = clamp(Math.floor(entity.x / CELL_SIZE), 0, columns - 1);
  const requestedStartRow = clamp(Math.floor(entity.y / CELL_SIZE), 0, rows - 1);
  const requestedGoalColumn = clamp(Math.floor(targetX / CELL_SIZE), 0, columns - 1);
  const requestedGoalRow = clamp(Math.floor(targetY / CELL_SIZE), 0, rows - 1);
  const startCell = closestOpenCell(
    map,
    requestedStartColumn,
    requestedStartRow,
    columns,
    rows,
    entity.r,
  );
  const goalCell = closestOpenCell(
    map,
    requestedGoalColumn,
    requestedGoalRow,
    columns,
    rows,
    entity.r,
  );
  const startColumn = startCell.column;
  const startRow = startCell.row;
  const goalColumn = goalCell.column;
  const goalRow = goalCell.row;
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
    const current = popCandidate(open);
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
        pushCandidate(open, {
          x: nextColumn,
          y: nextRow,
          g: nextCost,
          f: nextCost + heuristic,
        });
      }
    }
  }
  return [];
}
