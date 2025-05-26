
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChefHat } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">
          <ChefHat className="w-5 h-5" />
        </div>
        <span className="text-white font-semibold text-lg">
          AsianMom<span className="text-red-500">.gg</span>
        </span>
      </Link>
      
      <Link to="/signin">
        <Button 
          variant="outline" 
          className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
        >
          Sign In
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;
