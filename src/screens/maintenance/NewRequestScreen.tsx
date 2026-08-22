import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Camera, AlertOctagon, Check, Image as ImageIcon, X } from 'lucide-react';

interface NewRequestScreenProps {
  onBack: () => void;
}

export const NewRequestScreen: React.FC<NewRequestScreenProps> = ({ onBack }) => {
  const { units, addMaintenanceRequest, currentResident, t, language } = useApp();

  const [unit, setUnit] = useState(currentResident?.room || units[0]?.unitNumber || 'Unit 101');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isEmergency, setIsEmergency] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const PRESET_EVIDENCE_PHOTOS = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    addMaintenanceRequest({
      unit,
      issue: issue.trim(),
      description: description.trim(),
      priority: isEmergency ? 'High' : priority,
      isEmergency,
      photoUrl: photoUrl || undefined
    });

    onBack();
  };

  const getPriorityName = (p: 'Low' | 'Medium' | 'High') => {
    if (p === 'High') return t.statusHigh;
    if (p === 'Medium') return t.statusMedium;
    return t.statusLow;
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3.5 bg-[#FDFBFF] border-b border-[#C3C7CF]/20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-[#1A1C1E] hover:bg-[#F3F0F5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-[#1A1C1E]">{t.newRequestTitle}</h1>
      </header>

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unit Selection */}
          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">{t.newRequestUnitLabel}</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F3F0F5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0061A4] text-[#1A1C1E]"
            >
              {units.map(u => (
                <option key={u.id} value={u.unitNumber}>
                  {u.unitNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.newRequestIssueLabel} <span className="text-[#BA1A1A]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={t.newRequestIssuePlaceholder}
              value={issue}
              onChange={e => setIssue(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4] focus:ring-1 focus:ring-[#0061A4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.newRequestDescLabel}
            </label>
            <textarea
              rows={3}
              placeholder={t.newRequestDescPlaceholder}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4] focus:ring-1 focus:ring-[#0061A4]"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1.5">{t.newRequestPriorityLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    priority === p
                      ? 'bg-[#0061A4] text-white border-[#0061A4] shadow-xs'
                      : 'bg-white text-[#43474E] border-[#C3C7CF] hover:bg-[#F3F0F5]'
                  }`}
                >
                  {getPriorityName(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1.5">
              {t.newRequestPhotoLabel}
            </label>
            {photoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#C3C7CF] aspect-video max-h-48">
                <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#F3F0F5] rounded-2xl space-y-2">
                <span className="text-[11px] text-[#43474E] block">
                  {language === 'ID' ? 'Pilih contoh foto masalah:' : 'Select sample photo of issue:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_EVIDENCE_PHOTOS.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoUrl(src)}
                      className="rounded-xl overflow-hidden aspect-square border border-[#C3C7CF] hover:opacity-80 active:scale-95"
                    >
                      <img src={src} alt="Preset evidence" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Switch */}
          <div className="p-4 rounded-2xl bg-[#FFB4AB]/30 border border-[#FFB4AB] flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertOctagon className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#690005] block">
                  {language === 'ID' ? 'Tandai sebagai Kasus Darurat' : 'Mark as Urgent Emergency'}
                </span>
                <span className="text-[11px] text-[#690005]/80 leading-tight block">
                  {language === 'ID' ? 'Langsung mengirim notifikasi ke pengelola kos yang bertugas' : 'Directly notifies on-duty building manager'}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={e => setIsEmergency(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#C3C7CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BA1A1A]"></div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#0061A4] hover:bg-[#00518a] active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> {t.newRequestSubmitBtn}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
