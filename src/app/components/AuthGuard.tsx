"use client";

import { useAuth } from '@/app/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';

// Define paths that should not be protected
const publicPaths = ['/auth/login'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Wait until the auth status is resolved
        if (isLoading) {
            return;
        }
        

        const pathIsPublic = publicPaths.includes(pathname ?? '');
        console.log(`AuthGuard: isAuthenticated=${isAuthenticated}, isLoading=${isLoading}, pathname=${pathname}, pathIsPublic=${pathIsPublic}`);

        // If user is not authenticated and is trying to access a private page,
        // redirect to the login page.
        if (!isAuthenticated && !pathIsPublic) {
            router.push('/auth/login');
        }

        // If user is authenticated and tries to access a public page (like login),
        // redirect them to the home page.
        if (isAuthenticated && pathIsPublic) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    // While loading authentication status, show a full-page loader
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen w-full"><BarLoader color="#8B5CF6" /></div>;
    }

    // If the route is public, or if the user is authenticated, render the children.

    if (publicPaths.includes(pathname ?? '') || isAuthenticated) {
        return <>{children}</>;
    }

    // This state is temporary while redirecting
    return <div className="flex items-center justify-center h-screen w-full"><BarLoader color="#8B5CF6" /></div>;
}