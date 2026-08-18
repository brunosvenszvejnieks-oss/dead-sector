export const ACCURACY_HITS_REQUIRED = 10;
export const ACCURACY_SCORE_MULTIPLIER = 1.25;
export const MAX_BARRICADE_REPAIR_COST = 300;

export function accuracyMultiplier(streak) {
  return streak >= ACCURACY_HITS_REQUIRED ? ACCURACY_SCORE_MULTIPLIER : 1;
}

export function barricadeRepairCost(barrier) {
  const missingRatio = Math.max(0, Math.min(1, 1 - barrier.hp / barrier.maxHp));
  return Math.ceil((missingRatio * MAX_BARRICADE_REPAIR_COST) / 5) * 5;
}
