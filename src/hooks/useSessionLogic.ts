import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SessionConfig {
  sessionTitle: string;
  goal: string;
  duration: number;
  breaks: boolean;
  workplace: string;
  strictness: number;
}

interface SessionData {
  id: string;
  userId: string;
  sessionTitle: string;
  goal: string;
  duration: number; // in minutes
  timeSpent: number; // in seconds
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export const useSessionLogic = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [breakNumber, setBreakNumber] = useState(0);
  const [isCountUp, setIsCountUp] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Real time tracking refs
  const sessionStartTimestampRef = useRef<number | null>(null);
  const pausedTimestampRef = useRef<number | null>(null);
  const accumulatedPausedTimeRef = useRef<number>(0);

  // --- CHANGED THIS LINE ---
  const getPomodoroFormat = (durationMinutes: number) => {
    return durationMinutes < 120 ? { work: 2, break: 5 } : { work: 50, break: 10 };
  };

  const saveSessionToStorage = (sessionData: SessionData) => {
    const existingSessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
    const updatedSessions = [...existingSessions, sessionData];
    localStorage.setItem('userSessions', JSON.stringify(updatedSessions));
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Init session config, totalTime, etc.
  useEffect(() => {
    const config = localStorage.getItem("sessionConfig");
    if (config) {
      const parsedConfig: SessionConfig = JSON.parse(config);
      setSessionConfig(parsedConfig);
      const timeInSeconds = parsedConfig.duration * 60;
      setTimeRemaining(timeInSeconds);
      setTotalTime(timeInSeconds);

      const format = getPomodoroFormat(parsedConfig.duration);
      const cycles = Math.ceil(parsedConfig.duration / (format.work + format.break));
      setTotalCycles(cycles);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const getElapsedSeconds = useCallback(() => {
    if (!isRunning && pausedTimestampRef.current && sessionStartTimestampRef.current) {
      return Math.floor(
        (pausedTimestampRef.current - sessionStartTimestampRef.current - accumulatedPausedTimeRef.current) / 1000
      );
    }
    if (sessionStartTimestampRef.current) {
      return Math.floor(
        (Date.now() - sessionStartTimestampRef.current - accumulatedPausedTimeRef.current) / 1000
      );
    }
    return 0;
  }, [isRunning]);

  // Main timer effect (real time based)
  useEffect(() => {
    if (!isRunning) return;
    let frameId: number;
    const tick = () => {
      if (!sessionStartTimestampRef.current) return;
      const elapsed = getElapsedSeconds();
      const newTimeRemaining = Math.max(totalTime - elapsed, 0);
      setTimeRemaining(newTimeRemaining);
      setTotalTimeSpent(elapsed);
      if (newTimeRemaining <= 0) {
        setIsRunning(false);
        setTimeRemaining(0);
      } else {
        frameId = window.setTimeout(tick, 200);
      }
    };
    tick();
    return () => {
      if (frameId) clearTimeout(frameId);
    };
    // eslint-disable-next-line
  }, [isRunning, totalTime, sessionStartTimestampRef.current, accumulatedPausedTimeRef.current]);

  // Controls
  const handleStart = useCallback(() => {
    if (!isRunning) {
      if (!sessionStartTimestampRef.current) {
        sessionStartTimestampRef.current = Date.now();
        setSessionStartTime(new Date());
      } else if (pausedTimestampRef.current) {
        const pauseDuration = Date.now() - pausedTimestampRef.current;
        accumulatedPausedTimeRef.current += pauseDuration;
        pausedTimestampRef.current = null;
      }
      setIsRunning(true);
    }
  }, [isRunning]);

  const handlePause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      pausedTimestampRef.current = Date.now();
    }
  }, [isRunning]);

  const handleStopConfirm = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(totalTime);
    setTotalTimeSpent(0);
    setIsBreak(false);
    setBreakNumber(0);
    setCurrentCycle(0);
    setSessionStartTime(null);
    sessionStartTimestampRef.current = null;
    pausedTimestampRef.current = null;
    accumulatedPausedTimeRef.current = 0;
    navigate("/dashboard");
  }, [totalTime, navigate]);

  const toggleTimerMode = useCallback(() => {
    setIsCountUp((prev) => !prev);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getDisplayTime = useCallback(() => {
    if (isCountUp) {
      return formatTime(totalTimeSpent);
    }
    return formatTime(timeRemaining);
  }, [isCountUp, totalTimeSpent, timeRemaining]);

  const getProgress = useCallback(() => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  }, [totalTime, timeRemaining]);

  return {
    sessionConfig,
    isRunning,
    timeRemaining,
    totalTime,
    isBreak,
    setIsBreak,
    breakNumber,
    setBreakNumber,
    isCountUp,
    currentCycle,
    setCurrentCycle,
    totalCycles,
    sessionStartTime,
    totalTimeSpent,
    getPomodoroFormat,
    saveSessionToStorage,
    generateSessionId,
    getDisplayTime,
    getProgress,
    toggleTimerMode,
    handleStart,
    handlePause,
    handleStopConfirm,
    setTimeRemaining,
    setTotalTime,
    setIsRunning,
    sessionStartTimestampRef,
    getElapsedSeconds
  };
};