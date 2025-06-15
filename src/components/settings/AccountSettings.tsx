
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle } from "lucide-react";

export default function AccountSettings() {
  const [emailVerified, setEmailVerified] = useState(false); // TODO: replace with actual status.
  const [resetRequested, setResetRequested] = useState(false);

  const handleRequestPasswordReset = () => {
    setResetRequested(true);
    // TODO: Send actual password reset email via backend
  };

  return (
    <Card className="bg-gray-900/80 border-gray-700/50 mb-6">
      <CardHeader>
        <CardTitle className="text-white">Account</CardTitle>
        <CardDescription className="text-gray-400">
          Manage your password, email verification, and account deletion.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-lg text-white">Email Verification Status:</span>
            {emailVerified ? (
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-1" /> Verified
              </span>
            ) : (
              <span className="flex items-center text-yellow-400">
                <XCircle className="w-5 h-5 mr-1" /> Not Verified
              </span>
            )}
          </div>
          <Button variant="secondary" className="mt-2">
            Resend Verification Email
          </Button>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-lg text-white">Reset Password</label>
            <Button variant="outline" onClick={handleRequestPasswordReset}>
              Send Reset Email
            </Button>
          </div>
          {resetRequested && (
            <p className="text-sm text-green-400 mt-2">Password reset email sent (simulate).</p>
          )}
        </div>
        <div>
          <Button variant="destructive">
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
