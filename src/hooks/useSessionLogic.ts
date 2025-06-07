
import { useState, useEffect, useRef } from "react";
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

  // Calculate Pomodoro format based on session duration
  const getPomodoroFormat = (durationMinutes: number) => {
    return durationMinutes < 120 ? { work: 25, break: 5 } : { work: 50, break: 10 };
  };

  // Save session data to localStorage
  const saveSessionToStorage = (sessionData: SessionData) => {
    const existingSessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
    const updatedSessions = [...existingSessions, sessionData];
    localStorage.setItem('userSessions', JSON.stringify(updatedSessions));
  };

  // Generate unique session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize session from localStorage
  useEffect(() => {
    const config = localStorage.getItem("sessionConfig");
    if (config) {
      const parsedConfig: SessionConfig = JSON.parse(config);
      setSessionConfig(parsedConfig);
      const timeInSeconds = parsedConfig.duration * 60;
      setTimeRemaining(timeInSeconds);
      setTotalTime(timeInSeconds);
      
      // Calculate total cycles for progress tracking
      const format = getPomodoroFormat(parsedConfig.duration);
      const cycles = Math.ceil(parsedConfig.duration / (format.work + format.break));
      setTotalCycles(cycles);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Main timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
        
        // Update total time spent
        setTotalTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

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

  const getDisplayTime = () => {
    if (isCountUp) {
      return formatTime(totalTime - timeRemaining);
    }
    return formatTime(timeRemaining);
  };

  const getProgress = () => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const toggleTimerMode = () => {
    setIsCountUp(!isCountUp);
  };

  const handleStart = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStopConfirm = () => {
    setIsRunning(false);
    
    // Save session as incomplete but count time spent
    if (sessionStartTime && user && sessionConfig) {
      const sessionData: SessionData = {
        id: generateSessionId(),
        userId: user.id,
        sessionTitle: sessionConfig.sessionTitle,
        goal: sessionConfig.goal,
        duration: sessionConfig.duration,
        timeSpent: totalTimeSpent,
        completed: false,
        startedAt: sessionStartTime.toISOString(),
        completedAt: new Date().toISOString()
      };
      saveSessionToStorage(sessionData);
    }
    
    navigate("/dashboard");
  };

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
    setIsRunning
  };
};
