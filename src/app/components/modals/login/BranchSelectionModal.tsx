// src/app/components/modals/BranchSelectionModal.tsx
'use client';
import { useAuth } from '@/app/context/AuthContext';

type PosProfile = {
    name: string;
    company?: string;
    warehouse?: string;
};

export default function BranchSelectionModal() {
    // The modal grabs exactly what it needs from the context
    const { availableProfiles, selectProfile } = useAuth();

    // If there are no profiles to select, don't render the modal at all
    if (!availableProfiles || availableProfiles.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Select Register</h2>
                <p className="text-gray-500 mb-6">Where are you working today?</p>
                
                <div className="flex flex-col gap-3">
                    {availableProfiles.map((profile: PosProfile) => (
                        <button 
                            key={profile.name}
                            onClick={() => selectProfile(profile.name)}
                            className="text-left px-6 py-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-gray-700 flex justify-between items-center"
                        >
                            {profile.name}
                            <span className="text-blue-500">→</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}