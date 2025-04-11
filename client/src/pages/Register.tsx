import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function Register() {
  const [_, setLocation] = useLocation();
  const { register, isLoggedIn, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      setLocation('/profile');
    }
  }, [isLoggedIn, setLocation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const success = await register(username, email, password);
    if (success) {
      setLocation("/login");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
        <div className="flex items-center px-4 py-3">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            onClick={() => setLocation("/profile")}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-xl font-semibold text-white ml-4">Create Account</h1>
        </div>
      </header>

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Username (will be used for login)</label>
              <Input
                name="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>
            <Button 
              className="w-full bg-purple-700 hover:bg-purple-600" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">Already have an account?</p>
            <Button 
              variant="link" 
              className="text-purple-400 hover:text-purple-300"
              onClick={() => setLocation("/login")}
            >
              Sign in
            </Button>
          </div>
          
          <div className="mt-8 text-xs text-gray-500">
            <p className="text-center">By creating an account, you agree to our</p>
            <p className="text-center">
              <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto text-xs">Terms of Service</Button>
              {" and "}
              <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto text-xs">Privacy Policy</Button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
