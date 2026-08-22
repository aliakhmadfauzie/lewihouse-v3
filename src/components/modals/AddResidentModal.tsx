import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus } from 'lucide-react';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({ isOpen, onClose }) => {
  const { addResident, units, t, language } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState(units[0]?.unitNumber || 'Room 101');
  const [status, setStatus] = useState<'Paid' | 'Overdue' | 'Pending'>('Paid');
  const [balance, setBalance] = useState('0');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addResident({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+62 812-0000-0000',
      room,
      status,
      balance: parseFloat(balance) || 0,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    setName('');
    setEmail('');
    setPhone('');
    setBalance('0');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FDFBFF] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D1E4FF] text-[#001D36]">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1C1E]">{t.residentsAddModalTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.residentsNameLabel}
            </label>
            <input
              type="text"
              required
              placeholder={t.residentsNamePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.residentsEmailLabel}
            </label>
            <input
              type="email"
              required
              placeholder={t.residentsEmailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.residentsPhoneLabel}
            </label>
            <input
              type="tel"
              placeholder={t.residentsPhonePlaceholder}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {t.residentsUnitLabel}
              </label>
              <select
                value={room}
                onChange={e => setRoom(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              >
                {units.map(u => (
                  <option key={u.id} value={u.unitNumber}>
                    {u.unitNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {t.residentsStatusLabel}
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              >
                <option value="Paid">{t.statusPaid}</option>
                <option value="Pending">{t.statusPending}</option>
                <option value="Overdue">{t.statusOverdue}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.residentsBalanceLabel}
            </label>
            <input
              type="number"
              value={balance}
              onChange={e => setBalance(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#C3C7CF]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#C3C7CF] text-xs font-bold text-[#43474E] hover:bg-[#F3F0F5]"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0061A4] text-white text-xs font-bold hover:bg-[#00518a] shadow-xs"
            >
              {t.residentsSubmitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
