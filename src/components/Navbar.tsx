
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
          AM
        </div>
        <span className="text-white font-semibold text-lg">
          AsianMom<span className="text-red-500">.gg</span>
        </span>
      </div>
      
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
