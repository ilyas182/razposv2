"use client"
import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
    // Define any authentication-related functions or state here
    checkAuth: () => Promise<boolean>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login: (username: string, password: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
            const checkAuth = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/method/frappe.auth.get_logged_user`, { 
                        method: 'GET',
                        credentials: 'include', // Sends the session cookie to the backend
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!res.ok) return false;
                    
                    const data = await res.json();
                    return data
                    // return !!data.message; // Frappe typically returns { message: "username" } on success
                } catch (error) {
                    console.error('Error checking authentication:', error);
                    return false;
                }
            };
            const login = async (usr: string, pwd: string) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/method/login`, { 
                        method: 'POST', 
                        credentials: 'include', // Tells browser to accept the 'Set-Cookie' header
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ usr, pwd }) 
                    });
                    
                    if (!res.ok) {
                        throw new Error(`Login failed with status: ${res.status}`);
                    }
                    
                    const data = await res.json();
                    return data;
                } catch (error) {
                    console.error('Error logging in:', error);
                    throw error;
                }
            };
            const logout = async () => {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/method/logout`, {
                        method: 'POST',
                        credentials: 'include', // Tells browser to clear the session cookie
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Error logging out:', error);
                }
            };
            
return (
        <AuthContext.Provider value={{ 
            checkAuth,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
