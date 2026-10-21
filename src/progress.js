export const SAVE_KEY = 'paws-and-parquet.v1';

export function loadProgress(storage, count) {
  try {
    const raw = JSON.parse(storage.getItem(SAVE_KEY) || '{}');
    const completed = [...new Set((Array.isArray(raw.completed) ? raw.completed : []).filter(n => Number.isInteger(n) && n >= 1 && n <= count))];
    const unlocked = unlockedCount(completed, count);
    return { completed, current: Number.isInteger(raw.current) ? Math.max(0, Math.min(unlocked - 1, raw.current)) : 0, sound: raw.sound === true };
  } catch { return { completed: [], current: 0, sound: false }; }
}
export function unlockedCount(completed, count) {
  let n = 1;
  while (n < count && completed.includes(n)) n++;
  return n;
}
export function saveProgress(storage, progress) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
