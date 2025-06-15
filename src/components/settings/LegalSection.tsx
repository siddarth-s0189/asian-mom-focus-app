
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalSection() {
  return (
    <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
          <Shield className="w-5 h-5" />
          Privacy & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-gray-300 text-sm mb-4">
          Your data is secure with us. We use industry-standard encryption to protect your information.
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-transparent border-gray-600 text-white hover:bg-gray-700/50" 
            disabled
          >
            View Privacy Policy
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-transparent border-gray-600 text-white hover:bg-gray-700/50" 
            disabled
          >
            Download My Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-transparent border-red-500 text-red-400 hover:bg-red-500/10" 
            disabled
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
