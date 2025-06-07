
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

interface SessionControlsProps {
  isRunning: boolean;
  showMomOverlay: boolean;
  timeRemaining: number;
  totalTime: number;
  onStart: () => void;
  onPause: () => void;
  onStopClick: () => void;
}

const SessionControls = ({
  isRunning,
  showMomOverlay,
  timeRemaining,
  totalTime,
  onStart,
  onPause,
  onStopClick
}: SessionControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {!isRunning ? (
        <Button
          onClick={onStart}
          disabled={showMomOverlay}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl shadow-red-500/30 disabled:opacity-50"
        >
          <Play className="w-6 h-6 mr-2" />
          {timeRemaining === totalTime ? "Start" : "Resume"}
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant="outline"
          className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 px-8 py-4 text-lg rounded-xl"
        >
          <Pause className="w-6 h-6 mr-2" />
          Pause
        </Button>
      )}

      <Button
        onClick={onStopClick}
        variant="outline"
        className="border-red-600/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:border-red-500 px-8 py-4 text-lg rounded-xl"
      >
        <Square className="w-6 h-6 mr-2" />
        Stop
      </Button>
    </div>
  );
};

export default SessionControls;
