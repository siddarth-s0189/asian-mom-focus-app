
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Coffee } from "lucide-react";
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  if (!sessionConfig) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Session Info */}
            <div className="mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 border border-gray-700 mb-6">
                {isBreak ? (
                  <>
                    <Coffee className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-green-400 font-medium">Break Time #{breakNumber}</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2" />
                    <span className="text-white font-medium">Focus Session</span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                {isBreak ? "Take a breather!" : sessionConfig.goal}
              </h1>
              
              {!isBreak && (
                <div className="flex items-center justify-center space-x-6 text-gray-400">
                  <span>Duration: {Math.floor(sessionConfig.duration / 60)}h {sessionConfig.duration % 60}m</span>
                  <span>•</span>
                  <span>Breaks: {sessionConfig.breaks ? 'Enabled' : 'Disabled'}</span>
                  <span>•</span>
                  <span>Device: {sessionConfig.workplace === 'this-device' ? 'This device' : 'Other device'}</span>
                </div>
              )}
            </div>

            {/* Timer Display */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-8">
              <div className="text-8xl font-mono font-bold text-white mb-8">
                {formatTime(timeRemaining)}
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-xl"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {timeRemaining === totalTime ? 'Start' : 'Resume'}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg rounded-xl"
                  >
                    <Pause className="w-6 h-6 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={handleStop}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900/20 px-8 py-4 text-lg rounded-xl"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {isBreak ? 'Break Progress' : 'Session Progress'}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(getProgress())}%
              </span>
            </div>
            <Progress 
              value={getProgress()} 
              className="h-2"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Session;
