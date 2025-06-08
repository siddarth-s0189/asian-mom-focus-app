import { useEffect, useRef } from "react";

const FOCUS_REMINDER_MIN_INTERVAL = 10 * 60 * 1000; // 10 minutes
const BREAK_BUFFER_TIME = 5 * 60; // 5 minutes in seconds

interface SessionConfig {
  sessionTitle: string;
  goal: string;
  duration: number;
  breaks: boolean;
  workplace: string;
  strictness: number;
}

export const useFocusReminders = (
  isRunning: boolean,
  isBreak: boolean,
  sessionConfig: SessionConfig | null,
  showMomOverlay: boolean,
  timeRemaining: number,
  totalTime: number,
  getBreakSchedule: (config: SessionConfig) => any[],
  onFocusReminder: () => void,
  sessionStartTimestampRef: React.MutableRefObject<number | null>,
  getElapsedSeconds: () => number
) => {
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMomAudioTimestampRef = useRef<number>(Date.now());
  const nextReminderTimeRef = useRef<number>(0);

  const getReminderFrequency = (strictness: number) => {
    if (strictness < 33) return 1; // chill
    if (strictness < 67) return 2; // medium
    return 3; // insane
  };

  const calculateNextReminderTime = (strictness: number, currentTime: number) => {
    const frequency = getReminderFrequency(strictness);
    const baseInterval = (30 * 60) / frequency; // 30 minutes divided by frequency
    const randomOffset = (Math.random() - 0.5) * 4 * 60; // +/- 2 minutes in seconds
    return currentTime + baseInterval + randomOffset;
  };

  const isNearBreak = () => {
    if (!sessionConfig?.breaks || !sessionConfig) return false;
    if (isBreak) return true;
    const timeElapsed = getElapsedSeconds();
    const breakSchedule = getBreakSchedule(sessionConfig);

    for (const breakInfo of breakSchedule) {
      const breakStartTime = breakInfo.startTime * 60;
      const breakEndTime = breakStartTime + breakInfo.duration * 60;
      if (
        Math.abs(timeElapsed - breakStartTime) <= BREAK_BUFFER_TIME ||
        Math.abs(timeElapsed - breakEndTime) <= BREAK_BUFFER_TIME
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isRunning && !isBreak && sessionConfig && !showMomOverlay) {
      const checkReminder = () => {
        const timeElapsed = getElapsedSeconds();

        if (isNearBreak()) return;

        if (nextReminderTimeRef.current === 0) {
          nextReminderTimeRef.current = calculateNextReminderTime(
            sessionConfig.strictness,
            timeElapsed
          );
        }

        if (
          timeElapsed >= nextReminderTimeRef.current &&
          Date.now() - lastMomAudioTimestampRef.current > FOCUS_REMINDER_MIN_INTERVAL
        ) {
          onFocusReminder();
          lastMomAudioTimestampRef.current = Date.now();
          nextReminderTimeRef.current = calculateNextReminderTime(
            sessionConfig.strictness,
            timeElapsed
          );
        }
      };

      reminderIntervalRef.current = setInterval(checkReminder, 30000);

      return () => {
        if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
      };
    }
    nextReminderTimeRef.current = 0;
  }, [
    isRunning,
    isBreak,
    sessionConfig,
    showMomOverlay,
    getBreakSchedule,
    onFocusReminder,
    getElapsedSeconds,
  ]);

  const updateLastMomAudioTimestamp = () => {
    lastMomAudioTimestampRef.current = Date.now();
  };

  const resetReminderTiming = () => {
    nextReminderTimeRef.current = 0;
  };

  return {
    updateLastMomAudioTimestamp,
    resetReminderTiming
  };
};