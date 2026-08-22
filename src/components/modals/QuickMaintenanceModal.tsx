import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wrench, AlertOctagon, Sparkles } from 'lucide-react';

interface QuickMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickMaintenanceModal: React.FC<QuickMaintenanceModalProps> = ({ isOpen, onClose }) => {
  const { addMaintenanceRequest, units, language, t } = useApp();

  const [unit, setUnit] = useState(units[0]?.unitNumber || 'Room 101');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setIsSubmitting(true);
    try {
      addMaintenanceRequest({
        unit,
        issue: issue.trim(),
        description: description.trim() || undefined,
        priority: isEmergency ? 'High' : priority,
        isEmergency,
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
      });

      setIssue('');
      setDescription('');
      setPriority('Medium');
      setIsEmergency(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FDFBFF] dark:bg-[#1E2024] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 dark:border-[#44474F]/40 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#FFDDAE] dark:bg-[#783800] text-[#2A1800] dark:text-[#FFDCC2]">
              <Wrench className="w-5 h-5 text-[#825500] dark:text-[#FFB951]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1A1C1E] dark:text-[#E2E2E6]">
                {language === 'ID' ? 'Buat Tiket Perbaikan' : 'New Maintenance Ticket'}
              </h2>
              <p className="text-[11px] text-[#43474E] dark:text-[#8E9099]">
                {language === 'ID' ? 'Lapor kerusakan fasilitas kos' : 'Report repair issue for room or facility'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          {/* Unit Select */}
          <div>
            <label className="block text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] mb-1.5">
              {language === 'ID' ? 'Pilih Kamar / Fasilitas' : 'Select Room / Unit'}
            </label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] bg-white dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0061A4]"
            >
              {units.map(u => (
                <option key={u.id} value={u.unitNumber}>
                  {u.unitNumber} ({u.type}) {u.isOccupied ? '• Terisi' : '• Kosong'}
                </option>
              ))}
              <option value="Common Area (Lobi / Dapur)">Common Area (Lobi / Dapur)</option>
              <option value="Area Parkir / Gerbang">Area Parkir / Gerbang</option>
              <option value="Roof / Pompa Air">Roof / Pompa Air</option>
            </select>
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] mb-1.5">
              {language === 'ID' ? 'Judul Kerusakan / Keluhan' : 'Issue Summary'} *
            </label>
            <input
              type="text"
              required
              value={issue}
              onChange={e => setIssue(e.target.value)}
              placeholder={language === 'ID' ? 'Contoh: AC tidak dingin, keran bocor...' : 'e.g. AC not cooling, leaking pipe...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] bg-white dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0061A4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] mb-1.5">
              {language === 'ID' ? 'Keterangan Tambahan (Opsional)' : 'Description (Optional)'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={language === 'ID' ? 'Detail keluhan atau waktu ketersediaan teknisi...' : 'Provide additional repair context...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] bg-white dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0061A4]"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] mb-1.5">
              {language === 'ID' ? 'Tingkat Prioritas' : 'Priority Level'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    priority === p && !isEmergency
                      ? p === 'High'
                        ? 'bg-[#FFDAD6] text-[#410002] border-[#BA1A1A]'
                        : p === 'Medium'
                        ? 'bg-[#FFDDAE] text-[#2A1800] border-[#825500]'
                        : 'bg-[#D4F7DC] text-[#005221] border-[#008938]'
                      : 'bg-white dark:bg-[#121316] text-[#43474E] dark:text-[#C4C6D0] border-[#C3C7CF]/40 dark:border-[#44474F]'
                  }`}
                >
                  {p === 'High'
                    ? (language === 'ID' ? 'Tinggi' : 'High')
                    : p === 'Medium'
                    ? (language === 'ID' ? 'Sedang' : 'Medium')
                    : (language === 'ID' ? 'Rendah' : 'Low')}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Alert Toggle */}
          <div
            onClick={() => setIsEmergency(prev => !prev)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isEmergency
                ? 'bg-[#FFDAD6]/60 dark:bg-[#93000A]/30 border-[#BA1A1A]'
                : 'bg-[#F3F0F5] dark:bg-[#181A1E] border-[#C3C7CF]/30 dark:border-[#44474F]/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertOctagon className={`w-4 h-4 ${isEmergency ? 'text-[#BA1A1A]' : 'text-[#43474E]'}`} />
              <div>
                <p className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">
                  {language === 'ID' ? 'Status Darurat (Emergency)' : 'Emergency Priority'}
                </p>
                <p className="text-[10px] text-[#43474E] dark:text-[#8E9099]">
                  {language === 'ID' ? 'Kirim notifikasi instan & prioritaskan teknisi' : 'Trigger urgent alert chime & notifications'}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isEmergency}
              onChange={e => setIsEmergency(e.target.checked)}
              className="w-4 h-4 text-[#BA1A1A] accent-[#BA1A1A] rounded"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] transition-colors cursor-pointer"
            >
              {language === 'ID' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !issue.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#0061A4] hover:bg-[#00497D] active:scale-98 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{language === 'ID' ? 'Kirim Tiket' : 'Submit Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
