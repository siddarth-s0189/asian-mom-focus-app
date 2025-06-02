
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Coffee, RotateCcw, Clock, ArrowUp, ArrowDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

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

  const handleSessionComplete = () => {
    if (isBreak) {
      // Break completed, return to work
      setIsBreak(false);
      const workTime = sessionConfig!.duration * 60;
      setTimeRemaining(workTime);
      setTotalTime(workTime);
    } else {
      // Work session completed
      if (sessionConfig?.breaks && sessionConfig.duration >= 60) {
        // Start break
        setIsBreak(true);
        setBreakNumber(prev => prev + 1);
        const breakTime = 10 * 60; // 10 minutes
        setTimeRemaining(breakTime);
        setTotalTime(breakTime);
      } else {
        // Session fully completed
        navigate('/dashboard');
      }
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
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
      { label: "Start", position: 0, passed: getProgress() > 0 },
    ];

    if (sessionConfig?.breaks && !isBreak) {
      const sessionHours = Math.floor(sessionConfig.duration / 60);
      for (let i = 1; i <= sessionHours; i++) {
        const position = (i * 60 * 60 / totalTime) * 100;
        milestones.push({
          label: `Break ${i}`,
          position,
          passed: getProgress() >= position
        });
      }
    }

    milestones.push({ 
      label: "End", 
      position: 100, 
      passed: getProgress() >= 100 
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
          <div className="max-w-6xl mx-auto">
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* AI Avatar */}
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-red-600 p-1 shadow-2xl shadow-red-500/50">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="text-6xl">🤖</div>
                    </div>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full border-4 border-gray-900 flex items-center justify-center ${
                    isRunning 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-gray-600'
                  }`}>
                    {isRunning ? (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}
                  </div>
                </div>
              </div>

              {/* Timer Section */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Session Info */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/60 border border-gray-600/50 mb-4">
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
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {isBreak ? "Take a breather!" : sessionConfig.goal}
                  </h1>
                </div>

                {/* Timer Display */}
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center">
                  
                  {/* Timer Mode Toggle */}
                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={toggleTimerMode}
                      variant="outline"
                      className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 rounded-xl px-6 py-2"
                    >
                      {isCountUp ? (
                        <>
                          <ArrowDown className="w-4 h-4 mr-2" />
                          Switch to Countdown
                        </>
                      ) : (
                        <>
                          <ArrowUp className="w-4 h-4 mr-2" />
                          Switch to Count Up
                        </>
                      )}
                    </Button>
                  </div>

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
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl shadow-red-500/30"
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
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {isBreak ? 'Break Progress' : 'Session Progress'}
                </h3>
                <div className="text-3xl font-bold text-red-400">
                  {Math.round(getProgress())}%
                </div>
              </div>
              
              {/* Progress Bar with Milestones */}
              <div className="relative mb-8">
                <Progress 
                  value={getProgress()} 
                  className="h-6 rounded-full"
                />
                
                {/* Milestones */}
                <div className="absolute top-0 left-0 right-0 h-6">
                  {getMilestones().map((milestone, index) => (
                    <div
                      key={index}
                      className="absolute top-0 h-6 flex items-center"
                      style={{ left: `${milestone.position}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 border-gray-900 ${
                        milestone.passed 
                          ? 'bg-white shadow-lg' 
                          : 'bg-gray-600'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Milestone Labels */}
              <div className="relative">
                {getMilestones().map((milestone, index) => (
                  <div
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${milestone.position}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className={`text-sm font-medium ${
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
    </ProtectedRoute>
  );
};

export default Session;
