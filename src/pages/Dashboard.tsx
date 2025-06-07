import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionGoal, setSessionGoal] = useState("");
  const [duration, setDuration] = useState([60]);
  const [allowBreaks, setAllowBreaks] = useState(true);
  const [workplace, setWorkplace] = useState("this-device");
  const [strictness, setStrictness] = useState([50]);

  const handleNext = () => {
    if (currentStep === 1 && sessionTitle.trim() && sessionGoal.trim()) {
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
      sessionTitle,
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
    if (level < 33) return { text: "Chill", color: "text-cyan-300", bg: "bg-cyan-500/20", border: "border-cyan-400/50" };
    if (level < 67) return { text: "Medium", color: "text-orange-300", bg: "bg-orange-500/20", border: "border-orange-400/50" };
    return { text: "Insane", color: "text-red-300", bg: "bg-red-500/20", border: "border-red-400/50" };
  };

  const getBreakInfo = () => {
    if (!allowBreaks || duration[0] < 60) return null;
    const totalMinutes = duration[0];
    const isShortFormat = totalMinutes <= 120; // 2 hours or less
    const workInterval = isShortFormat ? 25 : 50;
    const breakInterval = isShortFormat ? 5 : 10;
    const breakCount = Math.floor(totalMinutes / (workInterval + breakInterval));
    return `${breakCount} × ${breakInterval}min break${breakCount > 1 ? 's' : ''} (${workInterval}/${breakInterval} format)`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto">
            {/* Progress Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center space-x-8">
                  <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-500 ${
                    currentStep >= 1 ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 shadow-xl shadow-red-500/30' : 'border-gray-600'
                  }`}>
                    <Target className={`w-7 h-7 transition-colors ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`} />
                    {currentStep >= 1 && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse opacity-20" />
                    )}
                  </div>
                  <div className={`w-32 h-2 rounded-full transition-all duration-700 ${currentStep >= 2 ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-600' : 'bg-gray-700'}`} />
                  <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-500 ${
                    currentStep >= 2 ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 shadow-xl shadow-red-500/30' : 'border-gray-600'
                  }`}>
                    <Settings className={`w-7 h-7 transition-colors ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`} />
                    {currentStep >= 2 && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse opacity-20" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  {currentStep === 1 ? "Set Your Focus Goal" : "Configure Your Session"}
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  {currentStep === 1 
                    ? "Define what you want to accomplish in this productivity session" 
                    : "Fine-tune your session settings for maximum focus and efficiency"
                  }
                </p>
              </div>
            </div>

            {/* Step Content */}
            <div className="relative">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 rounded-3xl blur-xl transform rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-l from-purple-500/5 via-transparent to-blue-500/5 rounded-3xl blur-2xl transform -rotate-1" />
              
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 shadow-2xl">
                {currentStep === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50 flex items-center justify-center shadow-lg shadow-red-500/25">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <label className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          What's your mission?
                        </label>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-white text-lg font-medium mb-3">
                            Session Title (max 10 words)
                          </label>
                          <Input
                            placeholder="Study calculus chapter 7..."
                            value={sessionTitle}
                            onChange={(e) => {
                              const words = e.target.value.split(' ').filter(word => word.length > 0);
                              if (words.length <= 10) {
                                setSessionTitle(e.target.value);
                              }
                            }}
                            className="bg-gray-800/60 border-gray-600/50 text-white placeholder:text-gray-400 text-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-lg h-14"
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-400">
                              This will be displayed during your session
                            </span>
                            <span className={`text-sm ${sessionTitle.split(' ').filter(w => w.length > 0).length <= 10 ? 'text-gray-400' : 'text-red-400'}`}>
                              {sessionTitle.split(' ').filter(w => w.length > 0).length}/10 words
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white text-lg font-medium mb-3">
                            Detailed Goals & Tasks
                          </label>
                          <Textarea
                            placeholder="Complete calculus homework chapter 7 problems 1-15, write history essay introduction with thesis statement, study chemistry periodic table trends and practice balancing equations..."
                            value={sessionGoal}
                            onChange={(e) => setSessionGoal(e.target.value)}
                            className="bg-gray-800/60 border-gray-600/50 text-white placeholder:text-gray-400 min-h-[160px] text-lg resize-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-gray-400 bg-gray-800/30 rounded-xl p-4">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm">Be specific in your detailed goals to maximize focus and productivity</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-16">
                    {/* Duration */}
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <label className="text-2xl font-bold text-white">
                            Session Duration
                          </label>
                        </div>
                        <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50 shadow-lg shadow-red-500/25">
                          <span className="text-white font-bold text-xl">{getDurationText()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                        <Slider
                          value={duration}
                          onValueChange={setDuration}
                          max={360}
                          min={30}
                          step={30}
                          className="w-full duration-slider"
                        />
                        <style>{`
                          .duration-slider [role="slider"] {
                            background: white;
                            border: 4px solid #3b82f6;
                            width: 28px;
                            height: 28px;
                            box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.5), 0 10px 10px -5px rgba(59, 130, 246, 0.04);
                            ring: 4px;
                            ring-color: rgba(59, 130, 246, 0.2);
                          }
                          .duration-slider [data-orientation="horizontal"] {
                            height: 16px;
                            background: rgba(55, 65, 81, 0.8);
                            border-radius: 9999px;
                            border: 1px solid rgb(75, 85, 99);
                          }
                          .duration-slider [data-orientation="horizontal"] > span {
                            background: linear-gradient(to right, #60a5fa, #3b82f6, #9333ea);
                            height: 16px;
                            border-radius: 9999px;
                            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
                          }
                        `}</style>
                        <div className="flex justify-between text-sm text-gray-300 mt-6 font-medium">
                          <span>30 min</span>
                          <span>6 hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Breaks */}
                    <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 border border-green-400/50 flex items-center justify-center shadow-lg shadow-green-500/25">
                            <span className="text-white text-xl">☕</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Pomodoro Breaks</h3>
                            <p className="text-gray-300">Automatic rest periods to maintain peak performance</p>
                          </div>
                        </div>
                        <Switch
                          checked={allowBreaks}
                          onCheckedChange={setAllowBreaks}
                          disabled={duration[0] < 60}
                          className="scale-125 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600 data-[state=checked]:shadow-lg data-[state=checked]:shadow-green-500/50 data-[state=unchecked]:bg-gray-600 data-[state=unchecked]:border-gray-500"
                        />
                      </div>
                      
                      {duration[0] < 60 ? (
                        <div className="bg-gray-700/50 border border-gray-600/50 rounded-xl p-4">
                          <p className="text-gray-300 text-center">💡 Breaks are available for sessions ≥ 1 hour</p>
                        </div>
                      ) : getBreakInfo() ? (
                        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/50 rounded-xl p-4">
                          <p className="text-green-300 text-center font-medium">✓ {getBreakInfo()} automatically scheduled</p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/50 rounded-xl p-4">
                          <p className="text-orange-300 text-center font-medium">🔥 Pure focus mode - no interruptions</p>
                        </div>
                      )}
                    </div>

                    {/* Workplace */}
                    <div className="space-y-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 border border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <span className="text-white text-xl">💻</span>
                        </div>
                        <label className="text-2xl font-bold text-white">
                          Workspace Setup
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <Button
                          variant={workplace === "this-device" ? "default" : "outline"}
                          onClick={() => setWorkplace("this-device")}
                          className={`h-20 rounded-2xl transition-all duration-300 border-2 font-bold ${workplace === "this-device" 
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl shadow-red-500/30 border-red-400/50 scale-105" 
                            : "border-gray-400 bg-gray-700/70 text-white hover:bg-gray-600/90 hover:border-gray-300 hover:scale-105 shadow-lg shadow-gray-900/50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold">This Device</div>
                            <div className="text-sm opacity-90">Current setup</div>
                          </div>
                        </Button>
                        <Button
                          variant={workplace === "other-device" ? "default" : "outline"}
                          onClick={() => setWorkplace("other-device")}
                          className={`h-20 rounded-2xl transition-all duration-300 border-2 font-bold ${workplace === "other-device" 
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl shadow-red-500/30 border-red-400/50 scale-105" 
                            : "border-gray-400 bg-gray-700/70 text-white hover:bg-gray-600/90 hover:border-gray-300 hover:scale-105 shadow-lg shadow-gray-900/50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold">Other Device</div>
                            <div className="text-sm opacity-90">External setup</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Strictness Level */}
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <span className="text-white text-xl">🎚️</span>
                          </div>
                          <label className="text-2xl font-bold text-white">
                            Focus Intensity
                          </label>
                        </div>
                        <div className={`px-6 py-3 rounded-xl border shadow-lg ${getStrictnessLevel().bg} ${getStrictnessLevel().border}`}>
                          <span className={`font-bold text-xl ${getStrictnessLevel().color}`}>
                            {getStrictnessLevel().text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                        <Slider
                          value={strictness}
                          onValueChange={setStrictness}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full focus-slider"
                        />
                        <style>{`
                          .focus-slider [role="slider"] {
                            background: white;
                            border: 4px solid #f97316;
                            width: 28px;
                            height: 28px;
                            box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.5), 0 10px 10px -5px rgba(249, 115, 22, 0.04);
                            ring: 4px;
                            ring-color: rgba(249, 115, 22, 0.2);
                          }
                          .focus-slider [data-orientation="horizontal"] {
                            height: 16px;
                            background: rgba(55, 65, 81, 0.8);
                            border-radius: 9999px;
                            border: 1px solid rgb(75, 85, 99);
                          }
                          .focus-slider [data-orientation="horizontal"] > span {
                            background: linear-gradient(to right, #06b6d4, #f97316, #dc2626);
                            height: 16px;
                            border-radius: 9999px;
                            box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
                          }
                        `}</style>
                        <div className="flex justify-between text-sm mt-6">
                          <div className="text-center">
                            <div className="text-cyan-300 font-bold">Chill</div>
                            <div className="text-gray-400 text-xs">2x per session</div>
                          </div>
                          <div className="text-center">
                            <div className="text-orange-300 font-bold">Medium</div>
                            <div className="text-gray-400 text-xs">~20-30min</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-300 font-bold">Insane</div>
                            <div className="text-gray-400 text-xs">~5-15min</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-20 pt-8 border-t border-gray-700/50">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="border-gray-500 bg-gray-800/50 text-gray-200 hover:bg-gray-700/70 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl px-8 py-4 text-lg transition-all duration-300 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>

                  {currentStep === 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!sessionTitle.trim() || !sessionGoal.trim()}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStartSession}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-xl text-xl shadow-xl shadow-red-500/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <Clock className="w-6 h-6 mr-3" />
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
