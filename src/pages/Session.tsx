import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAsianMomSpeech } from "@/hooks/useAsianMomSpeech";
import { useSessionLogic } from "@/hooks/useSessionLogic";
import { useBreakSchedule } from "@/hooks/useBreakSchedule";
import { useFocusReminders } from "@/hooks/useFocusReminders";
import SessionTimer from "@/components/session/SessionTimer";
import SessionControls from "@/components/session/SessionControls";
import SessionProgress from "@/components/session/SessionProgress";
import StopConfirmationDialog from "@/components/session/StopConfirmationDialog";
import FocusReminderOverlay from "@/components/session/FocusReminderOverlay";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const Session = () => {
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

  const {
    sessionConfig,
    isRunning,
    timeRemaining,
    totalTime,
    setIsBreak,
    breakNumber,
    setBreakNumber,
    isCountUp,
    currentCycle,
    setCurrentCycle,
    sessionStartTime,
    totalTimeSpent,
    getPomodoroFormat,
    saveSessionToStorage,
    generateSessionId,
    toggleTimerMode,
    handleStart: originalHandleStart,
    handlePause: originalHandlePause,
    handleStopConfirm,
    setTimeRemaining,
    setTotalTime,
    setIsRunning,
    sessionStartTimestampRef,
    getElapsedSeconds
  } = useSessionLogic();

  // --- FOCUS REMINDERS ---
  const { updateLastMomAudioTimestamp, resetReminderTiming } = useFocusReminders(
    isRunning,
    false,
    sessionConfig,
    showMomOverlay,
    timeRemaining,
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
  
  const timeElapsed = getElapsedSeconds ? getElapsedSeconds() : 0;
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

  // --- BREAK END OVERLAY/AUDIO EFFECT (NEW: detects transition from break to not break) ---
  const prevCalculatedIsBreak = useRef(calculatedIsBreak);
  useEffect(() => {
    // If previously in a break and now not in a break, fire break end overlay/audio
    if (prevCalculatedIsBreak.current && !calculatedIsBreak) {
      console.log("[BreakEndTransitionEffect] Detected transition from break to work. Triggering break end overlay/audio.");
      console.log("[BreakEndTransitionEffect] About to block session-end for next tick and run handleBreakEnd.");
      
      // Block session end for the immediate next timer evaluation
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
    console.log("[SessionEndEffect] timeRemaining:", timeRemaining, "calculatedIsBreak:", calculatedIsBreak, "sessionConfig:", sessionConfig);
    if (!sessionConfig) return;
    
    // Don't trigger session end if we just transitioned from break (within 2 seconds)
    const timeSinceBreakTransition = Date.now() - lastBreakTransitionTime.current;
    if (timeSinceBreakTransition < 2000) {
      console.log("[SessionEndEffect] Skipping session end - too soon after break transition");
      return;
    }
    
    if (timeRemaining === 0 && !calculatedIsBreak) {
      setShowMomOverlay(true);
      momSpeech.playSessionEnd()
        .then(() => {
          updateLastMomAudioTimestamp();
        })
        .finally(() => setShowMomOverlay(false));
      console.log("[SessionEndEffect] playSessionEnd() called");
    }
  }, [timeRemaining, calculatedIsBreak, sessionConfig]);

  // --- HANDLE BREAK END (only called after break end overlay/audio) ---
  const handleBreakEnd = () => {
    if (!sessionConfig) return;
    console.log("[handleBreakEnd] called. Transitioning from break to work.");
    
    const format = getPomodoroFormat(sessionConfig.duration);
    const workTime = format.work * 60;
    
    // Reset timer state for new work period
    setTimeRemaining(workTime);
    setTotalTime(workTime);
    setCurrentCycle(prev => prev + 1);
    resetReminderTiming();
    
    // Block session end logic for a brief moment to prevent immediate triggering
    blockSessionEndOnce.current = true;
    setTimeout(() => {
      blockSessionEndOnce.current = false;
    }, 1000);
    
    console.log("[handleBreakEnd] Set work time to", workTime, "and resumed timer.");
  };

  // --- SESSION COMPLETE LOGIC ---
  const handleSessionComplete = async () => {
    console.log("[handleSessionComplete] called. calculatedIsBreak:", calculatedIsBreak);
    if (!sessionConfig) return;
    
    // Check if there's a next break coming up
    const breakSchedule = getBreakSchedule(sessionConfig);
    const elapsed = getElapsedSeconds();
    const nextBreak = breakSchedule.find(
      b => Math.abs((b.startTime * 60) - elapsed) < 30
    );
    
    if (nextBreak && sessionConfig.breaks) {
      console.log("[handleSessionComplete] Next break found, transitioning to break");
      setBreakNumber(nextBreak.number);
      const breakTime = nextBreak.duration * 60;
      setTimeRemaining(breakTime);
      setTotalTime(breakTime);
    } else {
      console.log("[handleSessionComplete] No more breaks, ending session");
      if (sessionStartTime && sessionConfig) {
        const sessionData = {
          id: generateSessionId(),
          userId: "user-id",
          sessionTitle: sessionConfig.sessionTitle,
          goal: sessionConfig.goal,
          duration: sessionConfig.duration,
          timeSpent: totalTimeSpent,
          completed: true,
          startedAt: sessionStartTime.toISOString(),
          completedAt: new Date().toISOString()
        };
        saveSessionToStorage(sessionData);
      }
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }
  };

  // --- TIMER EFFECT: END OF WORK ONLY ---
  useEffect(() => {
    // Declare sessionStarted at the beginning of the effect
    const sessionStarted = sessionStartTimestampRef.current && sessionStartTimestampRef.current > 0;

    console.log("[TimerEffect] RUNNING. isRunning:", isRunning, "calculatedIsBreak:", calculatedIsBreak, 
      "sessionStarted:", sessionStarted, "getDisplayTime():", getDisplayTime(), 
      "blockSessionEndOnce.current:", blockSessionEndOnce.current
    );

    // Work timer end logic only (break end handled by BreakEndTransitionEffect)
    if (!calculatedIsBreak) {
      if (sessionStarted && getDisplayTime() === 0 && isRunning && !blockSessionEndOnce.current) {
        console.log("[TimerEffect] Work timer end condition met. Firing session complete.");
        setIsRunning(false);
        handleSessionComplete();
      } else if (blockSessionEndOnce.current) {
        console.log("[TimerEffect] Blocked session end logic for this tick after break end.");
      }
    }
    // eslint-disable-next-line
  }, [
    isRunning,
    calculatedIsBreak,
    breakTimerStart,
    breakElapsedBeforePause,
    breakDuration,
    breakPauseTimestamp,
    sessionStartTimestampRef.current,
    totalSessionPausedDuration,
    breakRenderTick // This ensures re-evaluation during breaks
  ]);

  // --- SESSION CONTROLS (START/PAUSE/STOP) ---
  const handleStart = async () => {
    if (showMomOverlay) return;
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionStart();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);

      // Session resume
      if (sessionPauseTimestamp) {
        setTotalSessionPausedDuration(prev => prev + (Date.now() - sessionPauseTimestamp));
        setSessionPauseTimestamp(null);
      }
      // Break resume (if was paused)
      if (breakPauseTimestamp) {
        setBreakTimerStart(Date.now());
        setBreakPauseTimestamp(null);
      }

      originalHandleStart();
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
      originalHandlePause();

      // Session pause
      if (!sessionPauseTimestamp) setSessionPauseTimestamp(Date.now());

      // Break pause (add elapsed up to now, null timer, set pause timestamp)
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

  const handleStopConfirmAction = async () => {
    setShowStopConfirmation(false);
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionQuit();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
      handleStopConfirm();
    }
  };

  const handleStopCancel = () => {
    setShowStopConfirmation(false);
  };

  if (!sessionConfig) return <div>Loading...</div>;

  // --- TIMER DISPLAY LOGIC ---
  const now = Date.now();

  function getDisplayTime() {
    // Declare sessionStarted at the beginning of the function
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

  // Overlay render debug
  const DebugFocusReminderOverlay = (props: any) => {
    console.log("[FocusReminderOverlay] rendered. showOverlay:", props.showOverlay);
    return <FocusReminderOverlay {...props} />;
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
                timeRemaining={timeRemaining}
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
          onConfirm={handleStopConfirmAction}
          onCancel={handleStopCancel}
        />
        <DebugFocusReminderOverlay showOverlay={showMomOverlay} momSpeech={momSpeech} />
      </div>
    </ProtectedRoute>
  );
};

export default Session;
