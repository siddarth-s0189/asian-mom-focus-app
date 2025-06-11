
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAsianMomSpeech } from "@/hooks/useAsianMomSpeech";
import { useBreakSchedule } from "@/hooks/useBreakSchedule";
import { useFocusReminders } from "@/hooks/useFocusReminders";
import SessionTimer from "@/components/session/SessionTimer";
import SessionControls from "@/components/session/SessionControls";
import SessionProgress from "@/components/session/SessionProgress";
import StopConfirmationDialog from "@/components/session/StopConfirmationDialog";
import FocusReminderOverlay from "@/components/session/FocusReminderOverlay";
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
  duration: number;
  timeSpent: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const Session = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Session configuration
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isCountUp, setIsCountUp] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [breakNumber, setBreakNumber] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Real time tracking refs
  const sessionStartTimestampRef = useRef<number | null>(null);

  // --- Session Pause/Resume State ---
  const [sessionPauseTimestamp, setSessionPauseTimestamp] = useState<number | null>(null);
  const [totalSessionPausedDuration, setTotalSessionPausedDuration] = useState<number>(0);

  // --- Break Pause/Resume State ---
  const [breakElapsedBeforePause, setBreakElapsedBeforePause] = useState<number>(0);
  const [breakTimerStart, setBreakTimerStart] = useState<number | null>(null);
  const [breakPauseTimestamp, setBreakPauseTimestamp] = useState<number | null>(null);

  const [showMomOverlay, setShowMomOverlay] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // Add state to force re-renders during breaks
  const [breakRenderTick, setBreakRenderTick] = useState(0);

  // Add ref to block session end immediately after break transition
  const blockSessionEndOnce = useRef(false);
  const lastBreakTransitionTime = useRef<number>(0);

  const momSpeech = useAsianMomSpeech();
  const { getBreakSchedule } = useBreakSchedule();

  // Helper functions
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

  const getElapsedSeconds = () => {
    if (!sessionStartTimestampRef.current) return 0;
    
    if (!isRunning && sessionPauseTimestamp) {
      return Math.floor(
        (sessionPauseTimestamp - sessionStartTimestampRef.current - totalSessionPausedDuration) / 1000
      );
    }
    
    return Math.floor(
      (Date.now() - sessionStartTimestampRef.current - totalSessionPausedDuration) / 1000
    );
  };

  const toggleTimerMode = () => {
    setIsCountUp(prev => !prev);
  };

  // Init session config
  useEffect(() => {
    const config = localStorage.getItem("sessionConfig");
    if (config) {
      const parsedConfig: SessionConfig = JSON.parse(config);
      setSessionConfig(parsedConfig);
      const timeInSeconds = parsedConfig.duration * 60;
      setTotalTime(timeInSeconds);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  // --- FOCUS REMINDERS ---
  const { updateLastMomAudioTimestamp, resetReminderTiming } = useFocusReminders(
    isRunning,
    false,
    sessionConfig,
    showMomOverlay,
    0, // timeRemaining - not used with local logic
    totalTime,
    getBreakSchedule,
    handleFocusReminder,
    sessionStartTimestampRef,
    getElapsedSeconds
  );

  async function handleFocusReminder() {
    console.log("[FocusReminder] Triggered handleFocusReminder()");
    setShowMomOverlay(true);
    try {
      await momSpeech.playFocusReminder();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
    }
  }

  // --- BREAK SCHEDULE LOGIC ---
  const breakSchedule = sessionConfig ? getBreakSchedule(sessionConfig) : [];
  console.log("[BreakSchedule] Generated schedule:", breakSchedule);
  
  const timeElapsed = getElapsedSeconds();
  const currentBreak = breakSchedule.find(
    b =>
      timeElapsed >= b.startTime * 60 &&
      timeElapsed < (b.startTime + b.duration) * 60
  );
  const calculatedIsBreak = !!currentBreak;
  const breakDuration = currentBreak ? currentBreak.duration * 60 : undefined;
  const breakStartTime = currentBreak ? currentBreak.startTime * 60 : undefined;
  const breakElapsed = currentBreak && breakStartTime !== undefined
    ? timeElapsed - breakStartTime
    : undefined;

  console.log("[BreakDetection] timeElapsed:", timeElapsed, "currentBreak:", currentBreak, "calculatedIsBreak:", calculatedIsBreak);

  // --- On Break Enter/Exit, Reset Break Timer State ---
  useEffect(() => {
    console.log("[BreakState] calculatedIsBreak:", calculatedIsBreak, "currentBreak?.startTime:", currentBreak?.startTime);
    if (calculatedIsBreak) {
      console.log("[BreakState] Entered break. Reset break timer state.");
      setBreakElapsedBeforePause(0);
      setBreakTimerStart(Date.now());
      setBreakPauseTimestamp(null);
    } else {
      console.log("[BreakState] Exited break. Reset break timer state.");
      setBreakElapsedBeforePause(0);
      setBreakTimerStart(null);
      setBreakPauseTimestamp(null);
    }
    // eslint-disable-next-line
  }, [calculatedIsBreak, currentBreak?.startTime]);

  // --- Force re-renders during breaks for live timer updates ---
  useEffect(() => {
    if (calculatedIsBreak && isRunning) {
      const interval = setInterval(() => {
        setBreakRenderTick(tick => tick + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [calculatedIsBreak, isRunning]);

  // --- ASIAN MOM OVERLAY/AUDIO EFFECT ON BREAK START ---
  const wasBreak = useRef(false);
  useEffect(() => {
    console.log("[BreakEntryEffect] calculatedIsBreak changed to:", calculatedIsBreak, "sessionConfig:", sessionConfig);
    if (!sessionConfig) return;
    if (!wasBreak.current && calculatedIsBreak) {
      setShowMomOverlay(true);
      momSpeech.playBreakStart()
        .then(() => {
          updateLastMomAudioTimestamp();
        })
        .finally(() => setShowMomOverlay(false));
      console.log("[BreakEntryEffect] playBreakStart() called");
    }
    wasBreak.current = calculatedIsBreak;
  }, [calculatedIsBreak, sessionConfig]);

  // --- BREAK END OVERLAY/AUDIO EFFECT ---
  const prevCalculatedIsBreak = useRef(calculatedIsBreak);
  useEffect(() => {
    if (prevCalculatedIsBreak.current && !calculatedIsBreak) {
      console.log("[BreakEndTransitionEffect] Detected transition from break to work. Triggering break end overlay/audio.");
      
      blockSessionEndOnce.current = true;
      lastBreakTransitionTime.current = Date.now();
      
      setShowMomOverlay(true);
      (async () => {
        try {
          await momSpeech.playBreakEnd();
          updateLastMomAudioTimestamp();
        } catch (e) {
          console.error("[BreakEndTransitionEffect] Error in momSpeech.playBreakEnd", e);
        } finally {
          setShowMomOverlay(false);
          setTimeout(() => {
            handleBreakEnd();
          }, 350);
        }
      })();
    }
    prevCalculatedIsBreak.current = calculatedIsBreak;
  }, [calculatedIsBreak]);

  // --- SESSION END OVERLAY/AUDIO EFFECT ---
  useEffect(() => {
    console.log("[SessionEndEffect] calculatedIsBreak:", calculatedIsBreak, "sessionConfig:", sessionConfig);
    if (!sessionConfig) return;
    
    // Don't trigger session end if we just transitioned from break (within 2 seconds)
    const timeSinceBreakTransition = Date.now() - lastBreakTransitionTime.current;
    if (timeSinceBreakTransition < 2000) {
      console.log("[SessionEndEffect] Skipping session end - too soon after break transition");
      return;
    }
    
    // Check if the entire session duration has been reached
    const sessionDurationSeconds = sessionConfig.duration * 60;
    const sessionElapsed = getElapsedSeconds();
    
    if (sessionElapsed >= sessionDurationSeconds && !calculatedIsBreak) {
      console.log("[SessionEndEffect] Session duration complete, triggering session end");
      setShowMomOverlay(true);
      momSpeech.playSessionEnd()
        .then(() => {
          updateLastMomAudioTimestamp();
        })
        .finally(() => {
          setShowMomOverlay(false);
          handleSessionComplete();
        });
    }
  }, [timeElapsed, calculatedIsBreak, sessionConfig]);

  // --- HANDLE BREAK END ---
  const handleBreakEnd = () => {
    if (!sessionConfig) return;
    console.log("[handleBreakEnd] called. Transitioning from break to work.");
    
    setCurrentCycle(prev => prev + 1);
    resetReminderTiming();
    
    blockSessionEndOnce.current = true;
    setTimeout(() => {
      blockSessionEndOnce.current = false;
    }, 1000);
    
    console.log("[handleBreakEnd] Break ended, continuing session.");
  };

  // --- SESSION COMPLETE LOGIC ---
  const handleSessionComplete = async () => {
    console.log("[handleSessionComplete] called.");
    if (!sessionConfig) return;
    
    if (sessionStartTime && sessionConfig) {
      const sessionData = {
        id: generateSessionId(),
        userId: user?.id || "user-id",
        sessionTitle: sessionConfig.sessionTitle,
        goal: sessionConfig.goal,
        duration: sessionConfig.duration,
        timeSpent: getElapsedSeconds(),
        completed: true,
        startedAt: sessionStartTime.toISOString(),
        completedAt: new Date().toISOString()
      };
      saveSessionToStorage(sessionData);
    }
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  // --- SESSION CONTROLS ---
  const handleStart = async () => {
    if (showMomOverlay) return;
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionStart();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);

      if (!sessionStartTimestampRef.current) {
        sessionStartTimestampRef.current = Date.now();
        setSessionStartTime(new Date());
      } else if (sessionPauseTimestamp) {
        setTotalSessionPausedDuration(prev => prev + (Date.now() - sessionPauseTimestamp));
        setSessionPauseTimestamp(null);
      }

      if (breakPauseTimestamp) {
        setBreakTimerStart(Date.now());
        setBreakPauseTimestamp(null);
      }

      setIsRunning(true);
      resetReminderTiming();
    }
  };

  const handlePause = async () => {
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionPause();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
      setIsRunning(false);

      if (!sessionPauseTimestamp) setSessionPauseTimestamp(Date.now());

      if (calculatedIsBreak && breakTimerStart && !breakPauseTimestamp) {
        setBreakElapsedBeforePause(prev => prev + Math.ceil((Date.now() - breakTimerStart) / 1000));
        setBreakTimerStart(null);
        setBreakPauseTimestamp(Date.now());
      }
    }
  };

  const handleStopClick = () => {
    setShowStopConfirmation(true);
  };

  const handleStopConfirm = async () => {
    setShowStopConfirmation(false);
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionQuit();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
      navigate("/dashboard");
    }
  };

  const handleStopCancel = () => {
    setShowStopConfirmation(false);
  };

  if (!sessionConfig) return <div>Loading...</div>;

  // --- TIMER DISPLAY LOGIC ---
  const now = Date.now();

  function getDisplayTime() {
    const sessionStarted = sessionStartTimestampRef.current && sessionStartTimestampRef.current > 0;
    
    if (!sessionStarted) return isCountUp ? 0 : totalTime;

    const effectiveNow = isRunning ? now : (sessionPauseTimestamp ?? now);

    if (calculatedIsBreak && breakDuration !== undefined) {
      let liveElapsed = 0;
      if (breakTimerStart && isRunning) {
        liveElapsed = Math.ceil((now - breakTimerStart) / 1000);
      }
      const totalBreakElapsed = breakElapsedBeforePause + liveElapsed;
      if (isCountUp) {
        return Math.max(0, totalBreakElapsed);
      } else {
        return Math.max(0, breakDuration - totalBreakElapsed);
      }
    } else {
      const sessionElapsed = Math.floor(
        (effectiveNow - sessionStartTimestampRef.current - totalSessionPausedDuration) / 1000
      );
      if (isCountUp) {
        return Math.max(0, sessionElapsed);
      } else {
        return Math.max(0, totalTime - sessionElapsed);
      }
    }
  }

  // --- SESSION PROGRESS BAR LOGIC ---
  const getSessionProgress = () => {
    if (!sessionStartTimestampRef.current || !totalTime) return 0;
    const effectiveNow =
      isRunning && !sessionPauseTimestamp
        ? Date.now()
        : sessionPauseTimestamp ?? Date.now();
    const elapsed = Math.max(
      0,
      Math.floor(
        (effectiveNow - sessionStartTimestampRef.current - totalSessionPausedDuration) / 1000
      )
    );
    const progress = (elapsed / totalTime) * 100;
    return isNaN(progress) || !isFinite(progress) ? 0 : clamp(progress, 0, 100);
  };

  // --- BREAK PROGRESS BAR LOGIC ---
  const getBreakProgress = () => {
    if (!calculatedIsBreak || !breakDuration) return 0;
    let liveElapsed = 0;
    if (breakTimerStart && isRunning) {
      liveElapsed = Math.ceil((now - breakTimerStart) / 1000);
    }
    const totalBreakElapsed = breakElapsedBeforePause + liveElapsed;
    const progress = (totalBreakElapsed / breakDuration) * 100;
    return isNaN(progress) || !isFinite(progress) ? 0 : clamp(progress, 0, 100);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl mb-8">
            <SessionTimer
              sessionTitle={sessionConfig.sessionTitle}
              isBreak={calculatedIsBreak}
              breakNumber={breakNumber}
              isRunning={isRunning}
              showMomOverlay={showMomOverlay}
              getDisplayTime={getDisplayTime}
              isCountUp={isCountUp}
              toggleTimerMode={toggleTimerMode}
              showHeaderOnly={true}
              breakDuration={breakDuration}
              breakElapsed={breakElapsed}
            />
          </div>
          <div className="w-full max-w-5xl rounded-3xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 p-8 mb-8">
            <SessionTimer
              sessionTitle={sessionConfig.sessionTitle}
              isBreak={calculatedIsBreak}
              breakNumber={breakNumber}
              isRunning={isRunning}
              showMomOverlay={showMomOverlay}
              getDisplayTime={getDisplayTime}
              isCountUp={isCountUp}
              toggleTimerMode={toggleTimerMode}
              showTimerOnly={true}
              breakDuration={breakDuration}
              breakElapsed={breakElapsed}
            />
            <div className="flex justify-center mt-8">
              <SessionControls
                isRunning={isRunning}
                showMomOverlay={showMomOverlay}
                timeRemaining={getDisplayTime()}
                totalTime={totalTime}
                onStart={handleStart}
                onPause={handlePause}
                onStopClick={handleStopClick}
              />
            </div>
          </div>
          <div className="w-full max-w-5xl">
            <SessionProgress
              sessionConfig={sessionConfig}
              isBreak={calculatedIsBreak}
              getProgress={getSessionProgress}
              getBreakSchedule={getBreakSchedule}
            />
          </div>
        </div>
        <StopConfirmationDialog
          open={showStopConfirmation}
          onOpenChange={setShowStopConfirmation}
          onConfirm={handleStopConfirm}
          onCancel={handleStopCancel}
        />
        <FocusReminderOverlay showOverlay={showMomOverlay} momSpeech={momSpeech} />
      </div>
    </ProtectedRoute>
  );
};

export default Session;
