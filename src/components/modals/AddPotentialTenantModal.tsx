import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TenantLeadSource } from '../../types';
import {
  X,
  UserPlus,
  Compass,
  MessageSquare,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AddPotentialTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const POPULAR_SOURCES: { label: TenantLeadSource; iconText: string; color: string; bg: string }[] = [
  { label: 'Mamikos', iconText: '🏡 Mamikos', color: 'text-[#008938]', bg: 'bg-[#D4F7DC] border-[#008938]/30' },
  { label: 'Instagram', iconText: '📸 Instagram', color: 'text-[#D62976]', bg: 'bg-[#FDE2EC] border-[#D62976]/30' },
  { label: 'WhatsApp', iconText: '💬 WhatsApp Direct', color: 'text-[#128C7E]', bg: 'bg-[#DCF8C6] border-[#128C7E]/30' },
  { label: 'OLX', iconText: '🏷️ OLX Kos', color: 'text-[#7B1FA2]', bg: 'bg-[#F3E5F5] border-[#7B1FA2]/30' },
  { label: 'Google Maps', iconText: '📍 Google Maps', color: 'text-[#1976D2]', bg: 'bg-[#E3F2FD] border-[#1976D2]/30' },
  { label: 'Direct Walk-in', iconText: '🚶 Direct Walk-in', color: 'text-[#E65100]', bg: 'bg-[#FFE0B2] border-[#E65100]/30' },
  { label: 'Facebook Marketplace', iconText: '👥 Facebook', color: 'text-[#1877F2]', bg: 'bg-[#E7F3FF] border-[#1877F2]/30' },
  { label: 'TikTok', iconText: '🎵 TikTok', color: 'text-[#000000]', bg: 'bg-[#EEEEEE] border-[#000000]/30' },
  { label: 'Referral', iconText: '🤝 Friend Referral', color: 'text-[#0061A4]', bg: 'bg-[#D1E4FF] border-[#0061A4]/30' },
  { label: 'Other', iconText: '✨ Other Platform', color: 'text-[#43474E]', bg: 'bg-[#F3F0F5] border-[#C3C7CF]' }
];

export const AddPotentialTenantModal: React.FC<AddPotentialTenantModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addPotentialTenant, units, language, t } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<TenantLeadSource | string>('Mamikos');
  const [customSource, setCustomSource] = useState('');
  const [sourceDetails, setSourceDetails] = useState('');
  const [targetUnit, setTargetUnit] = useState(units[0]?.unitNumber || 'Room 101');
  const [budget, setBudget] = useState('2500000');
  const [expectedMoveInDate, setExpectedMoveInDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'New' | 'Viewing Scheduled' | 'Follow Up' | 'Converted'>('New');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const finalSource = source === 'Other' && customSource.trim() ? customSource.trim() : source;

    addPotentialTenant({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source: finalSource,
      sourceDetails: sourceDetails.trim() || undefined,
      targetUnit: targetUnit || undefined,
      budget: budget ? parseFloat(budget) : undefined,
      expectedMoveInDate: expectedMoveInDate || undefined,
      notes: notes.trim() || undefined,
      status
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setName('');
      setPhone('');
      setEmail('');
      setSource('Mamikos');
      setCustomSource('');
      setSourceDetails('');
      setNotes('');
      if (onSuccess) onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FDFBFF] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95 my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F7DC] text-[#008938] flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1C1E] tracking-tight">{t.addLeadTitle}</h2>
              <p className="text-xs text-[#43474E]">{t.addLeadSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {showSuccessToast && (
          <div className="mt-3 p-3 bg-[#D4F7DC] border border-[#008938]/30 rounded-2xl text-[#005221] text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#008938]" />
            <span>{t.addLeadSuccessMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Source Selection Grid */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-[#1A1C1E] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#0061A4]" />
              {t.addLeadSourceLabel} <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_SOURCES.map(s => {
                const isSelected = source === s.label;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSource(s.label)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all text-left ${
                      isSelected
                        ? `${s.bg} ring-2 ring-[#0061A4] ${s.color} shadow-xs font-black`
                        : 'bg-white border-[#C3C7CF]/50 text-[#43474E] hover:bg-[#F3F0F5]'
                    }`}
                  >
                    <span>{s.iconText}</span>
                  </button>
                );
              })}
            </div>

            {source === 'Other' && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="text"
                  required
                  placeholder={t.addLeadCustomSourcePlaceholder}
                  value={customSource}
                  onChange={e => setCustomSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#0061A4] rounded-xl text-xs font-bold text-[#1A1C1E] focus:outline-none"
                />
              </div>
            )}

            <div className="pt-1">
              <input
                type="text"
                placeholder={t.addLeadSourceDetailsPlaceholder}
                value={sourceDetails}
                onChange={e => setSourceDetails(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#C3C7CF]/60 rounded-xl text-xs text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-1 border-t border-[#C3C7CF]/20">
            <h4 className="text-xs font-extrabold text-[#1A1C1E] uppercase tracking-wider">
              {language === 'ID' ? 'Kontak Calon Penghuni' : 'Prospect Contact Information'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1">
                  {t.addLeadNameLabel} <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.addLeadNamePlaceholder}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-xs font-bold text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1">
                  {t.addLeadPhoneLabel} <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t.addLeadPhonePlaceholder}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-xs font-bold text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {t.addLeadEmailLabel}
              </label>
              <input
                type="email"
                placeholder={t.addLeadEmailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#C3C7CF] rounded-xl text-xs text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
              />
            </div>
          </div>

          {/* Unit & Financial Preferences */}
          <div className="space-y-3 pt-1 border-t border-[#C3C7CF]/20">
            <h4 className="text-xs font-extrabold text-[#1A1C1E] uppercase tracking-wider">
              {language === 'ID' ? 'Kebutuhan Kamar & Jadwal Masuk' : 'Unit & Move-in Preference'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#0061A4]" /> {t.addLeadTargetUnitLabel}
                </label>
                <select
                  value={targetUnit}
                  onChange={e => setTargetUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-xs font-bold text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
                >
                  <option value="">{language === 'ID' ? 'Kamar Apa Saja yang Tersedia' : 'Any Available Room'}</option>
                  {units.map(u => (
                    <option key={u.id} value={u.unitNumber}>
                      {u.unitNumber} ({u.type}) - {u.isOccupied ? (language === 'ID' ? 'Terisi' : 'Occupied') : (language === 'ID' ? 'Kosong' : 'Vacant')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0061A4]" /> {t.addLeadMoveInDateLabel}
                </label>
                <input
                  type="date"
                  value={expectedMoveInDate}
                  onChange={e => setExpectedMoveInDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-xs text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#0061A4]" /> {t.addLeadBudgetLabel}
                </label>
                <input
                  type="number"
                  step="100000"
                  placeholder="misal: 2500000"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#C3C7CF] rounded-xl text-xs font-bold text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1">
                  {t.addLeadStatusLabel}
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-white border border-[#C3C7CF] rounded-xl text-xs font-bold text-[#1A1C1E] focus:outline-none focus:border-[#0061A4]"
                >
                  <option value="New">🟢 {t.statusNew}</option>
                  <option value="Viewing Scheduled">📅 {t.statusViewingScheduled}</option>
                  <option value="Follow Up">⏳ {t.statusFollowUp}</option>
                  <option value="Converted">✅ {t.statusConverted}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes & Special Requests */}
          <div className="space-y-1.5 pt-1 border-t border-[#C3C7CF]/20">
            <label className="block text-xs font-bold text-[#43474E] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#0061A4]" /> {t.addLeadNotesLabel}
            </label>
            <textarea
              rows={2}
              placeholder={t.addLeadNotesPlaceholder}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#C3C7CF] rounded-xl text-xs text-[#1A1C1E] focus:outline-none focus:border-[#0061A4] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#C3C7CF]/20 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#C3C7CF] text-xs font-bold text-[#43474E] hover:bg-[#F3F0F5]"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0061A4] text-white text-xs font-black hover:bg-[#00518a] shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.addLeadSubmitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
