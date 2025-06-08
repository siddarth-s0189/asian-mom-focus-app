import React, { useState } from "react";
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

const Session = () => {
  const [showMomOverlay, setShowMomOverlay] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  const momSpeech = useAsianMomSpeech();
  const { getBreakSchedule } = useBreakSchedule();

  const {
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
    sessionStartTime,
    totalTimeSpent,
    getPomodoroFormat,
    saveSessionToStorage,
    generateSessionId,
    getDisplayTime,
    getProgress,
    toggleTimerMode,
    handleStart: originalHandleStart,
    handlePause: originalHandlePause,
    handleStopConfirm,
    setTimeRemaining,
    setTotalTime,
    setIsRunning
  } = useSessionLogic();

  const { updateLastMomAudioTimestamp, resetReminderTiming } = useFocusReminders(
    isRunning,
    isBreak,
    sessionConfig,
    showMomOverlay,
    timeRemaining,
    totalTime,
    getBreakSchedule,
    handleFocusReminder
  );

  async function handleFocusReminder() {
    setShowMomOverlay(true);
    try {
      await momSpeech.playFocusReminder();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
    }
  }

  const handleSessionComplete = async () => {
    if (isBreak) {
      setIsBreak(false);
      const format = getPomodoroFormat(sessionConfig!.duration);
      const workTime = format.work * 60;
      setTimeRemaining(workTime);
      setTotalTime(workTime);
      setCurrentCycle(prev => prev + 1);
      resetReminderTiming();

      setShowMomOverlay(true);
      try {
        await momSpeech.playBreakEnd();
        updateLastMomAudioTimestamp();
      } finally {
        setShowMomOverlay(false);
      }
    } else {
      const timeElapsed = (sessionConfig!.duration * 60) - timeRemaining;
      const breakSchedule = getBreakSchedule(sessionConfig!);
      const nextBreak = breakSchedule.find(b => Math.abs((b.startTime * 60) - timeElapsed) < 30);

      if (nextBreak && sessionConfig?.breaks) {
        setIsBreak(true);
        setBreakNumber(nextBreak.number);
        const breakTime = nextBreak.duration * 60;
        setTimeRemaining(breakTime);
        setTotalTime(breakTime);

        setShowMomOverlay(true);
        try {
          await momSpeech.playBreakStart();
          updateLastMomAudioTimestamp();
        } finally {
          setShowMomOverlay(false);
        }
      } else {
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

        setShowMomOverlay(true);
        try {
          await momSpeech.playSessionEnd();
          updateLastMomAudioTimestamp();
        } finally {
          setShowMomOverlay(false);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 500);
        }
      }
    }
  };

  React.useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
  }, [timeRemaining, isRunning]);

  const handleStart = async () => {
    if (showMomOverlay) return;
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionStart();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
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

  if (!sessionConfig) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />

        <div className="flex flex-col items-center justify-center px-4 py-8">
          {/* Header Section - Outside grey card */}
          <div className="w-full max-w-5xl mb-8">
            <SessionTimer
              sessionTitle={sessionConfig.sessionTitle}
              isBreak={isBreak}
              breakNumber={breakNumber}
              isRunning={isRunning}
              showMomOverlay={showMomOverlay}
              getDisplayTime={getDisplayTime}
              isCountUp={isCountUp}
              toggleTimerMode={toggleTimerMode}
              showHeaderOnly={true}
            />
          </div>

          {/* Timer and Controls Card */}
          <div className="w-full max-w-5xl rounded-3xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 p-8 mb-8">
            <SessionTimer
              sessionTitle={sessionConfig.sessionTitle}
              isBreak={isBreak}
              breakNumber={breakNumber}
              isRunning={isRunning}
              showMomOverlay={showMomOverlay}
              getDisplayTime={getDisplayTime}
              isCountUp={isCountUp}
              toggleTimerMode={toggleTimerMode}
              showTimerOnly={true}
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

          {/* Progress Card - same width as above */}
          <div className="w-full max-w-5xl">
            <SessionProgress
              sessionConfig={sessionConfig}
              isBreak={isBreak}
              getProgress={getProgress}
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

        <FocusReminderOverlay showOverlay={showMomOverlay} momSpeech={momSpeech} />
      </div>
    </ProtectedRoute>
  );
};

export default Session;
