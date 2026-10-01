export const DEFAULT_FPS = 30

export function clampTime(time: number, duration: number) {
  const end = Number.isFinite(duration) && duration > 0 ? duration : Math.max(0, time)
  return Math.min(Math.max(0, time), end)
}

export function frameStep(time: number, direction: 1 | -1, duration: number, fps = DEFAULT_FPS) {
  return clampTime(time + direction / fps, duration)
}

export function frameThreshold(fps = DEFAULT_FPS) {
  return 1 / fps
}
