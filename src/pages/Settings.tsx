
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50 flex items-center justify-center shadow-xl shadow-red-500/30">
                  <SettingsIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
                Settings
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Customize your AsianMom.gg experience
              </p>
            </div>

            {/* Settings Content */}
            <div className="relative">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 rounded-3xl blur-xl transform rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-l from-purple-500/5 via-transparent to-blue-500/5 rounded-3xl blur-2xl transform -rotate-1" />
              
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 shadow-2xl space-y-12">
                
                {/* Account Section */}
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Account</h2>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-lg">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-700/50 border-gray-600 text-white text-lg h-12"
                      />
                    </div>
                    
                    <Button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                    >
                      {isLoading ? "Signing out..." : "Sign Out"}
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-700/50" />

                {/* Notifications Section */}
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 border border-green-400/50 flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Notifications</h2>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Push Notifications</h3>
                        <p className="text-gray-400">Receive notifications about your study sessions</p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                        className="scale-125 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600 data-[state=checked]:shadow-lg data-[state=checked]:shadow-green-500/50"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Sound Effects</h3>
                        <p className="text-gray-400">Play audio during focus sessions</p>
                      </div>
                      <Switch
                        checked={soundEnabled}
                        onCheckedChange={setSoundEnabled}
                        className="scale-125 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600 data-[state=checked]:shadow-lg data-[state=checked]:shadow-green-500/50"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700/50" />

                {/* Appearance Section */}
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 border border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Appearance</h2>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Dark Mode</h3>
                        <p className="text-gray-400">Enable dark theme (always on for AsianMom.gg)</p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                        disabled
                        className="scale-125 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-gray-500 data-[state=checked]:to-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700/50" />

                {/* Privacy Section */}
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-400/50 flex items-center justify-center shadow-lg shadow-orange-500/25">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Privacy & Security</h2>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50 space-y-4">
                    <p className="text-gray-300">
                      Your data is secure with us. We use industry-standard encryption to protect your information.
                    </p>
                    <Button
                      variant="outline"
                      className="border-gray-500 text-gray-300 hover:bg-gray-700/50"
                    >
                      View Privacy Policy
                    </Button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-xl text-lg shadow-xl shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
