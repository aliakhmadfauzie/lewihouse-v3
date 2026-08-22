import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Zap, Check } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface IssueTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueTokenModal: React.FC<IssueTokenModalProps> = ({ isOpen, onClose }) => {
  const { units, addTokenPurchase } = useApp();

  const [selectedUnit, setSelectedUnit] = useState(units[0]?.unitNumber || 'Unit 101');
  const [tokenAmount, setTokenAmount] = useState('100000');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const purchase = addTokenPurchase({
      unit: selectedUnit,
      amount: parseFloat(tokenAmount) || 100000
    });
    setGeneratedToken(purchase.tokenNumber);
  };

  const handleDone = () => {
    setGeneratedToken(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FDFBFF] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D1E4FF] text-[#001D36]">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1C1E]">Issue Electricity Token</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedToken ? (
          <form onSubmit={handleGenerate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                Target Unit
              </label>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
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
                Denomination (IDR)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {['50000', '100000', '200000', '500000'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTokenAmount(val)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      tokenAmount === val
                        ? 'bg-[#0061A4] text-white border-[#0061A4]'
                        : 'bg-white text-[#43474E] border-[#C3C7CF] hover:bg-[#F3F0F5]'
                    }`}
                  >
                    {formatRupiah(parseInt(val))}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={tokenAmount}
                onChange={e => setTokenAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#C3C7CF] rounded-xl text-sm focus:outline-none focus:border-[#0061A4]"
                placeholder="Or enter custom amount"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#C3C7CF]/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#C3C7CF] text-xs font-bold text-[#43474E] hover:bg-[#F3F0F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0061A4] text-white text-xs font-bold hover:bg-[#00518a] shadow-xs"
              >
                <Zap className="w-4 h-4" /> Generate & Issue Token
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 text-center space-y-4">
            <div className="w-12 h-12 bg-[#D1E4FF] text-[#0061A4] rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3px]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1C1E]">Token Generated!</h3>
              <p className="text-xs text-[#43474E]">
                Issued for {selectedUnit} ({formatRupiah(parseFloat(tokenAmount))})
              </p>
            </div>

            <div className="p-4 bg-[#F3F0F5] border border-[#C3C7CF] rounded-2xl">
              <span className="text-xs font-bold text-[#43474E] block mb-1">
                20-DIGIT METER TOKEN
              </span>
              <span className="text-xl font-mono font-extrabold tracking-wider text-[#0061A4] select-all">
                {generatedToken}
              </span>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl bg-[#0061A4] text-white text-sm font-bold hover:bg-[#00518a]"
            >
              Done & Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
