
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CheckCircle, XCircle } from "lucide-react";

export default function AccountSettings() {
  const [emailVerified, setEmailVerified] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);

  const handleRequestPasswordReset = () => {
    setResetRequested(true);
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 rounded-xl backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-white text-2xl font-medium flex items-center gap-3">
          <User className="w-6 h-6" />
          Account Settings
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          Manage your account information and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <div className="text-white text-xl font-medium mb-4">Email</div>
          <Input
            value="sidduphotosaken@gmail.com"
            disabled
            className="bg-gray-900/50 border-gray-600 text-gray-300 text-lg h-12"
          />
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-white text-xl font-medium">Email Verification Status</div>
            <div className="flex items-center gap-2 mt-2">
              {emailVerified ? (
                <span className="flex items-center text-green-400 text-lg">
                  <CheckCircle className="w-5 h-5 mr-2" /> Verified
                </span>
              ) : (
                <span className="flex items-center text-yellow-400 text-lg">
                  <XCircle className="w-5 h-5 mr-2" /> Not Verified
                </span>
              )}
            </div>
          </div>
          <Button 
            className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6 py-3 text-lg"
          >
            Resend Verification
          </Button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-white text-xl font-medium">Reset Password</div>
            <div className="text-gray-400 text-lg">Send a password reset email</div>
          </div>
          <Button 
            onClick={handleRequestPasswordReset}
            className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6 py-3 text-lg"
          >
            Send Reset Email
          </Button>
        </div>

        {resetRequested && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-md p-4">
            <p className="text-green-400 text-lg">Password reset email sent (simulate).</p>
          </div>
        )}

        <div className="pt-6 border-t border-gray-600">
          <Button 
            variant="outline"
            className="bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-6 py-3 text-lg"
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
