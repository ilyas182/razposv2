"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, checkAuth, logout } = useAuth();
  const [status, setStatus] = useState<string>("Idle");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Note: Your AuthContext login function currently takes no arguments.
      // You may eventually want to update it to accept credentials (username/password).
      const result = await login("administrator", "admin"); // Replace with actual credentials or a login form
      setStatus("Login successful!");
      toast.success("Logged in successfully");
      console.log("Login result:", result);
    } catch (error) {
      setStatus("Login failed.");
      toast.error("Failed to login");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAuth = async () => {
    const isAuthenticated = await checkAuth();
    setStatus(isAuthenticated ? "Authenticated" : "Not Authenticated");
    if (isAuthenticated) {
      toast.success("User is authenticated");
    } else {
      toast.error("User is NOT authenticated");
    }
  };

  const handleLogout = () => {
    logout(); // Your logout function is currently empty in the context, you'll need to implement it
    setStatus("Logged out");
    toast.success("Logged out");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">Test Authentication</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded text-center text-sm font-mono text-gray-700">
            Status: {status}
          </div> 

          <button onClick={handleLogin} disabled={isLoading} className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors">
            {isLoading ? "Logging in..." : "Trigger Login"}
          </button>
          <button onClick={handleCheckAuth} className="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded-md hover:bg-purple-50 transition-colors">
            Check Auth Status
          </button>
          <button onClick={handleLogout} className="w-full border border-red-600 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 transition-colors">
            Trigger Logout
          </button>
        </div>
      </div>
    </div>
  );
}
