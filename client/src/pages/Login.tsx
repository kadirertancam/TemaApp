import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const [_, setLocation] = useLocation();
  const { login, isLoggedIn, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      setLocation('/profile');
    }
  }, [isLoggedIn, setLocation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const success = await login(username, password);
    if (success) {
      setLocation('/profile');
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
          <h1 className="text-xl font-semibold text-white ml-4">Login</h1>
        </div>
      </header>

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="username"
                type="text" 
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            </div>
            <Button 
              className="w-full bg-purple-700 hover:bg-purple-600" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">Don't have an account?</p>
            <Button 
              variant="link" 
              className="text-purple-400 hover:text-purple-300"
              onClick={() => setLocation("/register")}
            >
              Create an account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
