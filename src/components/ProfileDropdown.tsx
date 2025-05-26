
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState } from "@/utils/authUtils";
import { User, Settings, CreditCard, LogOut } from "lucide-react";

const ProfileDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out error (continuing):', err);
      }
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      window.location.href = '/signin';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-red-600 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none text-white">{user?.user_metadata?.full_name || 'User'}</p>
          <p className="text-xs leading-none text-gray-400">{user?.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem asChild className="text-white hover:bg-gray-800 cursor-pointer">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          Price Plans
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="text-red-400 hover:bg-gray-800 cursor-pointer"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
