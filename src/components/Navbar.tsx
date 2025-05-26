
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfileDropdown from "@/components/ProfileDropdown";

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white relative">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 4L10 8L6 9L9 12L8 16L12 14L16 16L15 12L18 9L14 8L12 4Z" fill="currentColor"/>
            <path d="M12 14L10 18L8 17L9 15L12 14Z" fill="#8B0000"/>
            <circle cx="10" cy="18" r="0.5" fill="#8B0000"/>
            <circle cx="8.5" cy="17.5" r="0.3" fill="#8B0000"/>
            <path d="M14 14L16 18L18 17L17 15L14 14Z" fill="#8B0000"/>
            <circle cx="16" cy="18" r="0.5" fill="#8B0000"/>
            <circle cx="17.5" cy="17.5" r="0.3" fill="#8B0000"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-lg">
          AsianMom<span className="text-red-500">.gg</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <ProfileDropdown />
        ) : (
          <Link to="/signin">
            <Button 
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
