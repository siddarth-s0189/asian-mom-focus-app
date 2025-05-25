
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Study like your{" "}
          <span className="text-red-500">life</span>
          <br />
          <span className="text-red-500">depends</span> on it
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          — because she thinks it does.
        </p>
        
        <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
          Meet your AI Asian mom. She's loud. She's loving.{" "}
          <span className="text-red-500 font-semibold">She's watching.</span>
        </p>
        
        <p className="text-gray-400 mb-12 max-w-4xl mx-auto">
          AsianMom.gg is a dark-mode, minimalistic productivity app that replaces generic 
          focus timers with a fully voiced AI mom who checks in, calls out distractions, and 
          celebrates your wins.
        </p>
        
        <Link to="/signup">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            Get Yelled At Now
          </Button>
        </Link>
        
        <p className="text-sm text-gray-500 mt-4">
          Free to start • No credit card required
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
