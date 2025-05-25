
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase sign in
    console.log("Sign in:", { email, password });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Button 
            type="button"
            variant="outline" 
            className="w-full bg-blue-600 border-blue-600 text-white hover:bg-blue-700 py-3"
          >
            <span className="mr-2">G</span> Sign in with Google
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
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200 py-3 font-semibold"
          >
            Sign in
          </Button>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
