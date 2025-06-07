
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Coffee } from "lucide-react";

interface SessionTimerProps {
  sessionTitle: string;
  isBreak: boolean;
  breakNumber: number;
  isRunning: boolean;
  showMomOverlay: boolean;
  getDisplayTime: () => string;
  isCountUp: boolean;
  toggleTimerMode: () => void;
}

const SessionTimer = ({
  sessionTitle,
  isBreak,
  breakNumber,
  isRunning,
  showMomOverlay,
  getDisplayTime,
  isCountUp,
  toggleTimerMode
}: SessionTimerProps) => {
  return (
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
              {sessionTitle}
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
          <div className={`text-7xl lg:text-8xl font-mono font-bold mb-2 transition-colors duration-500 ${
            isBreak ? 'text-red-400' : 'text-white'
          }`}>
            {getDisplayTime()}
          </div>
          <div className="text-gray-400 text-lg">
            {isCountUp ? "Time Elapsed" : "Time Remaining"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
