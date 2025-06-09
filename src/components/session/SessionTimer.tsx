import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Coffee } from "lucide-react";

interface SessionTimerProps {
  sessionTitle: string;
  isBreak: boolean;
  breakNumber: number;
  isRunning: boolean;
  showMomOverlay: boolean;
  getDisplayTime: () => number;
  isCountUp: boolean;
  toggleTimerMode: () => void;
  showHeaderOnly?: boolean;
  showTimerOnly?: boolean;
  breakDuration?: number; // in seconds
  breakElapsed?: number; // in seconds
}

// Use ceil for timer display so full time is shown
function formatTime(totalSeconds: number): string {
  const t = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const SessionTimer = ({
  sessionTitle,
  isBreak,
  breakNumber,
  isRunning,
  showMomOverlay,
  getDisplayTime,
  isCountUp,
  toggleTimerMode,
  showHeaderOnly = false,
  showTimerOnly = false,
  breakDuration,
  breakElapsed,
}: SessionTimerProps) => {
  // Force a re-render every second if in break and running (for live progress bar)
  const [, setRerenderTick] = useState(0);

  useEffect(() => {
    if (isBreak && isRunning) {
      const interval = setInterval(() => {
        setRerenderTick((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isBreak, isRunning]);

  const timerValue = getDisplayTime();

  let breakPercent = 0;
  if (isBreak && typeof breakDuration === "number" && typeof breakElapsed === "number" && breakDuration > 0) {
    breakPercent = Math.min(100, Math.max(0, (breakElapsed / breakDuration) * 100));
  }

  // Header only
  if (showHeaderOnly) {
    return (
      <div className="flex items-center justify-between">
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
              {sessionTitle}
            </h1>
            <div className="flex items-center mt-1">
              {isBreak ? (
                <>
                  <Coffee className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">
                    Break Time
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
    );
  }

  // Timer only mode (big timer, label, plus break progress if in break)
  if (showTimerOnly) {
    return (
      <div className="text-center">
        <div className={`text-7xl lg:text-8xl font-mono font-bold mb-4 transition-colors duration-500 ${
          isBreak ? 'text-red-400' : 'text-white'
        }`}>
          {formatTime(timerValue)}
        </div>
        <div className="text-gray-400 text-lg">
          {isCountUp ? "Time Elapsed" : "Time Remaining"}
        </div>
        {isBreak && typeof breakDuration === "number" && typeof breakElapsed === "number" && breakDuration > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${breakPercent}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Break Progress: {Math.round(breakPercent)}%
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Full component with header and timer
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        {/* ...header as above... */}
      </div>
      <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center mb-8">
        <div className="mb-8">
          <div className={`text-7xl lg:text-8xl font-mono font-bold mb-2 transition-colors duration-500 ${
            isBreak ? 'text-red-400' : 'text-white'
          }`}>
            {formatTime(timerValue)}
          </div>
          <div className="text-gray-400 text-lg">
            {isCountUp ? "Time Elapsed" : "Time Remaining"}
          </div>
          {isBreak && typeof breakDuration === "number" && typeof breakElapsed === "number" && breakDuration > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${breakPercent}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Break Progress: {Math.round(breakPercent)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;