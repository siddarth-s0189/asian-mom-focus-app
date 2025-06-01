
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, ChevronLeft, Target, Clock, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Session configuration state
  const [sessionGoal, setSessionGoal] = useState("");
  const [duration, setDuration] = useState([60]);
  const [allowBreaks, setAllowBreaks] = useState(true);
  const [workplace, setWorkplace] = useState("this-device");
  const [strictness, setStrictness] = useState([50]);

  const handleNext = () => {
    if (currentStep === 1 && sessionGoal.trim()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleStartSession = () => {
    // Store session config in localStorage for the session page
    const sessionConfig = {
      goal: sessionGoal,
      duration: duration[0],
      breaks: allowBreaks,
      workplace,
      strictness: strictness[0]
    };
    localStorage.setItem('sessionConfig', JSON.stringify(sessionConfig));
    navigate('/session');
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= 1 ? 'bg-red-600 border-red-600' : 'border-gray-600'
                  }`}>
                    <Target className={`w-5 h-5 ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-red-600' : 'bg-gray-600'}`} />
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= 2 ? 'bg-red-600 border-red-600' : 'border-gray-600'
                  }`}>
                    <Settings className={`w-5 h-5 ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {currentStep === 1 ? "What's your focus goal?" : "Configure your session"}
              </h1>
              <p className="text-gray-400 text-lg">
                {currentStep === 1 
                  ? "Set a clear intention for your productivity session" 
                  : "Customize your session settings for optimal focus"
                }
              </p>
            </div>

            {/* Step Content */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-lg font-medium text-white">
                      📝 Session Goal
                    </label>
                    <Textarea
                      placeholder="e.g., Complete math homework chapter 5, Write introduction for history essay, Study for chemistry exam..."
                      value={sessionGoal}
                      onChange={(e) => setSessionGoal(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 min-h-[120px] text-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-400">
                      Be specific about what you want to accomplish
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Duration */}
                  <div className="space-y-4">
                    <label className="block text-lg font-medium text-white">
                      ⏳ Session Duration: <span className="text-red-400">{getDurationText()}</span>
                    </label>
                    <div className="px-4">
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={360}
                        min={30}
                        step={15}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>30 min</span>
                        <span>6 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Breaks */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-medium text-white">
                        ☕ Breaks
                      </label>
                      <Switch
                        checked={allowBreaks}
                        onCheckedChange={setAllowBreaks}
                        disabled={duration[0] < 60}
                      />
                    </div>
                    {duration[0] < 60 ? (
                      <p className="text-sm text-gray-500">
                        Breaks are only available for sessions ≥ 1 hour
                      </p>
                    ) : getBreakInfo() ? (
                      <p className="text-sm text-gray-400">
                        {getBreakInfo()} automatically scheduled
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No breaks - pure focus mode
                      </p>
                    )}
                  </div>

                  {/* Workplace */}
                  <div className="space-y-4">
                    <label className="block text-lg font-medium text-white">
                      💻 Workplace
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={workplace === "this-device" ? "default" : "outline"}
                        onClick={() => setWorkplace("this-device")}
                        className={`h-12 ${workplace === "this-device" 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        This device only
                      </Button>
                      <Button
                        variant={workplace === "other-device" ? "default" : "outline"}
                        onClick={() => setWorkplace("other-device")}
                        className={`h-12 ${workplace === "other-device" 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        Other device
                      </Button>
                    </div>
                  </div>

                  {/* Strictness Level */}
                  <div className="space-y-4">
                    <label className="block text-lg font-medium text-white">
                      🎚️ Strictness Level (Asianness): <span className={getStrictnessLevel().color}>
                        {getStrictnessLevel().text}
                      </span>
                    </label>
                    <div className="px-4">
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
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span className="text-blue-400">Chill (2x/session)</span>
                        <span className="text-yellow-400">Medium (~20-30min)</span>
                        <span className="text-red-400">Insane (~5-15min)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {currentStep === 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!sessionGoal.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartSession}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 text-lg py-6"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Start Focus Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
