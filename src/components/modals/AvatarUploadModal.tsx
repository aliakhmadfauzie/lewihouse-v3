import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, Image as ImageIcon, Check } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
];

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose }) => {
  const { currentResident, uploadProfilePhoto } = useApp();
  const [customUrl, setCustomUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    const chosen = selectedPreset || customUrl;
    if (!chosen) return;
    setLoading(true);
    await uploadProfilePhoto(chosen);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FDFBFF] dark:bg-[#191C20] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 dark:border-[#44474F]/40 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D1E4FF] dark:bg-[#00497D] text-[#001D36] dark:text-[#D1E4FF]">
              <Camera className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">Update Profile Photo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#22262D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-2">
              Choose Preset Photo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(url);
                    setCustomUrl('');
                  }}
                  className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedPreset === url
                      ? 'border-[#0061A4] dark:border-[#9ECAFF] ring-2 ring-[#0061A4]/30 scale-105'
                      : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                  {selectedPreset === url && (
                    <div className="absolute inset-0 bg-[#0061A4]/40 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
              Or Custom Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={customUrl}
              onChange={e => {
                setCustomUrl(e.target.value);
                setSelectedPreset(null);
              }}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#22262D] border border-[#C3C7CF] dark:border-[#44474F] text-[#1A1C1E] dark:text-[#E2E2E6] rounded-xl text-sm focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#C3C7CF]/20 dark:border-[#44474F]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#C3C7CF] dark:border-[#44474F] text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#22262D]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || (!selectedPreset && !customUrl)}
              className="px-5 py-2.5 rounded-xl bg-[#0061A4] text-white text-xs font-bold hover:bg-[#00518a] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Photo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
