
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Session configuration state
  const [sessionGoal, setSessionGoal] = useState("");
  const [duration, setDuration] = useState([60]); // in minutes
  const [allowBreaks, setAllowBreaks] = useState(true);
  const [workplace, setWorkplace] = useState("this-device");
  const [strictness, setStrictness] = useState([50]); // 0-100 scale

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  const handleStartSession = () => {
    // TODO: Implement session start logic
    console.log("Starting session with:", {
      goal: sessionGoal,
      duration: duration[0],
      breaks: allowBreaks,
      workplace,
      strictness: strictness[0]
    });
  };

  const getDurationText = () => {
    const minutes = duration[0];
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getStrictnessLevel = () => {
    const level = strictness[0];
    if (level < 33) return { text: "Chill", color: "text-blue-400" };
    if (level < 67) return { text: "Medium", color: "text-yellow-400" };
    return { text: "Insane", color: "text-red-400" };
  };

  const getBreakInfo = () => {
    if (!allowBreaks || duration[0] < 60) return null;
    const hours = Math.floor(duration[0] / 60);
    return `${hours} × 10min break${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Focus Session Setup
            </h1>
            <p className="text-gray-400 text-lg">
              Configure your productivity session and let Asian Mom keep you on track!
            </p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 space-y-8">
            {/* Session Goal */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                📝 Session Goal
              </label>
              <Textarea
                placeholder="e.g., Revise math, Write essay intro, Complete project..."
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 min-h-[80px]"
              />
            </div>

            {/* Session Duration */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                ⏳ Session Duration: {getDurationText()}
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={360}
                min={30}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>30 min</span>
                <span>6 hours</span>
              </div>
            </div>

            {/* Breaks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  ☕ Breaks
                </label>
                <Switch
                  checked={allowBreaks}
                  onCheckedChange={setAllowBreaks}
                  disabled={duration[0] < 60}
                />
              </div>
              {duration[0] < 60 ? (
                <p className="text-xs text-gray-500">
                  Breaks are only available for sessions ≥ 1 hour
                </p>
              ) : getBreakInfo() ? (
                <p className="text-xs text-gray-400">
                  {getBreakInfo()} automatically scheduled
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  No breaks - pure focus mode
                </p>
              )}
            </div>

            {/* Workplace */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                💻 Workplace
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={workplace === "this-device" ? "default" : "outline"}
                  onClick={() => setWorkplace("this-device")}
                  className={workplace === "this-device" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  This device only
                </Button>
                <Button
                  variant={workplace === "other-device" ? "default" : "outline"}
                  onClick={() => setWorkplace("other-device")}
                  className={workplace === "other-device" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  Other device
                </Button>
              </div>
            </div>

            {/* Strictness Level */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                🎚️ Strictness Level (Asianness): <span className={getStrictnessLevel().color}>
                  {getStrictnessLevel().text}
                </span>
              </label>
              <div className="relative">
                <Slider
                  value={strictness}
                  onValueChange={setStrictness}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div 
                  className="absolute top-0 h-2 rounded-full pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #EF4444 100%)`,
                    width: '100%',
                    zIndex: -1
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="text-blue-400">Chill (2x/session)</span>
                <span className="text-yellow-400">Medium (~20-30min)</span>
                <span className="text-red-400">Insane (~5-15min)</span>
              </div>
            </div>

            {/* Start Session Button */}
            <div className="pt-6">
              <Button
                onClick={handleStartSession}
                disabled={!sessionGoal.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Focus Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
