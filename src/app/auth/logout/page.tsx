'use client'

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const { logout, setUser, setAvailableProfiles, setActivePosProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                const data = await logout();
                console.log('Logout successful:', data);
                setUser(null);
                setAvailableProfiles([]);
                setActivePosProfile(null);
                localStorage.removeItem('active_pos_profile');
                router.push('/auth/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        performLogout();
    }, [logout, router, setUser, setAvailableProfiles, setActivePosProfile]);

    return null;
}