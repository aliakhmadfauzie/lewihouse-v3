import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface RoomTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomTransferModal: React.FC<RoomTransferModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useApp();
  const [currentRent, setCurrentRent] = useState('2500000');
  const [newRent, setNewRent] = useState('3500000');
  const [daysRemaining, setDaysRemaining] = useState('15');
  const [daysInMonth, setDaysInMonth] = useState('30');
  const [adminFee, setAdminFee] = useState('150000');

  if (!isOpen) return null;

  const curRate = parseFloat(currentRent) || 0;
  const targetRate = parseFloat(newRent) || 0;
  const remDays = parseFloat(daysRemaining) || 0;
  const totalDays = parseFloat(daysInMonth) || 30;
  const fee = parseFloat(adminFee) || 0;

  // Prorated calculation
  const curDaily = curRate / totalDays;
  const targetDaily = targetRate / totalDays;
  const dailyDiff = targetDaily - curDaily;
  const proratedDiff = Math.round(dailyDiff * remDays);
  const totalDue = proratedDiff + fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FDFBFF] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D1E4FF] text-[#001D36]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1C1E]">{t.paymentsTransferCalcTitle}</h2>
              <p className="text-xs text-[#43474E]">{t.paymentsTransferCalcDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {language === 'ID' ? 'Tarif Kamar Lama (Rp)' : 'Current Unit Rate (Rp)'}
              </label>
              <input
                type="number"
                value={currentRent}
                onChange={e => setCurrentRent(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {language === 'ID' ? 'Tarif Kamar Baru (Rp)' : 'New Unit Rate (Rp)'}
              </label>
              <input
                type="number"
                value={newRent}
                onChange={e => setNewRent(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {language === 'ID' ? 'Sisa Hari Berjalan' : 'Days Remaining'}
              </label>
              <input
                type="number"
                value={daysRemaining}
                onChange={e => setDaysRemaining(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {language === 'ID' ? 'Total Hari di Bulan Ini' : 'Days in Current Month'}
              </label>
              <input
                type="number"
                value={daysInMonth}
                onChange={e => setDaysInMonth(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {language === 'ID' ? 'Biaya Administrasi Pindah (Rp)' : 'Transfer Admin Fee (Rp)'}
            </label>
            <input
              type="number"
              value={adminFee}
              onChange={e => setAdminFee(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
            />
          </div>

          <div className="bg-[#D1E4FF]/40 border border-[#D1E4FF] rounded-2xl p-4 mt-2">
            <div className="flex justify-between items-center text-xs text-[#001D36] pb-2 border-b border-[#0061A4]/10">
              <span>{language === 'ID' ? `Selisih Prorata (${daysRemaining} hari):` : `Prorated Difference (${daysRemaining} days):`}</span>
              <span className="font-bold">{formatRupiah(proratedDiff)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#001D36] py-2 border-b border-[#0061A4]/10">
              <span>{language === 'ID' ? 'Biaya Administrasi:' : 'Administrative Fee:'}</span>
              <span className="font-bold">{formatRupiah(fee)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-bold text-[#001D36]">{language === 'ID' ? 'Total Tagihan Prorata:' : 'Total Prorated Due:'}</span>
              <span className="text-base font-extrabold text-[#0061A4]">
                {formatRupiah(totalDue)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-[#C3C7CF]/20">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0061A4] text-white text-xs font-bold hover:bg-[#00518a]"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
