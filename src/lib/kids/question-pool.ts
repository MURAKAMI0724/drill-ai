/**
 * Picks a random index not yet in `used` (adding it before returning), so a
 * question doesn't repeat until the whole pool has been exhausted — mirrors
 * shiritoriUsed's "don't reuse until exhausted, then reset" behavior. Once
 * every index has been used, `used` is cleared and the cycle starts over.
 */
export function pickUnusedIndex(total: number, used: Set<number>): number {
  if (used.size >= total) used.clear();
  const available: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!used.has(i)) available.push(i);
  }
  const idx = available[Math.floor(Math.random() * available.length)];
  used.add(idx);
  return idx;
}
