
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkEmailExists, cleanupAuthState } from "@/utils/authUtils";
import { Loader2 } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms of service and privacy policy.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Check if email already exists
      console.log('Checking if email exists:', email);
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        toast({
          title: "Email Already in Use",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Attempt global sign out before signup
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out error (continuing):', err);
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Check Your Email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        
        // Redirect to verification page
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Button 
            type="button"
            variant="outline" 
            className="w-full bg-blue-600 border-blue-600 text-white hover:bg-blue-700 py-3"
          >
            <span className="mr-2">G</span> Sign up with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">OR</span>
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              required
              minLength={6}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              Agree to our{" "}
              <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200 py-3 font-semibold"
            disabled={!agreedToTerms || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-400 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
