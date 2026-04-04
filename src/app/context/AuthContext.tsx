"use client"
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkAuth: () => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login: (username: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
            const [isAuthenticated, setIsAuthenticated] = useState(false);
            const [user, setUser] = useState<string | null>(null);
            const [isLoading, setIsLoading] = useState(true);
            const router = useRouter();

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
                    return data; // Should contain { message: "username" } on success
                } catch (error) {
                    console.error('Error checking authentication:', error);
                    throw error;
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
                    setIsAuthenticated(true);
                    setUser(data.full_name); // Frappe login returns full_name
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
                } finally {
                    setIsAuthenticated(false);
                    setUser(null);
                    router.push('/auth/login');
                }
            };
            
            useEffect(() => {
                const verifyAuth = async () => {
                    setIsLoading(true);
                    try {
                        const data = await checkAuth();
                        if (data && data.message) {
                            setIsAuthenticated(true);
                            setUser(data.message); // get_logged_user returns username in message
                        } else {
                            setIsAuthenticated(false);
                            setUser(null);
                        }
                        // eslint-disable-next-line
                    } catch (error) {
                        setIsAuthenticated(false);
                        setUser(null);
                    } finally {
                        setIsLoading(false);
                    }
                };
                verifyAuth();
            }, []);
            
return (
        <AuthContext.Provider value={{ 
            isAuthenticated,
            isLoading,
            user,
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
