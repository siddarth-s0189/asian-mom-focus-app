interface SessionConfig {
  sessionTitle: string;
  goal: string;
  duration: number;
  breaks: boolean;
  workplace: string;
  strictness: number;
}

export const useBreakSchedule = () => {
  // Calculate Pomodoro format based on session duration
  // --- CHANGED THIS LINE ---
  const getPomodoroFormat = (durationMinutes: number) => {
    return durationMinutes < 120 ? { work: 25, break: 5 } : { work: 50, break: 10 };
  };

  // Calculate break schedule for the session
  const getBreakSchedule = (sessionConfig: SessionConfig) => {
    if (!sessionConfig.breaks || sessionConfig.duration < 60) return [];

    const format = getPomodoroFormat(sessionConfig.duration);
    const cycleLength = format.work + format.break;
    const totalMinutes = sessionConfig.duration;
    const fullCycles = Math.floor(totalMinutes / cycleLength);

    const schedule = [];
    for (let i = 0; i < fullCycles; i++) {
      // Don't add the last break if it would be at the very end
      const breakStartTime = (i + 1) * format.work + i * format.break;
      if (breakStartTime + format.break < totalMinutes) {
        schedule.push({
          startTime: breakStartTime,
          duration: format.break,
          number: i + 1
        });
      }
    }

    return schedule;
  };

  return {
    getPomodoroFormat,
    getBreakSchedule
  };
};