
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white relative">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2L13.5 8.5L20 7L14 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L10 12L4 7L10.5 8.5L12 2Z" />
            <circle cx="14" cy="6" r="1" className="fill-red-800" />
            <circle cx="16" cy="8" r="0.5" className="fill-red-800" />
            <circle cx="10" cy="16" r="0.8" className="fill-red-800" />
          </svg>
        </div>
        <span className="text-white font-semibold text-lg">
          AsianMom<span className="text-red-500">.gg</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <Link to="/profile">
            <Button 
              variant="outline" 
              className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
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
