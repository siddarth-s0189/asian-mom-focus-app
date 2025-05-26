
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState } from "@/utils/authUtils";
import { Loader2, LogOut, User } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out error (continuing):', err);
      }
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Force page reload for a clean state
      window.location.href = '/signin';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">
              Welcome to AsianMom.gg!
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Your productivity journey starts here. Get ready for some tough love!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Tasks</h3>
            <p className="text-gray-400 mb-4">Manage your daily tasks with Asian mom motivation.</p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              View Tasks
            </Button>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Goals</h3>
            <p className="text-gray-400 mb-4">Set and track your long-term goals.</p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              View Goals
            </Button>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Progress</h3>
            <p className="text-gray-400 mb-4">Track your productivity progress.</p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              View Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
