export const TAU = Math.PI * 2;

export const rand = (min, max) => min + Math.random() * (max - min);

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const lerp = (start, end, amount) => start + (end - start) * amount;

export function circleRect(cx, cy, radius, rect) {
  const nearestX = clamp(cx, rect.x, rect.x + rect.w);
  const nearestY = clamp(cy, rect.y, rect.y + rect.h);
  return (cx - nearestX) ** 2 + (cy - nearestY) ** 2 < radius ** 2;
}

export function resolveCircleRect(entity, rect, radius = entity.r) {
  const nearestX = clamp(entity.x, rect.x, rect.x + rect.w);
  const nearestY = clamp(entity.y, rect.y, rect.y + rect.h);
  const dx = entity.x - nearestX;
  const dy = entity.y - nearestY;
  const distance = Math.hypot(dx, dy);

  if (distance >= radius || distance === 0) return false;

  const penetration = radius - distance;
  entity.x += (dx / distance) * penetration;
  entity.y += (dy / distance) * penetration;
  return true;
}

export function lineRect(x1, y1, x2, y2, rect) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 12));

  for (let index = 0; index <= steps; index++) {
    const amount = index / steps;
    const x = lerp(x1, x2, amount);
    const y = lerp(y1, y2, amount);
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
      return true;
    }
  }

  return false;
}
