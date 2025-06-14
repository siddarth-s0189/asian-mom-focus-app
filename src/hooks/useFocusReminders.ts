
import { useEffect, useRef } from "react";

// Focus reminder schedules (in minutes)
const SCHEDULES = {
  chill: {
    "25-5": [15, 45, 75, 105],
    "50-10": [20, 40, 80, 100, 140, 160, 200, 220, 260, 280, 320, 340],
  },
  medium: {
    "25-5": [10, 20, 40, 50, 70, 80, 100, 110],
    "50-10": [
      10, 20, 30, 40, 70, 80, 90, 100, 130, 140, 150, 160, 190, 200, 210, 220,
      250, 260, 270, 280, 310, 320, 330, 340,
    ],
  },
  insane: {
    "25-5": [
      6, 12, 18, 36, 42, 48, 66, 72, 78, 96, 102, 108,
    ],
    "50-10": [
      7.5, 15, 22.5, 30, 37.5, 45, 67.5, 75, 82.5, 90, 97.5, 105, 127.5, 135,
      142.5, 150, 157.5, 165, 187.5, 195, 202.5, 210, 217.5, 225, 247.5, 255,
      262.5, 270, 277.5, 285, 307.5, 315, 322.5, 330, 337.5, 345,
    ],
  },
};

function getStrictnessKey(strictness: number): keyof typeof SCHEDULES {
  if (strictness < 33) return "chill";
  if (strictness < 67) return "medium";
  return "insane";
}

function getSplitKey(sessionMinutes: number): "25-5" | "50-10" {
  return sessionMinutes < 120 ? "25-5" : "50-10";
}

function getReminderSchedule(
  sessionMinutes: number,
  strictness: number
): number[] {
  const strictnessKey = getStrictnessKey(strictness);
  const splitKey = getSplitKey(sessionMinutes);

  const scheduleMinutes = SCHEDULES[strictnessKey][splitKey];
  return scheduleMinutes
    .map((m) => Math.round(m * 60)) // convert to seconds
    .filter((sec) => sec < sessionMinutes * 60);
}

interface SessionConfig {
  sessionTitle: string;
  goal: string;
  duration: number; // in minutes
  breaks: boolean;
  workplace: string;
  strictness: number;
}

export const useFocusReminders = (
  isRunning: boolean,
  isBreak: boolean,
  sessionConfig: SessionConfig | null,
  showMomOverlay: boolean,
  _timeRemaining: number, // not needed
  totalTime: number, // in seconds
  getBreakSchedule: (config: SessionConfig) => any[],
  onFocusReminder: () => void,
  sessionStartTimestampRef: React.MutableRefObject<number | null>,
  getElapsedSeconds: () => number
) => {
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredRemindersRef = useRef<Set<number>>(new Set());
  const scheduledRemindersRef = useRef<number[]>([]);
  const lastVisibilityCheckRef = useRef<number>(0);
  const isProcessingReminderRef = useRef<boolean>(false);

  // Recompute schedule whenever config/session changes
  useEffect(() => {
    if (!sessionConfig) return;
    const schedule = getReminderSchedule(sessionConfig.duration, sessionConfig.strictness);
    scheduledRemindersRef.current = schedule;
    triggeredRemindersRef.current = new Set();
    console.log("[FocusReminders] Schedule computed:", schedule);
  }, [sessionConfig]);

  // Reset reminders when session starts fresh
  const resetReminderTiming = () => {
    console.log("[FocusReminders] Resetting reminder timing");
    triggeredRemindersRef.current = new Set();
    isProcessingReminderRef.current = false;
  };

  // Clear reminders when break starts
  useEffect(() => {
    if (isBreak) {
      console.log("[FocusReminders] Break started, clearing reminder interval");
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
        reminderIntervalRef.current = null;
      }
      isProcessingReminderRef.current = false;
    }
  }, [isBreak]);

  // Main reminder checking logic
  useEffect(() => {
    if (
      isRunning &&
      sessionConfig &&
      !isBreak &&
      !showMomOverlay &&
      sessionStartTimestampRef.current
    ) {
      const checkReminders = () => {
        // Don't process if already processing a reminder
        if (isProcessingReminderRef.current) {
          return;
        }

        const elapsed = getElapsedSeconds();
        
        // Find the next reminder that should have triggered
        for (const reminderTime of scheduledRemindersRef.current) {
          if (
            !triggeredRemindersRef.current.has(reminderTime) &&
            elapsed >= reminderTime
          ) {
            console.log(`[FocusReminders] Triggering reminder at ${reminderTime}s (elapsed: ${elapsed}s)`);
            triggeredRemindersRef.current.add(reminderTime);
            isProcessingReminderRef.current = true;
            
            onFocusReminder();
            
            // Reset processing flag after a delay to prevent rapid-fire
            setTimeout(() => {
              isProcessingReminderRef.current = false;
            }, 2000);
            
            // Only trigger one reminder at a time
            break;
          }
        }
      };

      // Handle visibility change - catch up on missed reminders when tab becomes visible
      const handleVisibility = () => {
        if (document.visibilityState === "visible") {
          const now = Date.now();
          if (now - lastVisibilityCheckRef.current > 5000) { // Only if tab was away for >5 seconds
            console.log("[FocusReminders] Tab became visible, checking for missed reminders");
            setTimeout(checkReminders, 100); // Small delay to ensure state is settled
          }
          lastVisibilityCheckRef.current = now;
        }
      };

      // Set up interval for regular checking
      reminderIntervalRef.current = setInterval(checkReminders, 1000);
      
      // Listen for visibility changes
      document.addEventListener("visibilitychange", handleVisibility);

      // Initial check
      checkReminders();

      return () => {
        if (reminderIntervalRef.current) {
          clearInterval(reminderIntervalRef.current);
          reminderIntervalRef.current = null;
        }
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    } else {
      // Clear interval when not running or in break
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
        reminderIntervalRef.current = null;
      }
    }
  }, [
    isRunning,
    isBreak,
    sessionConfig,
    showMomOverlay,
    sessionStartTimestampRef,
    getElapsedSeconds,
    onFocusReminder,
  ]);

  // Reset reminders when session stops
  useEffect(() => {
    if (!isRunning) {
      console.log("[FocusReminders] Session stopped, resetting reminders");
      triggeredRemindersRef.current = new Set();
      isProcessingReminderRef.current = false;
    }
  }, [isRunning]);

  const updateLastMomAudioTimestamp = () => {
    // No-op for this logic, but keep API the same
  };

  return {
    updateLastMomAudioTimestamp,
    resetReminderTiming,
  };
};
