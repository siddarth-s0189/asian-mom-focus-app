import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Coffee, ArrowUp, ArrowDown, X, Triangle, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAsianMomSpeech } from "@/hooks/useAsianMomSpeech";

interface SessionConfig {
  sessionTitle: string;
  goal: string;
  duration: number;
  breaks: boolean;
  workplace: string;
  strictness: number;
}

const FOCUS_REMINDER_MIN_INTERVAL = 10 * 60 * 1000; // 10 minutes
const BREAK_BUFFER_TIME = 5 * 60; // 5 minutes in seconds

const Session = () => {
  const navigate = useNavigate();
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [breakNumber, setBreakNumber] = useState(0);
  const [isCountUp, setIsCountUp] = useState(false);
  const [showMomOverlay, setShowMomOverlay] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMomAudioTimestampRef = useRef<number>(Date.now());
  const nextReminderTimeRef = useRef<number>(0);

  const momSpeech = useAsianMomSpeech();

  useEffect(() => {
    const config = localStorage.getItem("sessionConfig");
    if (config) {
      const parsedConfig: SessionConfig = JSON.parse(config);
      setSessionConfig(parsedConfig);
      const timeInSeconds = parsedConfig.duration * 60;
      setTimeRemaining(timeInSeconds);
      setTotalTime(timeInSeconds);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Get reminder frequency based on strictness
  const getReminderFrequency = (strictness: number) => {
    switch (strictness) {
      case 1: // chill
        return 1;
      case 2: // medium
        return 2;
      case 3: // insane
        return 3;
      default:
        return 2;
    }
  };

  // Calculate next reminder time with randomization
  const calculateNextReminderTime = (strictness: number, currentTime: number) => {
    const frequency = getReminderFrequency(strictness);
    const baseInterval = (30 * 60) / frequency; // 30 minutes divided by frequency
    const randomOffset = (Math.random() - 0.5) * 4 * 60; // +/- 2 minutes in seconds
    return currentTime + baseInterval + randomOffset;
  };

  // Check if we're near a break
  const isNearBreak = () => {
    if (!sessionConfig?.breaks || isBreak) return false;
    
    const timeElapsed = totalTime - timeRemaining;
    const sessionHours = Math.floor(sessionConfig.duration / 60);
    
    for (let i = 1; i <= sessionHours; i++) {
      const breakTime = i * 60 * 60; // Break every hour
      const timeTillBreak = breakTime - timeElapsed;
      
      if (Math.abs(timeTillBreak) <= BREAK_BUFFER_TIME) {
        return true;
      }
    }
    return false;
  };

  // Focus reminder logic with improved timing and break avoidance
  useEffect(() => {
    if (isRunning && !isBreak && sessionConfig && !showMomOverlay) {
      const checkReminder = () => {
        const currentTime = Date.now() / 1000; // Convert to seconds
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
          handleFocusReminder();
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

  const handleFocusReminder = async () => {
    setShowMomOverlay(true);
    try {
      await momSpeech.playFocusReminder();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
    }
  };

  const handleSessionComplete = async () => {
    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);

    if (isBreak) {
      // Break completed, return to work
      setIsBreak(false);
      const workTime = sessionConfig!.duration * 60;
      setTimeRemaining(workTime);
      setTotalTime(workTime);
      nextReminderTimeRef.current = 0; // Reset reminder timing

      setShowMomOverlay(true);
      try {
        await momSpeech.playBreakEnd();
        updateLastMomAudioTimestamp();
      } finally {
        setShowMomOverlay(false);
      }
    } else {
      if (sessionConfig?.breaks && sessionConfig.duration >= 60) {
        // Start break
        setIsBreak(true);
        setBreakNumber((prev) => prev + 1);
        const breakTime = 10 * 60;
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
        setShowMomOverlay(true);
        try {
          await momSpeech.playSessionEnd();
          updateLastMomAudioTimestamp();
        } finally {
          setShowMomOverlay(false);
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        }
      }
    }
  };

  const handleStart = async () => {
    if (showMomOverlay) return;
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionStart();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
      setIsRunning(true);
      // Initialize reminder timing
      nextReminderTimeRef.current = 0;
    }
  };

  const handlePause = async () => {
    setIsRunning(false);
    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
    setShowMomOverlay(true);
    try {
      await momSpeech.playSessionPause();
      updateLastMomAudioTimestamp();
    } finally {
      setShowMomOverlay(false);
    }
  };

  const handleStopClick = () => {
    setShowStopConfirmation(true);
  };

  const handleStopConfirm = async () => {
    setShowStopConfirmation(false);
    setIsRunning(false);
    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
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

  const toggleTimerMode = () => {
    setIsCountUp(!isCountUp);
  };

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

  const getMilestones = () => {
    const milestones = [
      {
        label: "Start",
        position: 0,
        passed: getProgress() > 0,
        icon: X,
        color: "text-green-400",
      },
    ];

    if (sessionConfig?.breaks && !isBreak) {
      const sessionHours = Math.floor(sessionConfig.duration / 60);
      for (let i = 1; i <= sessionHours; i++) {
        const position = (i * 60 * 60) / totalTime * 100;
        milestones.push({
          label: `Break ${i}`,
          position,
          passed: getProgress() >= position,
          icon: i % 2 === 1 ? Triangle : Circle,
          color: getProgress() >= position
            ? "text-blue-400"
            : "text-gray-500",
        });
      }
    }

    milestones.push({
      label: "End",
      position: 100,
      passed: getProgress() >= 100,
      icon: Square,
      color: getProgress() >= 100 ? "text-red-400" : "text-gray-500",
    });

    return milestones;
  };

  if (!sessionConfig) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 p-1 shadow-xl shadow-pink-500/30">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="text-2xl">👩‍🦳</div>
                    </div>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center ${
                      isRunning || showMomOverlay
                        ? "bg-green-500 animate-pulse"
                        : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRunning || showMomOverlay
                          ? "bg-white"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {sessionConfig.sessionTitle}
                  </h1>
                  <div className="flex items-center mt-1">
                    {isBreak ? (
                      <>
                        <Coffee className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-green-400 font-medium">
                          Break Time #{breakNumber}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <span className="text-white font-medium">
                          Focus Session
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={toggleTimerMode}
                variant="outline"
                className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 rounded-xl px-4 py-2"
              >
                {isCountUp ? (
                  <>
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Countdown
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Count Up
                  </>
                )}
              </Button>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center mb-8">
              <div className="mb-8">
                <div className="text-7xl lg:text-8xl font-mono font-bold text-white mb-2">
                  {getDisplayTime()}
                </div>
                <div className="text-gray-400 text-lg">
                  {isCountUp ? "Time Elapsed" : "Time Remaining"}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    disabled={showMomOverlay}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl shadow-red-500/30 disabled:opacity-50"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {timeRemaining === totalTime ? "Start" : "Resume"}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 px-8 py-4 text-lg rounded-xl"
                  >
                    <Pause className="w-6 h-6 mr-2" />
                    Pause
                  </Button>
                )}

                <Button
                  onClick={handleStopClick}
                  variant="outline"
                  className="border-red-600/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:border-red-500 px-8 py-4 text-lg rounded-xl"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop
                </Button>
              </div>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">
                  {isBreak ? "Break Progress" : "Session Progress"}
                </h3>
                <div className="text-3xl font-bold text-red-400">
                  {Math.round(getProgress())}%
                </div>
              </div>

              <div className="relative mb-12">
                <Progress value={getProgress()} className="h-8 rounded-full" />
                <div className="absolute top-0 left-0 right-0 h-8 flex items-center">
                  {getMilestones().map((milestone, index) => {
                    const IconComponent = milestone.icon;
                    return (
                      <div
                        key={index}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: `${milestone.position}%`,
                          transform: "translateX(-50%)",
                          zIndex: 10,
                        }}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-4 border-gray-900 flex items-center justify-center ${
                            milestone.passed
                              ? "bg-gray-800 shadow-lg shadow-red-500/30"
                              : "bg-gray-700"
                          }`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${milestone.color}`}
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative mt-4">
                <div className="flex justify-between items-center">
                  {getMilestones().map((milestone, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                      style={{
                        width: `${100 / getMilestones().length}%`,
                      }}
                    >
                      <div
                        className={`text-sm font-medium text-center ${
                          milestone.passed ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {milestone.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stop Confirmation Dialog */}
        <Dialog open={showStopConfirmation} onOpenChange={setShowStopConfirmation}>
          <DialogContent className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Are you sure you want to stop?
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <div className="text-6xl mb-4">👩‍🦳</div>
              <p className="text-gray-300">
                Your Asian mom will have something to say about this...
              </p>
            </div>
            <DialogFooter className="flex justify-center space-x-4">
              <Button
                onClick={handleStopCancel}
                variant="outline"
                className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70"
              >
                Go back to session
              </Button>
              <Button
                onClick={handleStopConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, stop session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Asian Mom Overlay */}
        {showMomOverlay && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 p-2 shadow-2xl shadow-pink-500/40 animate-pulse">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <div className="text-8xl">👩‍🦳</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-2xl mx-auto">
                <div className="text-2xl font-bold text-white mb-4 min-h-[3.5rem]">
                  {momSpeech.getCurrentText()}
                </div>
                <div className="text-gray-300 text-lg">
                  {momSpeech.isPlaying ? "Speaking..." : "Get ready to focus!"}
                </div>
              </div>
              {momSpeech.isPlaying && (
                <div className="mt-6 flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Session;
