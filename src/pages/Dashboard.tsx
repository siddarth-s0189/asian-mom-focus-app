
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, ChevronLeft, Target, Clock, Settings, Zap } from "lucide-react";
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
    if (level < 33) return { text: "Chill", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    if (level < 67) return { text: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    return { text: "Insane", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
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
        
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center space-x-6">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= 1 ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/25' : 'border-gray-600'
                  }`}>
                    <Target className={`w-6 h-6 transition-colors ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`} />
                    {currentStep >= 1 && (
                      <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
                    )}
                  </div>
                  <div className={`w-24 h-1 rounded-full transition-all duration-500 ${currentStep >= 2 ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gray-700'}`} />
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= 2 ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/25' : 'border-gray-600'
                  }`}>
                    <Settings className={`w-6 h-6 transition-colors ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`} />
                    {currentStep >= 2 && (
                      <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  {currentStep === 1 ? "Set Your Focus Goal" : "Configure Your Session"}
                </h1>
                <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
                  {currentStep === 1 
                    ? "Define what you want to accomplish in this productivity session" 
                    : "Fine-tune your session settings for maximum focus and efficiency"
                  }
                </p>
              </div>
            </div>

            {/* Step Content */}
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-orange-600/5 rounded-3xl blur-xl" />
              
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-12 shadow-2xl">
                {currentStep === 1 && (
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-red-400" />
                        </div>
                        <label className="text-2xl font-semibold text-white">
                          What's your mission?
                        </label>
                      </div>
                      
                      <Textarea
                        placeholder="Complete calculus homework chapter 7, write history essay introduction, study for chemistry exam..."
                        value={sessionGoal}
                        onChange={(e) => setSessionGoal(e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 min-h-[140px] text-lg resize-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 rounded-2xl backdrop-blur-sm transition-all duration-200"
                      />
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Zap className="w-4 h-4" />
                        <span>Be specific to maximize your focus and productivity</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-12">
                    {/* Duration */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-400" />
                          </div>
                          <label className="text-xl font-semibold text-white">
                            Session Duration
                          </label>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-red-600/10 border border-red-600/20">
                          <span className="text-red-400 font-bold text-lg">{getDurationText()}</span>
                        </div>
                      </div>
                      
                      <div className="px-6">
                        <Slider
                          value={duration}
                          onValueChange={setDuration}
                          max={360}
                          min={30}
                          step={15}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-3">
                          <span>30 min</span>
                          <span>6 hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Breaks */}
                    <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">☕</div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Smart Breaks</h3>
                            <p className="text-sm text-gray-400">Automatic rest periods to maintain peak performance</p>
                          </div>
                        </div>
                        <Switch
                          checked={allowBreaks}
                          onCheckedChange={setAllowBreaks}
                          disabled={duration[0] < 60}
                          className="scale-110"
                        />
                      </div>
                      
                      {duration[0] < 60 ? (
                        <p className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                          💡 Breaks are available for sessions ≥ 1 hour
                        </p>
                      ) : getBreakInfo() ? (
                        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          ✓ {getBreakInfo()} automatically scheduled
                        </p>
                      ) : (
                        <p className="text-sm text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          🔥 Pure focus mode - no interruptions
                        </p>
                      )}
                    </div>

                    {/* Workplace */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-600/20 flex items-center justify-center">
                          <span className="text-purple-400 text-lg">💻</span>
                        </div>
                        <label className="text-xl font-semibold text-white">
                          Workspace Setup
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant={workplace === "this-device" ? "default" : "outline"}
                          onClick={() => setWorkplace("this-device")}
                          className={`h-16 rounded-2xl transition-all duration-200 ${workplace === "this-device" 
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25" 
                            : "border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-semibold">This Device</div>
                            <div className="text-xs opacity-80">Current setup</div>
                          </div>
                        </Button>
                        <Button
                          variant={workplace === "other-device" ? "default" : "outline"}
                          onClick={() => setWorkplace("other-device")}
                          className={`h-16 rounded-2xl transition-all duration-200 ${workplace === "other-device" 
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25" 
                            : "border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-semibold">Other Device</div>
                            <div className="text-xs opacity-80">External setup</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Strictness Level */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
                            <span className="text-orange-400 text-lg">🎚️</span>
                          </div>
                          <label className="text-xl font-semibold text-white">
                            Focus Intensity
                          </label>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border ${getStrictnessLevel().bg} ${getStrictnessLevel().border}`}>
                          <span className={`font-bold text-lg ${getStrictnessLevel().color}`}>
                            {getStrictnessLevel().text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-6">
                        <div className="relative">
                          <Slider
                            value={strictness}
                            onValueChange={setStrictness}
                            max={100}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-sm mt-4">
                          <div className="text-center">
                            <div className="text-blue-400 font-medium">Chill</div>
                            <div className="text-gray-500 text-xs">2x per session</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-medium">Medium</div>
                            <div className="text-gray-500 text-xs">~20-30min</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-medium">Insane</div>
                            <div className="text-gray-500 text-xs">~5-15min</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-800/50">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800/50 disabled:opacity-30 rounded-xl px-6 py-3 transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {currentStep === 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!sessionGoal.trim()}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/25 transition-all duration-200"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStartSession}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl text-lg shadow-lg shadow-red-600/25 transition-all duration-200 transform hover:scale-105"
                    >
                      <Clock className="w-5 h-5 mr-3" />
                      Start Focus Session
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
