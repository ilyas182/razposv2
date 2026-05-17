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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchAllowedRegisters: (userEmail: string) => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
            const [isAuthenticated, setIsAuthenticated] = useState(false);
            const [user, setUser] = useState<string | null>(null);
            const [isLoading, setIsLoading] = useState(true);
            const router = useRouter();

            const checkAuth = async () => {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                    const res = await fetch(`${baseUrl}/api/method/frappe.auth.get_logged_user`, { 
                        method: 'GET',
                        credentials: 'include', // Sends the session cookie to the backend
                        cache: 'no-store', // Prevent PWA / Service Worker from caching the auth status
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
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                    const res = await fetch(`${baseUrl}/api/method/login`, { 
                        method: 'POST', 
                        credentials: 'include', // Tells browser to accept the 'Set-Cookie' header
                        cache: 'no-store',
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
                    const userEmail = await checkAuth();
                    console.log(userEmail)
                    const allowedRegisters = await fetchAllowedRegisters(userEmail.message);
                    console.log('allowed registers: ', allowedRegisters)
                    if (allowedRegisters.length > 1) {
                        console.log('allowed: ', allowedRegisters)
                    }
                    else 
                        console.log('allowed: 1')
                    return data;
                } catch (error) {
                    console.error('Error logging in:', error);
                    throw error;
                }
            };
            const logout = async () => {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                    await fetch(`${baseUrl}/api/method/logout`, {
                        method: 'GET',
                        credentials: 'include', // Tells browser to clear the session cookie
                        cache: 'no-store',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
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
                        // if (data && data.message && data.message !== 'Guest') {
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

            const fetchAllowedRegisters = async (userEmail: string) => {
              try {
                console.log('fetching pos profile for: ', userEmail)
                // Hit the secure internal Next.js API route instead of Frappe directly
                const response = await fetch('/api/pos-profiles', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ userEmail })
                });
                const data = await response.json();
                console.log('response:', data)

                if (!response.ok) {
                  throw new Error(data.error || "Failed to fetch profiles");
                }
                
                // Returns an array: [{ name: "Tampines...", company: "...", warehouse: "..." }]
                return data.message || [];
              } catch (error) {
                console.error("Error fetching POS Profiles:", error);
                return [];
              }
            };
            
return (
        <AuthContext.Provider value={{ 
            isAuthenticated,
            isLoading,
            user,
            checkAuth,
            login,
            logout,
            fetchAllowedRegisters
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
