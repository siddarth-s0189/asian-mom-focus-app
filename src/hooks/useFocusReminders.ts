
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
  onFocusReminder: () => void
) => {
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMomAudioTimestampRef = useRef<number>(Date.now());
  const nextReminderTimeRef = useRef<number>(0);

  // Get reminder frequency based on strictness (per 30 minutes)
  const getReminderFrequency = (strictness: number) => {
    if (strictness < 33) return 1; // chill
    if (strictness < 67) return 2; // medium
    return 3; // insane
  };

  // Calculate next reminder time with randomization
  const calculateNextReminderTime = (strictness: number, currentTime: number) => {
    const frequency = getReminderFrequency(strictness);
    const baseInterval = (30 * 60) / frequency; // 30 minutes divided by frequency
    const randomOffset = (Math.random() - 0.5) * 4 * 60; // +/- 2 minutes in seconds
    return currentTime + baseInterval + randomOffset;
  };

  // Check if we're near a break (5 minutes before or after, or during break)
  const isNearBreak = () => {
    if (!sessionConfig?.breaks || !sessionConfig) return false;
    
    if (isBreak) return true; // During break
    
    const timeElapsed = totalTime - timeRemaining;
    const breakSchedule = getBreakSchedule(sessionConfig);
    
    for (const breakInfo of breakSchedule) {
      const breakStartTime = breakInfo.startTime * 60; // Convert to seconds
      const breakEndTime = breakStartTime + (breakInfo.duration * 60);
      
      // Check if within 5 minutes before or after break
      if (
        Math.abs(timeElapsed - breakStartTime) <= BREAK_BUFFER_TIME ||
        Math.abs(timeElapsed - breakEndTime) <= BREAK_BUFFER_TIME
      ) {
        return true;
      }
    }
    
    return false;
  };

  // Focus reminder logic with improved timing and break avoidance
  useEffect(() => {
    if (isRunning && !isBreak && sessionConfig && !showMomOverlay) {
      const checkReminder = () => {
        const timeElapsed = totalTime - timeRemaining;
        
        // Don't send reminders if we're near a break or during breaks
        if (isNearBreak()) return;
        
        // Initialize next reminder time if not set
        if (nextReminderTimeRef.current === 0) {
          nextReminderTimeRef.current = calculateNextReminderTime(sessionConfig.strictness, timeElapsed);
        }
        
        // Check if it's time for a reminder
        if (
          timeElapsed >= nextReminderTimeRef.current &&
          Date.now() - lastMomAudioTimestampRef.current > FOCUS_REMINDER_MIN_INTERVAL
        ) {
          onFocusReminder();
          // Schedule next reminder
          nextReminderTimeRef.current = calculateNextReminderTime(sessionConfig.strictness, timeElapsed);
        }
      };

      reminderIntervalRef.current = setInterval(checkReminder, 30000); // Check every 30 seconds
    }

    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
      }
    };
  }, [isRunning, isBreak, sessionConfig, showMomOverlay, timeRemaining]);

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
