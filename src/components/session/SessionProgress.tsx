
import { Progress } from "@/components/ui/progress";
import { X, Triangle, Circle, Square } from "lucide-react";

interface SessionConfig {
  sessionTitle: string;
  goal: string;
  duration: number;
  breaks: boolean;
  workplace: string;
  strictness: number;
}

interface SessionProgressProps {
  sessionConfig: SessionConfig;
  isBreak: boolean;
  getProgress: () => number;
  getBreakSchedule: (config: SessionConfig) => any[];
}

const SessionProgress = ({
  sessionConfig,
  isBreak,
  getProgress,
  getBreakSchedule
}: SessionProgressProps) => {
  const getMilestones = () => {
    if (!sessionConfig) return [];
    
    const milestones = [
      {
        label: "Start",
        position: 0,
        passed: getProgress() > 0,
        icon: X,
        color: "text-green-400",
      },
    ];

    if (sessionConfig.breaks && !isBreak) {
      const breakSchedule = getBreakSchedule(sessionConfig);
      breakSchedule.forEach((breakInfo, index) => {
        const position = (breakInfo.startTime * 60) / (sessionConfig.duration * 60) * 100;
        milestones.push({
          label: `Break ${breakInfo.number}`,
          position,
          passed: getProgress() >= position,
          icon: index % 2 === 0 ? Triangle : Circle,
          color: getProgress() >= position ? "text-blue-400" : "text-gray-500",
        });
      });
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

  return (
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
        <Progress 
          value={getProgress()} 
          className={`h-8 rounded-full transition-colors duration-500 ${
            isBreak ? 'progress-break' : ''
          }`}
        />
        <style>{`
          .progress-break [data-orientation="horizontal"] > span {
            background: linear-gradient(to right, #ef4444, #dc2626) !important;
            box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3) !important;
          }
        `}</style>
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

      <div className="grid grid-cols-3 gap-4 mt-4">
        {getMilestones().map((milestone, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`text-sm font-medium ${
                milestone.passed ? "text-white" : "text-gray-400"
              }`}
            >
              {milestone.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionProgress;
