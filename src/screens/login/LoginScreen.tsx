import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { bypassLogin, signInWithGoogle, signInWithGoogleMock } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(true);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Brand Icon */}
        <div className="w-20 h-20 bg-[#0061A4] text-white rounded-3xl shadow-xl flex items-center justify-center mb-6 ring-4 ring-[#D1E4FF]/60">
          <span className="text-3xl font-black tracking-tighter">LH</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1A1C1E] tracking-tight">Lewi House</h1>
        <p className="text-sm text-[#43474E] mt-1 font-medium">Property Management System</p>

        <div className="w-full mt-10 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-[#0061A4]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-[#D1E4FF] hover:bg-[#c3dcfe] active:scale-[0.98] text-[#001D36] font-bold text-base rounded-2xl transition-all shadow-xs flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          {showDemoOptions && (
            <div className="mt-8 pt-6 border-t border-[#C3C7CF]/30 bg-[#F3F0F5] p-4 rounded-2xl text-left">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-extrabold text-[#1A1C1E] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#0061A4]" />
                <span>Emulator / Quick Role Bypass</span>
              </div>
              <p className="text-xs text-[#43474E] mb-3">
                Select an account role to explore the full platform instantly:
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => bypassLogin('ADMIN')}
                  className="py-2.5 px-2 bg-[#0061A4] hover:bg-[#00518a] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Admin
                </button>
                <button
                  onClick={() => bypassLogin('TENANT')}
                  className="py-2.5 px-2 bg-[#21005D] hover:bg-[#1a0049] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Tenant
                </button>
                <button
                  onClick={() => bypassLogin('DEVELOPER')}
                  className="py-2.5 px-2 bg-[#1A1C1E] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Developer
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-[#43474E] pt-4 font-medium">
            Secure access for Tenants and Management
          </p>
        </div>
      </div>
    </div>
  );
};
