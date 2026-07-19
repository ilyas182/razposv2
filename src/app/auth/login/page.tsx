"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import BranchSelectionModal from "@/app/components/modals/login/BranchSelectionModal";

export default function LoginPage() {
  const { login, setAvailableProfiles } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
        if (setAvailableProfiles) {
            setAvailableProfiles([]);
        }
    }, [setAvailableProfiles]);
    
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
      
      toast.success("Logged in successfully");
      
      // Note: You can add logic here to prompt the user to select a register 
      // if they have multiple, or save the selected profile to context/localStorage.
      
      // router.push("/");
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-black">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-gray-100">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your RAZPOS account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              Email or Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white text-black"
              placeholder="Enter your email or username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white text-black"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors font-medium flex justify-center items-center h-12"
          >
            {isLoading ? <BarLoader color="#ffffff" width={60} /> : "Sign In"}
          </button>
        </form>
        <BranchSelectionModal />
      </div>
    </div>
  );
}
