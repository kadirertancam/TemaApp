
import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast({
        title: "Registration successful",
        description: "Welcome to ThemeHub!",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
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
              <Input
                name="username"
                type="text"
                placeholder="Username"
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
            </div>
            <Button className="w-full bg-purple-700 hover:bg-purple-600" type="submit">
              Create Account
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
        </div>
      </main>
    </div>
  );
}
