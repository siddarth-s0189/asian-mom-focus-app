
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";
import FeaturesSection from "@/components/FeaturesSection";
import PlaceholderSections from "@/components/PlaceholderSections";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <PlaceholderSections />
      <Footer />
    </div>
  );
};

export default Index;
