import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { RoomTransferModal } from '../../components/modals/RoomTransferModal';
import { formatCompactRupiah, formatRupiah } from '../../utils/formatters';
import {
  TrendingUp,
  CreditCard,
  Plus,
  Calculator,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight
} from 'lucide-react';

export const PaymentsScreen: React.FC = () => {
  const { totalRevenue, netProfit, outstanding, transactions, t, language } = useApp();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title={t.paymentsTitle} />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Financial Summary Card (Dark Theme matching Android) */}
        <section className="rounded-3xl bg-[#1A1C1E] text-white p-5 shadow-md space-y-4">
          <div>
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest block mb-1">
              {t.paymentsFinancialSummary}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight">
                {formatRupiah(totalRevenue || 42500000)}
              </span>
            </div>
            <span className="text-xs text-[#FFB4AB] font-bold">{t.paymentsTotalCollections}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div>
              <span className="text-[10px] font-bold text-white/60 uppercase">{t.paymentsNetProfit}</span>
              <span className="text-base font-extrabold text-[#D1E4FF] block mt-0.5">
                {formatCompactRupiah(netProfit || 38200000)}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-white/60 uppercase">{t.paymentsOutstanding}</span>
              <span className="text-base font-extrabold text-[#FFB4AB] block mt-0.5">
                {formatCompactRupiah(outstanding || 4300000)}
              </span>
            </div>
          </div>
        </section>

        {/* Room Transfer Calculator Card Banner */}
        <div
          onClick={() => setIsTransferModalOpen(true)}
          className="cursor-pointer p-4 bg-[#EADDFF] text-[#21005D] rounded-2xl flex items-center justify-between shadow-xs hover:opacity-95 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-[#21005D]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide">
                {t.paymentsTransferCalcTitle}
              </h3>
              <p className="text-[11px] text-[#21005D]/80 font-medium mt-0.5">
                {t.paymentsTransferCalcDesc}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#21005D] group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Recent Transactions List */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#1A1C1E]">{t.paymentsRecentTx}</h3>

          <div className="rounded-2xl bg-white border border-[#C3C7CF]/30 shadow-xs divide-y divide-[#C3C7CF]/20 overflow-hidden">
            {transactions.map(tx => (
              <div key={tx.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.isIncome
                        ? 'bg-[#D1E4FF] text-[#0061A4]'
                        : 'bg-[#FFB4AB]/40 text-[#BA1A1A]'
                    }`}
                  >
                    {tx.isIncome ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1A1C1E] truncate">{tx.title}</p>
                    <p className="text-[11px] text-[#43474E] mt-0.5">{tx.date}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-extrabold ${
                      tx.isIncome ? 'text-[#0061A4]' : 'text-[#BA1A1A]'
                    }`}
                  >
                    {tx.isIncome ? '+' : '-'}
                    {formatRupiah(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsRecordModalOpen(true)}
        className="fixed bottom-20 right-6 z-20 w-14 h-14 rounded-2xl bg-[#0061A4] hover:bg-[#00518a] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all"
        title={t.paymentsRecordBtn}
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>

      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
      <RoomTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
    </div>
  );
};
