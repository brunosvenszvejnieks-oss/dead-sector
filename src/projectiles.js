import { clamp, lerp } from './math.js';

const TRACE_STEP = 5;
const MAX_BOUNCES = 1;

export function traceShot(map, x, y, angle, range) {
  const points = [{ x, y }];
  const walls = [
    ...map.obs,
    ...map.barr.filter((barrier) => barrier.hp > 0 && !barrier.bulletPass),
  ];
  let currentX = x;
  let currentY = y;
  let velocityX = Math.cos(angle);
  let velocityY = Math.sin(angle);
  let remaining = range;
  let bounces = 0;

  while (remaining > 0) {
    const step = Math.min(TRACE_STEP, remaining);
    const nextX = currentX + velocityX * step;
    const nextY = currentY + velocityY * step;
    const wall = walls.find(
      (obstacle) =>
        nextX >= obstacle.x &&
        nextX <= obstacle.x + obstacle.w &&
        nextY >= obstacle.y &&
        nextY <= obstacle.y + obstacle.h,
    );

    if (!wall) {
      currentX = nextX;
      currentY = nextY;
      remaining -= step;
      continue;
    }

    points.push({ x: currentX, y: currentY });
    if (bounces++ >= MAX_BOUNCES) break;

    const distanceLeft = Math.abs(currentX - wall.x);
    const distanceRight = Math.abs(currentX - (wall.x + wall.w));
    const distanceTop = Math.abs(currentY - wall.y);
    const distanceBottom = Math.abs(currentY - (wall.y + wall.h));
    if (Math.min(distanceLeft, distanceRight) < Math.min(distanceTop, distanceBottom)) {
      velocityX = -velocityX;
    } else {
      velocityY = -velocityY;
    }
    currentX += velocityX * 3;
    currentY += velocityY * 3;
    remaining -= step;
  }

  const lastPoint = points.at(-1);
  if (Math.hypot(lastPoint.x - currentX, lastPoint.y - currentY) > 1) {
    points.push({ x: currentX, y: currentY });
  }
  return points;
}

export function pointOnPath(points, distance) {
  let travelled = 0;
  for (let index = 1; index < points.length; index++) {
    const start = points[index - 1];
    const end = points[index];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    if (travelled + length >= distance) {
      const progress = clamp((distance - travelled) / (length || 1), 0, 1);
      return {
        x: lerp(start.x, end.x, progress),
        y: lerp(start.y, end.y, progress),
      };
    }
    travelled += length;
  }
  return points.at(-1);
}

export function pathLength(points) {
  let total = 0;
  for (let index = 1; index < points.length; index++) {
    total += Math.hypot(
      points[index].x - points[index - 1].x,
      points[index].y - points[index - 1].y,
    );
  }
  return total;
}
