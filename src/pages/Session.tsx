
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAsianMomSpeech } from "@/hooks/useAsianMomSpeech";
import { Play, Pause, Square, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SessionConfig {
  sessionDuration: number;
  breakDuration: number;
  sessionGoal: string;
  sessionTitle: string;
  strictness: 'chill' | 'medium' | 'insane';
}

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const sessionConfig = location.state as SessionConfig;

  // If no session config, redirect to dashboard
  if (!sessionConfig) {
    navigate("/dashboard");
    return null;
  }

  const {
    playSessionStart,
    playSessionEnd,
    playBreakStart,
    playBreakEnd,
    playSessionPause,
    playSessionQuit,
    playFocusReminder,
    isPlaying,
    getCurrentText,
  } = useAsianMomSpeech();

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionConfig.sessionDuration * 60);
  const [totalTime, setTotalTime] = useState(sessionConfig.sessionDuration * 60);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus reminder scheduling based on strictness
  const scheduleNextReminder = () => {
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }

    // Don't schedule reminders during breaks or within 5 minutes of breaks
    if (isBreak) return;

    const currentTime = totalTime - timeLeft;
    const sessionDurationMs = sessionConfig.sessionDuration * 60 * 1000;
    const breakStartTime = sessionDurationMs;
    const timeTillBreak = breakStartTime - (currentTime * 1000);
    
    // Don't schedule if within 5 minutes of break
    if (timeTillBreak < 5 * 60 * 1000) return;

    let remindersPerHalfHour = 1;
    if (sessionConfig.strictness === 'medium') remindersPerHalfHour = 2;
    if (sessionConfig.strictness === 'insane') remindersPerHalfHour = 3;

    const baseInterval = (30 * 60 * 1000) / remindersPerHalfHour; // 30 minutes divided by number of reminders
    const randomOffset = (Math.random() - 0.5) * 4 * 60 * 1000; // ±2 minutes in milliseconds
    const nextReminderTime = baseInterval + randomOffset;

    reminderTimeoutRef.current = setTimeout(() => {
      if (isRunning && !isPaused && !isBreak) {
        playFocusReminder();
        scheduleNextReminder();
      }
    }, nextReminderTime);
  };

  const startTimer = async () => {
    setIsRunning(true);
    setIsPaused(false);
    await playSessionStart();
    scheduleNextReminder();
  };

  const pauseTimer = async () => {
    setIsPaused(true);
    await playSessionPause();
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
  };

  const resumeTimer = () => {
    setIsPaused(false);
    scheduleNextReminder();
  };

  const stopTimer = () => {
    setShowStopDialog(true);
  };

  const confirmStop = async () => {
    setIsRunning(false);
    setIsPaused(false);
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
    await playSessionQuit();
    setShowStopDialog(false);
    navigate("/dashboard");
  };

  const cancelStop = () => {
    setShowStopDialog(false);
  };

  const startBreak = async () => {
    setIsBreak(true);
    setTimeLeft(sessionConfig.breakDuration * 60);
    setTotalTime(sessionConfig.breakDuration * 60);
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
    await playBreakStart();
  };

  const endBreak = async () => {
    setIsBreak(false);
    setTimeLeft(sessionConfig.sessionDuration * 60);
    setTotalTime(sessionConfig.sessionDuration * 60);
    await playBreakEnd();
    scheduleNextReminder();
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (isBreak) {
              endBreak();
              return sessionConfig.sessionDuration * 60;
            } else {
              startBreak();
              return sessionConfig.breakDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, isBreak]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Session Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{sessionConfig.sessionTitle}</h1>
          <p className="text-gray-400">
            {isBreak ? "Break Time" : "Focus Session"} • {sessionConfig.strictness} mode
          </p>
        </div>

        {/* Timer Display */}
        <Card className="bg-gray-900/50 border-gray-800 p-8 text-center mb-6">
          <div className="text-6xl font-mono font-bold mb-4 text-red-500">
            {formatTime(timeLeft)}
          </div>
          <Progress
            value={progressPercentage}
            className="w-full h-2 mb-4"
          />
          <p className="text-gray-400">
            {isBreak ? `Break: ${sessionConfig.breakDuration} min` : `Session: ${sessionConfig.sessionDuration} min`}
          </p>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <Button
              onClick={startTimer}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              <Button
                onClick={isPaused ? resumeTimer : pauseTimer}
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3"
              >
                {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                onClick={stopTimer}
                size="lg"
                variant="destructive"
                className="px-8 py-3"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Session Goal */}
        <Card className="bg-gray-900/50 border-gray-800 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Coffee className="w-5 h-5 mr-2 text-red-500" />
            Session Goal
          </h3>
          <p className="text-gray-300">{sessionConfig.sessionGoal}</p>
        </Card>

        {/* Asian Mom Speech Overlay */}
        {isPlaying && (
          <Card className="bg-red-900/20 border-red-800 p-4 mb-6">
            <p className="text-red-300 text-center italic">
              "{getCurrentText()}"
            </p>
          </Card>
        )}
      </div>

      {/* Stop Confirmation Dialog */}
      <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500">Stop Session?</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to stop this session? Your progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={cancelStop}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Go back to session
            </Button>
            <Button
              variant="destructive"
              onClick={confirmStop}
            >
              Yes, stop session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Session;
