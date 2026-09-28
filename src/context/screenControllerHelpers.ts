import { ScreenLiveState } from '../types';

export const DEFAULT_SLIDE_DURATIONS = [10, 60, 60, 40, 40, 20];

export function getInitialScreenState(storageKey: string): ScreenLiveState {
  try {
    const stored = localStorage.getItem(`${storageKey}_screenState`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.slideDurations && parsed.slideDurations.length === 6) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  const totalSecs = DEFAULT_SLIDE_DURATIONS.reduce((a, b) => a + b, 0);
  return {
    teamId: '',
    slideIndex: 0,
    slideRemainingSeconds: DEFAULT_SLIDE_DURATIONS[0],
    slideDurations: DEFAULT_SLIDE_DURATIONS,
    totalRemainingSeconds: totalSecs,
    totalPitchSeconds: totalSecs,
    remainingSeconds: totalSecs,
    totalSeconds: totalSecs,
    isRunning: false,
    autoAdvance: true,
    isFinished: false,
    lastUpdated: Date.now()
  };
}

export function broadcastScreenState(storageKey: string, state: ScreenLiveState) {
  try {
    localStorage.setItem(`${storageKey}_screenState`, JSON.stringify(state));
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('smart_hackathon_2026_sync');
      channel.postMessage({ type: 'SCREEN_STATE_UPDATED', state, timestamp: Date.now() });
      channel.close();
    }
  } catch (err) {
    console.warn(err);
  }
}

export function calculateTickState(prev: ScreenLiveState): ScreenLiveState {
  if (!prev.isRunning) return prev;
  const durations = prev.slideDurations?.length === 6 ? prev.slideDurations : DEFAULT_SLIDE_DURATIONS;
  let curSlideRemaining = (prev.slideRemainingSeconds !== undefined ? prev.slideRemainingSeconds : durations[prev.slideIndex] || 10) - 1;
  let curTotalRemaining = Math.max(0, (prev.totalRemainingSeconds !== undefined ? prev.totalRemainingSeconds : prev.remainingSeconds || 230) - 1);
  let curSlideIdx = prev.slideIndex;
  let running = true;
  let finished = false;

  if (curSlideRemaining <= 0) {
    if (prev.autoAdvance && curSlideIdx < durations.length - 1) {
      curSlideIdx = curSlideIdx + 1;
      curSlideRemaining = durations[curSlideIdx];
    } else {
      curSlideRemaining = 0;
      curTotalRemaining = 0;
      running = false;
      finished = true;
    }
  }

  return {
    ...prev,
    slideIndex: curSlideIdx,
    slideRemainingSeconds: curSlideRemaining,
    slideDurations: durations,
    totalRemainingSeconds: curTotalRemaining,
    remainingSeconds: curTotalRemaining,
    isRunning: running,
    isFinished: finished,
    lastUpdated: Date.now()
  };
}
