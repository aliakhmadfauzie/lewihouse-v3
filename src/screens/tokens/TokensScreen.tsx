import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { IssueTokenModal } from '../../components/modals/IssueTokenModal';
import { formatRupiah } from '../../utils/formatters';
import { Zap, Plus, Gauge, CheckCircle2, History } from 'lucide-react';

export const TokensScreen: React.FC = () => {
  const { units, tokenPurchases } = useApp();

  const [selectedUnit, setSelectedUnit] = useState(units[0]?.unitNumber || 'Unit 101');
  const [initialKwh, setInitialKwh] = useState('1240.5');
  const [finalKwh, setFinalKwh] = useState('1315.2');
  const [ratePerKwh] = useState(1500); // Standard PLN tariff rate
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [readingSaved, setReadingSaved] = useState(false);

  const init = parseFloat(initialKwh) || 0;
  const final = parseFloat(finalKwh) || 0;
  const usage = Math.max(0, final - init);
  const totalCost = usage * ratePerKwh;

  const handleSaveReading = (e: React.FormEvent) => {
    e.preventDefault();
    setReadingSaved(true);
    setTimeout(() => setReadingSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title="Utilities & Tokens" />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-5">
        {/* Record Meter Reading Card */}
        <section className="rounded-3xl bg-white border border-[#C3C7CF]/30 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#C3C7CF]/20">
            <div className="p-2 bg-[#D1E4FF] text-[#001D36] rounded-xl">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1C1E]">Record Meter Reading</h2>
              <p className="text-xs text-[#43474E]">Calculate sub-meter electricity usage</p>
            </div>
          </div>

          <form onSubmit={handleSaveReading} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#43474E] mb-1">
                Select Unit
              </label>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F3F0F5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0061A4] text-[#1A1C1E]"
              >
                {units.map(u => (
                  <option key={u.id} value={u.unitNumber}>
                    {u.unitNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1">
                  Initial Meter (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={initialKwh}
                  onChange={e => setInitialKwh(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F3F0F5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0061A4] text-[#1A1C1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474E] mb-1">
                  Final Meter (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={finalKwh}
                  onChange={e => setFinalKwh(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F3F0F5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0061A4] text-[#1A1C1E]"
                />
              </div>
            </div>

            {/* Calculated Usage Banner */}
            <div className="bg-[#D1E4FF]/40 border border-[#D1E4FF] rounded-2xl p-4">
              <div className="flex justify-between items-center text-xs text-[#001D36] pb-2 border-b border-[#0061A4]/10">
                <span>Calculated Usage:</span>
                <span className="font-extrabold">{usage.toFixed(1)} kWh</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#001D36] py-2 border-b border-[#0061A4]/10">
                <span>PLN Tariff Rate:</span>
                <span className="font-semibold">{formatRupiah(ratePerKwh)} / kWh</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-[#001D36]">Estimated Cost:</span>
                <span className="text-base font-black text-[#0061A4]">
                  {formatRupiah(totalCost)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0061A4] hover:bg-[#00518a] active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {readingSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Reading Logged Successfully!
                </>
              ) : (
                'Save Meter Reading'
              )}
            </button>
          </form>
        </section>

        {/* Recent Token Purchases */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1A1C1E] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#43474E]" />
              <span>Token Purchase History</span>
            </h3>
          </div>

          <div className="space-y-3">
            {tokenPurchases.map(tp => (
              <div
                key={tp.id}
                className="p-4 bg-white rounded-2xl border border-[#C3C7CF]/30 shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1A1C1E]">{tp.unit}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#D1E4FF] text-[#001D36] text-[10px] font-black uppercase">
                      {tp.status}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#0061A4]">
                    {formatRupiah(tp.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#43474E] font-mono bg-[#F3F0F5] px-3 py-1.5 rounded-lg select-all">
                  <span>TOKEN: {tp.tokenNumber}</span>
                  <span className="text-[10px] font-sans text-[#74777F]">{tp.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsIssueModalOpen(true)}
        className="fixed bottom-20 right-6 z-20 w-14 h-14 rounded-2xl bg-[#0061A4] hover:bg-[#00518a] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all"
        title="Issue Electricity Token"
      >
        <Zap className="w-6 h-6 stroke-[2.5px]" />
      </button>

      <IssueTokenModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
      />
    </div>
  );
};
