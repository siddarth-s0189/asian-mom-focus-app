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
  // 25/5 split is < 120 minutes, 50/10 is 120 or more
  return sessionMinutes < 120 ? "25-5" : "50-10";
}

function getReminderSchedule(
  sessionMinutes: number,
  strictness: number
): number[] {
  const strictnessKey = getStrictnessKey(strictness);
  const splitKey = getSplitKey(sessionMinutes);

  const scheduleMinutes = SCHEDULES[strictnessKey][splitKey];
  // Only keep reminders within session duration
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

  // Recompute schedule whenever config/session changes
  useEffect(() => {
    if (!sessionConfig) return;
    const schedule = getReminderSchedule(sessionConfig.duration, sessionConfig.strictness);
    scheduledRemindersRef.current = schedule;
    triggeredRemindersRef.current = new Set();
  }, [sessionConfig]);

  // Expose to parent: forcibly reset reminders
  const resetReminderTiming = () => {
    triggeredRemindersRef.current = new Set();
  };
  const updateLastMomAudioTimestamp = () => {
    // No-op for this logic, but keep API the same
  };

  useEffect(() => {
    if (
      isRunning &&
      sessionConfig &&
      !isBreak &&
      !showMomOverlay &&
      sessionStartTimestampRef.current
    ) {
      // Helper: fire ALL overdue untriggered reminders on each tick
      const checkReminders = () => {
        const elapsed = getElapsedSeconds();
        for (const reminderTime of scheduledRemindersRef.current) {
          if (
            !triggeredRemindersRef.current.has(reminderTime) &&
            elapsed >= reminderTime
          ) {
            triggeredRemindersRef.current.add(reminderTime);
            onFocusReminder();
          }
        }
      };

      // Fire checkReminders every second
      reminderIntervalRef.current = setInterval(checkReminders, 1000);

      // Also fire checkReminders when tab becomes visible (to catch up on missed reminders)
      const handleVisibility = () => {
        if (document.visibilityState === "visible") {
          checkReminders();
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);

      // Fire once immediately, in case user starts mid-session
      checkReminders();

      return () => {
        if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
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

  useEffect(() => {
    if (!isRunning) {
      triggeredRemindersRef.current = new Set();
    }
  }, [isRunning]);

  return {
    updateLastMomAudioTimestamp,
    resetReminderTiming,
  };
};