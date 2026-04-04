'use client'

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                router.push('/auth/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        performLogout();
    }, [logout, router]);

    return null;
}