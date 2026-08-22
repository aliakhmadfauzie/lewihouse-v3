import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import {
  Settings,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Sliders,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export const DeveloperDashboardScreen: React.FC = () => {
  const { featureFlags, updateFeatureFlags, seedData, clearData } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSeed = () => {
    seedData();
    showToast('Database reset and seeded with initial demo data.');
  };

  const handleClear = () => {
    clearData();
    showToast('All local storage and cached records cleared.');
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title="Developer Console" />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-[#D1E4FF] text-[#001D36] flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#0061A4] shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Feature Toggles */}
        <section className="rounded-3xl bg-white border border-[#C3C7CF]/30 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#C3C7CF]/20">
            <div className="p-2 bg-[#F3F0F5] text-[#1A1C1E] rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1C1E]">Feature Flags & Overrides</h2>
              <p className="text-xs text-[#43474E]">Live runtime environment toggles</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Bypass Auth */}
            <div className="flex items-center justify-between p-3 bg-[#F3F0F5] rounded-2xl">
              <div>
                <span className="text-xs font-bold text-[#1A1C1E] block">Bypass Authentication</span>
                <span className="text-[11px] text-[#43474E] block">
                  Enable rapid role-switching without credentials
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={featureFlags.bypassAuth}
                  onChange={e => updateFeatureFlags({ bypassAuth: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#C3C7CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0061A4]"></div>
              </label>
            </div>

            {/* Verbose Logging */}
            <div className="flex items-center justify-between p-3 bg-[#F3F0F5] rounded-2xl">
              <div>
                <span className="text-xs font-bold text-[#1A1C1E]">Verbose Logging</span>
                <span className="text-[11px] text-[#43474E] block">
                  Output repository flows and transactions to console
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={featureFlags.verboseLogging}
                  onChange={e => updateFeatureFlags({ verboseLogging: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#C3C7CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0061A4]"></div>
              </label>
            </div>

            {/* Mock Data Mode */}
            <div className="flex items-center justify-between p-3 bg-[#F3F0F5] rounded-2xl">
              <div>
                <span className="text-xs font-bold text-[#1A1C1E]">Mock Data Persistence</span>
                <span className="text-[11px] text-[#43474E] block">
                  Use isolated local browser memory for storage
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={featureFlags.mockDataMode}
                  onChange={e => updateFeatureFlags({ mockDataMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#C3C7CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0061A4]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Database Management */}
        <section className="rounded-3xl bg-white border border-[#C3C7CF]/30 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#C3C7CF]/20">
            <div className="p-2 bg-[#D1E4FF] text-[#001D36] rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1C1E]">Data Operations</h2>
              <p className="text-xs text-[#43474E]">Manage testing seeds & records</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSeed}
              className="py-3 px-4 bg-[#0061A4] hover:bg-[#00518a] active:scale-[0.98] text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Seed Initial Data
            </button>

            <button
              onClick={handleClear}
              className="py-3 px-4 bg-transparent border-2 border-[#BA1A1A] hover:bg-[#BA1A1A]/5 active:scale-[0.98] text-[#BA1A1A] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear All Data
            </button>
          </div>
        </section>

        {/* System Diagnostic Information */}
        <section className="rounded-3xl bg-[#1A1C1E] text-white p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-[#D1E4FF]" />
            <span>Diagnostics</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono text-white/90">
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-white/60">Platform:</span>
              <span>Web (React 18 + Vite)</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-1">
              <span className="text-white/60">Port:</span>
              <span>3000 (0.0.0.0)</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-1">
              <span className="text-white/60">Build Mode:</span>
              <span>SPA Production-Ready</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-1">
              <span className="text-white/60">Cloud Database:</span>
              <span className="text-[#9ECAFF] font-bold">Firebase Firestore</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-1">
              <span className="text-white/60">Firestore Region:</span>
              <span>europe-west2</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-white/60">Architecture:</span>
              <span>TypeScript + Tailwind CSS</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
