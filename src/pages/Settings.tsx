
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Volume2, Clock, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [motivationalSpeech, setMotivationalSpeech] = useState(true);
  const [autoBreaks, setAutoBreaks] = useState(true);
  const [emailReminders, setEmailReminders] = useState(false);
  const [sessionGoalReminders, setSessionGoalReminders] = useState(true);
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

            <div className="space-y-8">
              {/* Account Settings */}
              <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <User className="w-6 h-6" />
                    <span>Account Settings</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account information and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Bell className="w-6 h-6" />
                    <span>Notifications</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Control how you receive notifications and reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Push Notifications</h3>
                      <p className="text-gray-400">Receive notifications about your study sessions</p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      className="scale-125"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Email Reminders</h3>
                      <p className="text-gray-400">Get daily study reminders via email</p>
                    </div>
                    <Switch
                      checked={emailReminders}
                      onCheckedChange={setEmailReminders}
                      className="scale-125"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Session Goal Reminders</h3>
                      <p className="text-gray-400">Get reminded about your session goals during breaks</p>
                    </div>
                    <Switch
                      checked={sessionGoalReminders}
                      onCheckedChange={setSessionGoalReminders}
                      className="scale-125"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Audio & Speech Settings */}
              <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>Audio & Speech</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure audio feedback and motivational speech
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Sound Effects</h3>
                      <p className="text-gray-400">Play audio during focus sessions</p>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                      className="scale-125"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Motivational Speech</h3>
                      <p className="text-gray-400">Enable Asian mom motivational speeches</p>
                    </div>
                    <Switch
                      checked={motivationalSpeech}
                      onCheckedChange={setMotivationalSpeech}
                      className="scale-125"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Session Settings */}
              <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Clock className="w-6 h-6" />
                    <span>Session Preferences</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize your focus session experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Automatic Breaks</h3>
                      <p className="text-gray-400">Enable automatic break scheduling for long sessions</p>
                    </div>
                    <Switch
                      checked={autoBreaks}
                      onCheckedChange={setAutoBreaks}
                      className="scale-125"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Palette className="w-6 h-6" />
                    <span>Appearance</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize the visual appearance of the app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Dark Mode</h3>
                      <p className="text-gray-400">Enable dark theme (always on for AsianMom.gg)</p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      disabled
                      className="scale-125"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Shield className="w-6 h-6" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your privacy and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    Your data is secure with us. We use industry-standard encryption to protect your information.
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="border-gray-500 text-gray-300 hover:bg-gray-700/50 w-full justify-start bg-transparent"
                    >
                      View Privacy Policy
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-500 text-gray-300 hover:bg-gray-700/50 w-full justify-start bg-transparent"
                    >
                      Download My Data
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10 w-full justify-start bg-transparent"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

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
    </ProtectedRoute>
  );
};

export default Settings;
