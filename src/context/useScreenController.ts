import { useState, useEffect } from 'react';
import { ScreenLiveState } from '../types';
import {
  DEFAULT_SLIDE_DURATIONS,
  getInitialScreenState,
  broadcastScreenState,
  calculateTickState
} from './screenControllerHelpers';

export { DEFAULT_SLIDE_DURATIONS };

export function useScreenController(storageKey: string) {
  const [screenState, setScreenState] = useState<ScreenLiveState>(() => getInitialScreenState(storageKey));

  const broadcast = (state: ScreenLiveState) => broadcastScreenState(storageKey, state);

  useEffect(() => {
    if (!screenState.isRunning) return;

    const interval = setInterval(() => {
      setScreenState((prev) => {
        const updated = calculateTickState(prev);
        if (updated !== prev) {
          broadcast(updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screenState.isRunning, storageKey]);

  const sendTeamToScreen = (teamId: string, _durationMinutes = 6) => {
    const durations = [10, 60, 60, 40, 40, 20];
    const totalSecs = durations.reduce((a, b) => a + b, 0);
    const updated: ScreenLiveState = {
      teamId,
      slideIndex: 0,
      slideRemainingSeconds: durations[0],
      slideDurations: durations,
      totalRemainingSeconds: totalSecs,
      totalPitchSeconds: totalSecs,
      remainingSeconds: totalSecs,
      totalSeconds: totalSecs,
      isRunning: false,
      autoAdvance: true,
      isFinished: false,
      lastUpdated: Date.now()
    };
    setScreenState(updated);
    broadcast(updated);
  };

  const startScreenTimer = () => {
    setScreenState((prev) => {
      const updated = { ...prev, isRunning: true, lastUpdated: Date.now() };
      broadcast(updated);
      return updated;
    });
  };

  const pauseScreenTimer = () => {
    setScreenState((prev) => {
      const updated = { ...prev, isRunning: false, lastUpdated: Date.now() };
      broadcast(updated);
      return updated;
    });
  };

  const resetScreenTimer = () => {
    setScreenState((prev) => {
      const durations = prev.slideDurations?.length === 6 ? prev.slideDurations : DEFAULT_SLIDE_DURATIONS;
      const totalSecs = durations.reduce((a, b) => a + b, 0);
      const updated: ScreenLiveState = {
        ...prev,
        slideIndex: 0,
        slideRemainingSeconds: durations[0],
        totalRemainingSeconds: totalSecs,
        remainingSeconds: totalSecs,
        isRunning: false,
        isFinished: false,
        lastUpdated: Date.now()
      };
      broadcast(updated);
      return updated;
    });
  };

  const adjustScreenTimer = (secondsDelta: number) => {
    setScreenState((prev) => {
      const nextSlide = Math.max(0, (prev.slideRemainingSeconds || 0) + secondsDelta);
      const nextTotal = Math.max(0, (prev.totalRemainingSeconds || 0) + secondsDelta);
      const updated = { ...prev, slideRemainingSeconds: nextSlide, totalRemainingSeconds: nextTotal, remainingSeconds: nextTotal };
      broadcast(updated);
      return updated;
    });
  };

  const setScreenSlideIndex = (slideIdx: number) => {
    setScreenState((prev) => {
      const durations = prev.slideDurations?.length === 6 ? prev.slideDurations : DEFAULT_SLIDE_DURATIONS;
      const validIdx = Math.max(0, Math.min(slideIdx, durations.length - 1));
      const updated = { ...prev, slideIndex: validIdx, slideRemainingSeconds: durations[validIdx] };
      broadcast(updated);
      return updated;
    });
  };

  const nextScreenSlide = () => {
    setScreenState((prev) => {
      const durations = prev.slideDurations?.length === 6 ? prev.slideDurations : DEFAULT_SLIDE_DURATIONS;
      const nextIdx = Math.min(prev.slideIndex + 1, durations.length - 1);
      const updated = { ...prev, slideIndex: nextIdx, slideRemainingSeconds: durations[nextIdx] };
      broadcast(updated);
      return updated;
    });
  };

  const prevScreenSlide = () => {
    setScreenState((prev) => {
      const durations = prev.slideDurations?.length === 6 ? prev.slideDurations : DEFAULT_SLIDE_DURATIONS;
      const prevIdx = Math.max(prev.slideIndex - 1, 0);
      const updated = { ...prev, slideIndex: prevIdx, slideRemainingSeconds: durations[prevIdx] };
      broadcast(updated);
      return updated;
    });
  };

  const setCustomSlideDurations = (durations: number[]) => {
    setScreenState((prev) => {
      const updated = { ...prev, slideDurations: durations };
      broadcast(updated);
      return updated;
    });
  };

  const restartCurrentSlideTimer = () => {
    setScreenState((prev) => {
      const durations = prev.slideDurations?.length === 6 ? prev.slideDurations : DEFAULT_SLIDE_DURATIONS;
      const updated = { ...prev, slideRemainingSeconds: durations[prev.slideIndex] || 60 };
      broadcast(updated);
      return updated;
    });
  };

  return {
    screenState,
    setScreenState,
    sendTeamToScreen,
    startScreenTimer,
    pauseScreenTimer,
    resetScreenTimer,
    adjustScreenTimer,
    setScreenSlideIndex,
    nextScreenSlide,
    prevScreenSlide,
    setCustomSlideDurations,
    restartCurrentSlideTimer
  };
}
