import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, residents, units, t, language } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isIncome, setIsIncome] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.unitNumber || '101');
  const [selectedResident, setSelectedResident] = useState(residents[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    addTransaction({
      title: title.trim(),
      amount: parseFloat(amount) || 0,
      date: (language === 'ID' ? 'Hari Ini, ' : 'Today, ') + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncome,
      unitId: selectedUnit,
      residentId: isIncome ? selectedResident : ''
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FDFBFF] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20">
          <h2 className="text-xl font-bold text-[#1A1C1E]">{t.paymentsRecordBtn}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex rounded-xl bg-[#F3F0F5] p-1">
            <button
              type="button"
              onClick={() => setIsIncome(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                isIncome ? 'bg-[#0061A4] text-white shadow-xs' : 'text-[#43474E]'
              }`}
            >
              {t.paymentsIncome}
            </button>
            <button
              type="button"
              onClick={() => setIsIncome(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                !isIncome ? 'bg-[#BA1A1A] text-white shadow-xs' : 'text-[#43474E]'
              }`}
            >
              {t.paymentsExpense}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.paymentsTxTitleLabel}
            </label>
            <input
              type="text"
              required
              placeholder={t.paymentsTxTitlePlaceholder}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4] focus:ring-1 focus:ring-[#0061A4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#43474E] mb-1">
              {t.paymentsTxAmountLabel}
            </label>
            <input
              type="number"
              required
              placeholder="misal: 3500000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4] focus:ring-1 focus:ring-[#0061A4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                {t.paymentsTxUnitLabel}
              </label>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
              >
                {units.map(u => (
                  <option key={u.id} value={u.unitNumber}>
                    {u.unitNumber}
                  </option>
                ))}
                <option value="Common">{t.paymentsTxCommonArea}</option>
              </select>
            </div>

            {isIncome && (
              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1">
                  {t.paymentsTxTenantLabel}
                </label>
                <select
                  value={selectedResident}
                  onChange={e => setSelectedResident(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
                >
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0061A4] text-white text-xs font-bold hover:bg-[#00518a] shadow-xs"
            >
              <Check className="w-4 h-4" /> {t.paymentsTxSubmitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
