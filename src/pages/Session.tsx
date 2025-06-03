
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Coffee, RotateCcw, Clock, ArrowUp, ArrowDown, X, Triangle, Circle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAsianMomSpeech } from "@/hooks/useAsianMomSpeech";

interface SessionConfig {
  goal: string;
  duration: number;
  breaks: boolean;
  workplace: string;
  strictness: number;
}

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
  
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakReminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Asian mom speech with strictness from config
  const asianMomSpeech = useAsianMomSpeech({ 
    strictness: sessionConfig?.strictness || 3 
  });

  useEffect(() => {
    // Load session config from localStorage
    const config = localStorage.getItem('sessionConfig');
    if (config) {
      const parsedConfig: SessionConfig = JSON.parse(config);
      setSessionConfig(parsedConfig);
      const timeInSeconds = parsedConfig.duration * 60;
      setTimeRemaining(timeInSeconds);
      setTotalTime(timeInSeconds);
    } else {
      // Redirect back to dashboard if no config found
      navigate('/dashboard');
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

  // Separate useEffect for reminders - only when session is actually running
  useEffect(() => {
    if (isRunning && !isBreak && sessionConfig && !showMomOverlay) {
      const reminderInterval = asianMomSpeech.getReminderInterval();
      
      reminderIntervalRef.current = setInterval(() => {
        if (isRunning && !isBreak && !showMomOverlay) {
          setShowMomOverlay(true);
          asianMomSpeech.speakFocusReminder().then(() => {
            setTimeout(() => setShowMomOverlay(false), 1000);
          });
        }
      }, reminderInterval);

      // Set break reminder (5 minutes before break for long sessions)
      if (sessionConfig.breaks && sessionConfig.duration >= 60) {
        const breakReminderTime = (sessionConfig.duration * 60 - 5 * 60) * 1000;
        breakReminderTimeoutRef.current = setTimeout(() => {
          if (isRunning && !isBreak && !showMomOverlay) {
            setShowMomOverlay(true);
            asianMomSpeech.speakBreakReminder().then(() => {
              setTimeout(() => setShowMomOverlay(false), 1000);
            });
          }
        }, breakReminderTime);
      }
    }

    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
      }
      if (breakReminderTimeoutRef.current) {
        clearTimeout(breakReminderTimeoutRef.current);
      }
    };
  }, [isRunning, isBreak, sessionConfig, showMomOverlay]);

  const handleSessionComplete = async () => {
    // Clear any existing intervals first
    if (reminderIntervalRef.current) {
      clearInterval(reminderIntervalRef.current);
    }
    if (breakReminderTimeoutRef.current) {
      clearTimeout(breakReminderTimeoutRef.current);
    }

    if (isBreak) {
      // Break completed, return to work
      setIsBreak(false);
      const workTime = sessionConfig!.duration * 60;
      setTimeRemaining(workTime);
      setTotalTime(workTime);
      
      // Asian mom speaks when break ends
      setShowMomOverlay(true);
      await asianMomSpeech.speakBreakEnd();
      setTimeout(() => setShowMomOverlay(false), 1000);
    } else {
      // Work session completed
      if (sessionConfig?.breaks && sessionConfig.duration >= 60) {
        // Start break
        setIsBreak(true);
        setBreakNumber(prev => prev + 1);
        const breakTime = 10 * 60; // 10 minutes
        setTimeRemaining(breakTime);
        setTotalTime(breakTime);
        
        // Asian mom speaks when break starts
        setShowMomOverlay(true);
        await asianMomSpeech.speakBreakStart();
        setTimeout(() => setShowMomOverlay(false), 1000);
      } else {
        // Session fully completed
        setShowMomOverlay(true);
        await asianMomSpeech.speakSessionComplete();
        setTimeout(() => {
          setShowMomOverlay(false);
          navigate('/dashboard');
        }, 2000);
      }
    }
  };

  const handleStart = async () => {
    // Prevent multiple clicks
    if (showMomOverlay) return;
    
    // Show the Asian mom overlay and speak
    setShowMomOverlay(true);
    
    try {
      // Asian mom speaks before starting timer
      await asianMomSpeech.speakSessionStart();
      
      // Hide overlay and start the timer after speech completes
      setShowMomOverlay(false);
      setIsRunning(true);
    } catch (error) {
      console.error('Error during speech:', error);
      setShowMomOverlay(false);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    // Clear intervals when pausing
    if (reminderIntervalRef.current) {
      clearInterval(reminderIntervalRef.current);
    }
    if (breakReminderTimeoutRef.current) {
      clearTimeout(breakReminderTimeoutRef.current);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    // Clear intervals when stopping
    if (reminderIntervalRef.current) {
      clearInterval(reminderIntervalRef.current);
    }
    if (breakReminderTimeoutRef.current) {
      clearTimeout(breakReminderTimeoutRef.current);
    }
    navigate('/dashboard');
  };

  const toggleTimerMode = () => {
    setIsCountUp(!isCountUp);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
        color: "text-green-400"
      },
    ];

    if (sessionConfig?.breaks && !isBreak) {
      const sessionHours = Math.floor(sessionConfig.duration / 60);
      for (let i = 1; i <= sessionHours; i++) {
        const position = (i * 60 * 60 / totalTime) * 100;
        milestones.push({
          label: `Break ${i}`,
          position,
          passed: getProgress() >= position,
          icon: i % 2 === 1 ? Triangle : Circle,
          color: getProgress() >= position ? "text-blue-400" : "text-gray-500"
        });
      }
    }

    milestones.push({ 
      label: "End", 
      position: 100, 
      passed: getProgress() >= 100,
      icon: Square,
      color: getProgress() >= 100 ? "text-red-400" : "text-gray-500"
    });

    return milestones;
  };

  if (!sessionConfig) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header with AI Avatar and Session Status */}
            <div className="flex items-center justify-between mb-8">
              {/* AI Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 p-1 shadow-xl shadow-pink-500/30">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="text-2xl">👩‍🦳</div>
                    </div>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center ${
                    isRunning || asianMomSpeech.isSpeaking
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-gray-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isRunning || asianMomSpeech.isSpeaking ? 'bg-white' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {isBreak ? "Take a breather!" : sessionConfig.goal}
                  </h1>
                  <div className="flex items-center mt-1">
                    {isBreak ? (
                      <>
                        <Coffee className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-green-400 font-medium">Break Time #{breakNumber}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <span className="text-white font-medium">Focus Session</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Timer Mode Toggle */}
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

            {/* Timer Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center mb-8">
              {/* Timer */}
              <div className="mb-8">
                <div className="text-7xl lg:text-8xl font-mono font-bold text-white mb-2">
                  {getDisplayTime()}
                </div>
                <div className="text-gray-400 text-lg">
                  {isCountUp ? 'Time Elapsed' : 'Time Remaining'}
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    disabled={showMomOverlay || asianMomSpeech.isSpeaking}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl shadow-red-500/30 disabled:opacity-50"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {timeRemaining === totalTime ? 'Start' : 'Resume'}
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
                  onClick={handleStop}
                  variant="outline"
                  className="border-red-600/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:border-red-500 px-8 py-4 text-lg rounded-xl"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop
                </Button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">
                  {isBreak ? 'Break Progress' : 'Session Progress'}
                </h3>
                <div className="text-3xl font-bold text-red-400">
                  {Math.round(getProgress())}%
                </div>
              </div>
              
              {/* Progress Bar with PS4 Controller Icons */}
              <div className="relative mb-12">
                <Progress 
                  value={getProgress()} 
                  className="h-8 rounded-full"
                />
                
                {/* PS4 Controller Icon Milestones */}
                <div className="absolute top-0 left-0 right-0 h-8 flex items-center">
                  {getMilestones().map((milestone, index) => {
                    const IconComponent = milestone.icon;
                    return (
                      <div
                        key={index}
                        className="absolute flex items-center justify-center"
                        style={{ 
                          left: `${milestone.position}%`, 
                          transform: 'translateX(-50%)',
                          zIndex: 10
                        }}
                      >
                        <div className={`w-12 h-12 rounded-full border-4 border-gray-900 flex items-center justify-center ${
                          milestone.passed 
                            ? 'bg-gray-800 shadow-lg shadow-red-500/30' 
                            : 'bg-gray-700'
                        }`}>
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
              
              {/* Milestone Labels */}
              <div className="relative mt-4">
                <div className="flex justify-between items-center">
                  {getMilestones().map((milestone, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                      style={{ 
                        width: `${100 / getMilestones().length}%`
                      }}
                    >
                      <div className={`text-sm font-medium text-center ${
                        milestone.passed ? 'text-white' : 'text-gray-400'
                      }`}>
                        {milestone.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asian Mom Overlay */}
        {showMomOverlay && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              {/* Large Asian Mom Avatar */}
              <div className="mb-8">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 p-2 shadow-2xl shadow-pink-500/40 animate-pulse">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <div className="text-8xl">👩‍🦳</div>
                  </div>
                </div>
              </div>
              
              {/* Speech Bubble */}
              <div className="bg-white/10 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-2xl mx-auto">
                <div className="text-2xl font-bold text-white mb-4">
                  "{asianMomSpeech.currentMessage || "Aiya! You better focus now, ah!"}"
                </div>
                <div className="text-gray-300 text-lg">
                  {asianMomSpeech.isSpeaking ? "Speaking..." : "Get ready to focus!"}
                </div>
              </div>
              
              {/* Speaking indicator */}
              {asianMomSpeech.isSpeaking && (
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
