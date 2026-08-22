import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Search,
  Code,
  CircleDot,
  GitPullRequest,
  PlayCircle,
  FolderGit2,
  Settings,
  ChevronLeft,
  Copy,
  Check,
  Moon,
  Sun,
  Sparkles,
  Layers,
  Palette,
  Type,
  MousePointerClick
} from 'lucide-react';

export const FoundationsDesignSystemScreen: React.FC = () => {
  const { setCurrentTab, userRole, isDarkMode, toggleDarkMode } = useApp();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'preview' | 'tokens' | 'interactive'>('preview');
  const [customText, setCustomText] = useState('The quick brown fox jumps over the lazy dog');
  const [iconStrokeWidth, setIconStrokeWidth] = useState<number>(1.5);
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleBack = () => {
    if (userRole === 'DEVELOPER') {
      setCurrentTab('DEV_HOME');
    } else if (userRole === 'TENANT') {
      setCurrentTab('HOME');
    } else {
      setCurrentTab('DASHBOARD');
    }
  };

  const darkSwatches = [
    { name: 'Primary', token: 'DarkNavyPrimary', hex: '#4F46E5', bgClass: 'bg-[#4F46E5]', desc: 'Brand accent & prominent CTAs' },
    { name: 'Secondary', token: 'DarkNavySecondary', hex: '#D97706', bgClass: 'bg-[#D97706]', desc: 'Amber gold highlight & secondary states' },
    { name: 'Tertiary', token: 'Emerald500', hex: '#10B981', bgClass: 'bg-[#10B981]', desc: 'Success indicators & ghost accents' },
    { name: 'Background', token: 'DarkNavyBg', hex: '#0A0F1E', bgClass: 'bg-[#0A0F1E]', borderClass: 'border-gray-600', desc: 'Main dark workspace canvas' },
    { name: 'Surface', token: 'DarkNavySurface', hex: '#1E293B', bgClass: 'bg-[#1E293B]', borderClass: 'border-gray-700', desc: 'Elevated containers and cards' },
    { name: 'Light Text', token: '#E2E8F0', hex: '#E2E8F0', bgClass: 'bg-[#E2E8F0]', desc: 'Primary typography color' }
  ];

  const lightSwatches = [
    { name: 'Navy 800', token: 'Primary', hex: '#1E3A8A', bgClass: 'bg-[#1E3A8A]', borderClass: 'border-gray-300' },
    { name: 'Gold 500', token: 'Secondary', hex: '#EAB308', bgClass: 'bg-[#EAB308]', borderClass: 'border-gray-300' },
    { name: 'SleekBg', token: 'Background', hex: '#F8FAFC', bgClass: 'bg-[#F8FAFC]', borderClass: 'border-gray-300' }
  ];

  const iconsList = [
    { name: 'Home', icon: Home },
    { name: 'Search', icon: Search },
    { name: 'Code', icon: Code },
    { name: 'Issues', icon: CircleDot },
    { name: 'Pull\nRequests', icon: GitPullRequest, multiLine: true },
    { name: 'Actions', icon: PlayCircle },
    { name: 'Projects', icon: FolderGit2 },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#E2E8F0] pb-16 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] selection:bg-[#4F46E5] selection:text-white">
      {/* BEGIN: Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.15)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-[#4F46E5] hover:text-[#6366F1] font-medium text-[17px] gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            Back
          </button>
          
          <h1 className="text-[17px] font-semibold text-white truncate max-w-[200px] sm:max-w-none text-center">
            Foundations Design System
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              title="Toggle Theme"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
              title="View repository"
            >
              <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </header>
      {/* END: Top Navigation Bar */}

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Subtitle & Header Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[15px] text-[#E2E8F0] opacity-90">
              <span className="font-semibold text-white">lewihouse-v2</span> Design System Documentation
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Production design foundations, color tokens, typography scales, icon guidelines, and component states.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePlaygroundTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePlaygroundTab === 'preview'
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActivePlaygroundTab('tokens')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePlaygroundTab === 'tokens'
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              CSS Variables
            </button>
            <button
              onClick={() => setActivePlaygroundTab('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activePlaygroundTab === 'interactive'
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Live Tester
            </button>
          </div>
        </div>

        {copiedHex && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#10B981] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-4 h-4" />
            <span>Copied {copiedHex} to clipboard</span>
          </div>
        )}

        <hr className="border-gray-800" />

        {activePlaygroundTab === 'tokens' ? (
          /* CSS Variables & Tokens Tab */
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h2">Design System Tokens</h2>
              <button
                onClick={() =>
                  copyToClipboard(
                    `:root {\n  --dark-navy-primary: #4F46E5;\n  --dark-navy-secondary: #D97706;\n  --emerald-500: #10B981;\n  --dark-navy-bg: #0A0F1E;\n  --dark-navy-surface: #1E293B;\n  --system-light-text: #E2E8F0;\n}`
                  )
                }
                className="text-xs font-medium text-[#4F46E5] hover:text-[#6366F1] flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy CSS Tokens
              </button>
            </div>
            <pre className="p-4 bg-[#1E293B] border border-gray-800 rounded-2xl text-xs font-mono text-gray-300 overflow-x-auto">
{`/* Foundations Design System (lewihouse-v2) */
:root {
  /* Dark Theme Palette */
  --system-bg: #0A0F1E;
  --dark-navy-primary: #4F46E5;
  --dark-navy-secondary: #D97706;
  --emerald-500: #10B981;
  --dark-navy-bg: #0A0F1E;
  --dark-navy-surface: #1E293B;

  /* Light Theme Palette */
  --light-navy-800: #1E3A8A;
  --light-gold-500: #EAB308;
  --light-sleek-bg: #F8FAFC;

  /* System Semantics */
  --system-light-text: #E2E8F0;
  --system-green: #10B981;
  --system-orange: #F59E0B;
  --system-red: #EF4444;
  --system-gray: #334155;
  --system-divider: rgba(255, 255, 255, 0.15);
}`}
            </pre>
          </section>
        ) : activePlaygroundTab === 'interactive' ? (
          /* Live Tester Playground */
          <section className="space-y-6">
            <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-[#4F46E5]" />
                  Live Typography Tester
                </h3>
                <span className="text-xs text-gray-400">Type below to preview SF Pro styling</span>
              </div>
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Type sample text..."
                className="w-full px-4 py-2.5 bg-[#0A0F1E] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4F46E5]"
              />

              <div className="space-y-4 pt-2 border-t border-gray-800">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">H1 Display Bold 28pt</span>
                  <p className="text-h1 text-white">{customText || 'Heading 1 Preview'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">H2 Display Semibold 22pt</span>
                  <p className="text-h2 text-white">{customText || 'Heading 2 Preview'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">H3 Text Medium 18pt</span>
                  <p className="text-h3 text-white">{customText || 'Heading 3 Preview'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Body Text Regular 16pt</span>
                  <p className="text-body text-gray-300">{customText || 'Body text regular preview...'}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 text-white flex items-center gap-2">
                  <MousePointerClick className="w-5 h-5 text-[#D97706]" />
                  Interactive Button Tester
                </h3>
                <span className="text-xs text-gray-400">Total clicks: {buttonClickCount}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setButtonClickCount(c => c + 1)}
                  className="bg-[#4F46E5] hover:bg-[#3730A3] active:scale-95 text-white py-2 px-5 rounded-md font-medium text-[15px] transition-all cursor-pointer shadow-sm"
                >
                  Primary CTA (+1)
                </button>
                <button
                  onClick={() => setButtonClickCount(c => c + 1)}
                  className="bg-transparent border border-[#D97706] hover:bg-[#451A03] hover:text-[#FCD34D] active:scale-95 text-[#D97706] py-2 px-5 rounded-md font-medium text-[15px] transition-all cursor-pointer"
                >
                  Secondary Action
                </button>
                <button
                  onClick={() => setButtonClickCount(c => c + 1)}
                  className="bg-transparent text-[#10B981] hover:text-white hover:underline py-2 px-5 font-medium text-[15px] transition-all cursor-pointer"
                >
                  Ghost Link
                </button>
                <button
                  onClick={() => setButtonClickCount(0)}
                  className="text-xs text-gray-500 hover:text-gray-300 underline ml-auto"
                >
                  Reset Count
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Standard Design System Specimen */
          <>
            {/* BEGIN: Color Palette Section (Dark Theme) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h2">Color Palette (Dark Theme)</h2>
                <span className="text-xs text-gray-400">Click any swatch to copy HEX</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                {darkSwatches.map(swatch => (
                  <div
                    key={swatch.token}
                    onClick={() => copyToClipboard(swatch.hex)}
                    className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-transparent hover:border-gray-700 transition-all cursor-pointer group"
                    title={`Click to copy ${swatch.hex}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-md ${swatch.bgClass} flex-shrink-0 border ${
                        swatch.borderClass || 'border-gray-700'
                      } group-hover:scale-105 transition-transform flex items-center justify-center`}
                    >
                      {copiedHex === swatch.hex && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white flex items-center justify-between">
                        <span>{swatch.name}</span>
                        <span className="text-[11px] font-mono text-gray-400 group-hover:text-white">{swatch.hex}</span>
                      </p>
                      <p className="text-xs text-gray-400 truncate">{swatch.token}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* END: Color Palette Section */}

            <hr className="border-gray-800" />

            {/* BEGIN: Light Theme Colors */}
            <section>
              <h2 className="text-h2 mb-4">Color Palette (Light Theme)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 bg-white p-4 rounded-xl border border-gray-700">
                {lightSwatches.map(swatch => (
                  <div
                    key={swatch.name}
                    onClick={() => copyToClipboard(swatch.hex)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-md ${swatch.bgClass} flex-shrink-0 border ${
                        swatch.borderClass || 'border-gray-300'
                      } group-hover:scale-105 transition-transform flex items-center justify-center`}
                    >
                      {copiedHex === swatch.hex && <Check className="w-4 h-4 text-gray-800" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <span>{swatch.name}</span>
                        <span className="text-[11px] font-mono text-gray-500">{swatch.hex}</span>
                      </p>
                      <p className="text-xs text-gray-500">{swatch.token}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* END: Light Theme Colors */}

            <hr className="border-gray-800" />

            {/* BEGIN: Typography Section */}
            <section className="py-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h2">Typography</h2>
                <span className="text-xs text-gray-400">SF Pro Display & SF Pro Text</span>
              </div>
              <div className="space-y-6 bg-[#1E293B]/40 p-5 rounded-2xl border border-gray-800">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">28px / 34px / Bold</span>
                  <p className="text-h1 text-white">Heading 1 - SF Pro Display Bold 28pt</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">22px / 28px / Semibold</span>
                  <p className="text-h2 text-white">Heading 2 - SF Pro Display Semibold 22pt</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">18px / 24px / Medium</span>
                  <p className="text-h3 text-white">Heading 3 - SF Pro Text Medium 18pt</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">16px / 22px / Regular</span>
                  <p className="text-body text-[#E2E8F0] opacity-90 max-w-2xl">
                    Body Text - SF Pro Text Regular 16pt. This is an example of the body text style used throughout the lewihouse design system.
                  </p>
                </div>
              </div>
            </section>
            {/* END: Typography Section */}

            <hr className="border-gray-800" />

            {/* BEGIN: Icon Styles Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h2 text-[#10B981]">Icon Styles</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Stroke:</span>
                  {[1.5, 2.0, 2.5].map(w => (
                    <button
                      key={w}
                      onClick={() => setIconStrokeWidth(w)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        iconStrokeWidth === w ? 'bg-[#10B981] text-black font-bold' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-y-6 gap-x-2 text-center text-[#D97706] bg-[#1E293B]/30 p-6 rounded-2xl border border-gray-800">
                {iconsList.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="p-3 rounded-xl bg-white/[0.04] group-hover:bg-[#D97706]/10 group-hover:scale-110 transition-all">
                        <IconComp
                          className="w-6 h-6 text-[#D97706]"
                          strokeWidth={iconStrokeWidth}
                        />
                      </div>
                      <span className="text-xs text-[#E2E8F0] whitespace-pre-line leading-tight">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
            {/* END: Icon Styles Section */}

            <hr className="border-gray-800" />

            {/* BEGIN: Button States Section */}
            <section>
              <h2 className="text-h2 mb-4">Button States</h2>
              <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-gray-800 overflow-x-auto">
                <div className="min-w-[420px] grid grid-cols-3 gap-x-4 gap-y-5 items-end text-center">
                  {/* Headers */}
                  <h3 className="text-base font-semibold text-left text-white mb-1">Primary</h3>
                  <h3 className="text-base font-semibold text-left text-white mb-1 pl-1">Secondary</h3>
                  <h3 className="text-base font-semibold text-white mb-1">Ghost</h3>

                  {/* Normal Row */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Normal</span>
                    <button className="w-full bg-[#4F46E5] text-white py-2 px-4 rounded-md font-medium text-[15px] shadow-sm">
                      Normal
                    </button>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Normal</span>
                    <button className="w-full bg-transparent border border-[#D97706] text-[#D97706] py-2 px-4 rounded-md font-medium text-[15px]">
                      Normal
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Normal</span>
                    <button className="bg-transparent text-[#10B981] py-2 px-4 font-medium text-[15px]">
                      Normal
                    </button>
                  </div>

                  {/* Hover Row */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Hover</span>
                    <button className="w-full bg-[#3730A3] text-white py-2 px-4 rounded-md font-medium text-[15px]">
                      Hover
                    </button>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Hover</span>
                    <button className="w-full bg-[#451A03] border border-[#D97706] text-[#FCD34D] py-2 px-4 rounded-md font-medium text-[15px]">
                      Hover
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Hover</span>
                    <button className="bg-transparent text-white border-b border-white py-2 px-4 font-medium text-[15px] inline-block mx-auto w-max underline">
                      Hover
                    </button>
                  </div>

                  {/* Disabled Row */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Disabled</span>
                    <button disabled className="w-full bg-[#818CF8] text-[#1E293B] opacity-90 py-2 px-4 rounded-md font-medium text-[15px] cursor-not-allowed">
                      Disabled
                    </button>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Disabled</span>
                    <button disabled className="w-full bg-transparent border border-gray-600 text-[#9CA3AF] py-2 px-4 rounded-md font-medium text-[15px] opacity-70 cursor-not-allowed">
                      Disabled
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Disabled</span>
                    <button disabled className="bg-transparent text-gray-500 py-2 px-4 font-medium text-[15px] cursor-not-allowed">
                      Disabled
                    </button>
                  </div>
                </div>
              </div>
            </section>
            {/* END: Button States Section */}
          </>
        )}

        <hr className="border-[rgba(255,255,255,0.15)]" />

        {/* BEGIN: Footer */}
        <footer className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 GITHUB, INC.</span>
            <a className="text-[#4F46E5] hover:underline" href="#">TERMS</a>
            <a className="text-[#4F46E5] hover:underline" href="#">PRIVACY</a>
            <a className="text-[#4F46E5] hover:underline" href="#">MANAGE COOKIES</a>
          </div>
          <div className="flex gap-4 items-center">
            {/* Facebook */}
            <a href="#" className="hover:text-gray-300 transition-colors" title="Facebook">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" className="hover:text-gray-300 transition-colors" title="Twitter / X">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="hover:text-gray-300 transition-colors" title="YouTube">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385-8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" className="hover:text-gray-300 transition-colors" title="GitHub">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </a>
          </div>
        </footer>
        {/* END: Footer */}
      </main>
    </div>
  );
};
