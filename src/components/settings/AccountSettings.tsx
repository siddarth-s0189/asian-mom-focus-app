
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
    <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
          <User className="w-5 h-5" />
          Account Settings
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm font-normal">
          Manage your account information and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="text-white text-base font-medium mb-3">Email</div>
          <Input
            value="sidduphotosaken@gmail.com"
            disabled
            className="bg-[#1a2332] border-gray-600 text-gray-300 text-sm"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-base font-medium">Email Verification Status</div>
            <div className="flex items-center gap-2 mt-1">
              {emailVerified ? (
                <span className="flex items-center text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" /> Verified
                </span>
              ) : (
                <span className="flex items-center text-yellow-400 text-sm">
                  <XCircle className="w-4 h-4 mr-1" /> Not Verified
                </span>
              )}
            </div>
          </div>
          <Button 
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          >
            Resend Verification
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-base font-medium">Reset Password</div>
            <div className="text-gray-400 text-sm">Send a password reset email</div>
          </div>
          <Button 
            onClick={handleRequestPasswordReset}
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          >
            Send Reset Email
          </Button>
        </div>

        {resetRequested && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3">
            <p className="text-green-400 text-sm">Password reset email sent (simulate).</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-600">
          <Button 
            variant="outline"
            className="bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
