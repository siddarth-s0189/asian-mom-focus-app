
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalSection() {
  return (
    <Card className="bg-gray-800/30 border-gray-700/50 rounded-xl backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-white text-2xl font-medium flex items-center gap-3">
          <Shield className="w-6 h-6" />
          Privacy & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-white text-lg mb-6">
          Your data is secure with us. We use industry-standard encryption to protect your information.
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white/10 border-gray-600 text-white hover:bg-white/20 py-3 text-lg" 
            disabled
          >
            View Privacy Policy
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white/10 border-gray-600 text-white hover:bg-white/20 py-3 text-lg" 
            disabled
          >
            Download My Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 py-3 text-lg" 
            disabled
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
