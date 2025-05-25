
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    // If we have verification parameters, verify automatically
    if (token && type === 'signup') {
      handleEmailVerification();
    }
  }, [token, type]);

  const handleEmailVerification = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setIsVerified(true);
        toast({
          title: "Email Verified!",
          description: "Your account has been successfully verified.",
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide an email address to resend verification.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email Sent",
        description: "We've sent you a new verification email.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Failed to Resend",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-400 mb-6">
              Your account has been verified. You're being redirected to your dashboard...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Verifying Your Email...
            </h1>
            <p className="text-gray-400">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <Mail className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Check Your Email
          </h1>
          <p className="text-gray-400 mb-6">
            We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
            Click the link in your email to verify your account.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Email
                </>
              )}
            </Button>
            
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or click resend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
