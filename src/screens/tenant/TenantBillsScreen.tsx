import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { formatRupiah } from '../../utils/formatters';
import { Receipt, CreditCard, Download, CheckCircle2, QrCode, Building, Copy, Check } from 'lucide-react';

export const TenantBillsScreen: React.FC = () => {
  const { currentResident, transactions } = useApp();

  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [showQris, setShowQris] = useState(false);
  const [paidToast, setPaidToast] = useState(false);

  const isOverdue = currentResident?.status === 'Overdue';
  const balance = currentResident?.balance || 3500000;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handlePaidSimulation = () => {
    setPaidToast(true);
    setTimeout(() => setPaidToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title="Bills & Invoices" />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Outstanding Total Card */}
        <section className="rounded-3xl bg-[#1A1C1E] text-white p-5 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
              CURRENT INVOICE (OCT 2026)
            </span>
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase ${
                isOverdue ? 'bg-[#FFB4AB] text-[#690005]' : 'bg-[#D1E4FF] text-[#001D36]'
              }`}
            >
              {isOverdue ? 'OVERDUE' : 'UNPAID'}
            </span>
          </div>

          <div className="mt-3">
            <span className="text-3xl font-black tracking-tight">{formatRupiah(balance)}</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs text-white/80">
            <div className="flex justify-between">
              <span>Room Rent (Oct 1 - Oct 31):</span>
              <span className="font-bold text-white">{formatRupiah(3000000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service & High-Speed WiFi:</span>
              <span className="font-bold text-white">{formatRupiah(350000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Trash & Cleaning Maintenance:</span>
              <span className="font-bold text-white">{formatRupiah(150000)}</span>
            </div>
          </div>
        </section>

        {paidToast && (
          <div className="p-4 rounded-2xl bg-[#D1E4FF] text-[#001D36] flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#0061A4] shrink-0" />
            <div className="text-xs font-bold">
              Payment transfer received and processed successfully!
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <section className="rounded-3xl bg-white border border-[#C3C7CF]/30 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#C3C7CF]/20">
            <div className="p-2 bg-[#D1E4FF] text-[#001D36] rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1C1E]">Payment Channels</h3>
              <p className="text-xs text-[#43474E]">Instant automated verification</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* BCA VA */}
            <div className="p-3.5 bg-[#F3F0F5] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1A1C1E] block">BCA Virtual Account</span>
                <span className="text-xs font-mono font-bold text-[#0061A4] mt-0.5 block">
                  8273 0812 3456 7890
                </span>
              </div>
              <button
                onClick={() => handleCopy('8273081234567890', 'BCA')}
                className="p-2 rounded-xl bg-white text-[#0061A4] hover:bg-[#D1E4FF] transition-colors"
                title="Copy VA Number"
              >
                {copiedBank === 'BCA' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Mandiri VA */}
            <div className="p-3.5 bg-[#F3F0F5] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1A1C1E] block">Mandiri VA</span>
                <span className="text-xs font-mono font-bold text-[#0061A4] mt-0.5 block">
                  8890 0812 3456 7890
                </span>
              </div>
              <button
                onClick={() => handleCopy('8890081234567890', 'Mandiri')}
                className="p-2 rounded-xl bg-white text-[#0061A4] hover:bg-[#D1E4FF] transition-colors"
                title="Copy VA Number"
              >
                {copiedBank === 'Mandiri' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* QRIS Option */}
            <button
              onClick={() => setShowQris(!showQris)}
              className="w-full py-3 bg-[#EADDFF] text-[#21005D] rounded-2xl text-xs font-bold hover:bg-[#e0d0fa] transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" /> {showQris ? 'Hide QRIS Code' : 'Show QRIS Code'}
            </button>

            {showQris && (
              <div className="p-4 bg-white border border-[#C3C7CF] rounded-2xl text-center space-y-2 animate-in fade-in">
                <div className="w-48 h-48 bg-white border-4 border-[#001D36] p-2 mx-auto rounded-xl flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226580016ID.CO.QRIS.WWW011893600002011122334402150000000000000005303360540735000005802ID5910LEWIHOUSE6007JAKARTA6304ABCD"
                    alt="QRIS Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] text-[#43474E] font-medium block">
                  Scan using GoPay, OVO, Dana, BCA Mobile, or any Indonesian banking app.
                </span>
                <button
                  onClick={handlePaidSimulation}
                  className="px-4 py-2 rounded-xl bg-[#0061A4] text-white text-xs font-bold"
                >
                  I Have Completed Payment
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Invoice Payment History */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#1A1C1E]">Past Invoices & Receipts</h3>

          <div className="rounded-2xl bg-white border border-[#C3C7CF]/30 shadow-xs divide-y divide-[#C3C7CF]/20 overflow-hidden">
            <button
              onClick={() => handleCopy('INV-2026-09-102', 'INV09')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F3F0F5]/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1C1E]">September 2026 Rent</h4>
                  <p className="text-[11px] text-[#43474E]">Paid on Sep 29, 2026 • Receipt #INV-2026-09</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#0061A4] block">Rp 3.500.000</span>
                <span className="text-[10px] text-[#0061A4] font-bold">
                  {copiedBank === 'INV09' ? 'COPIED #' : 'PAID (CLICK TO COPY)'}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleCopy('INV-2026-08-102', 'INV08')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F3F0F5]/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1C1E]">August 2026 Rent</h4>
                  <p className="text-[11px] text-[#43474E]">Paid on Aug 30, 2026 • Receipt #INV-2026-08</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#0061A4] block">Rp 3.500.000</span>
                <span className="text-[10px] text-[#0061A4] font-bold">
                  {copiedBank === 'INV08' ? 'COPIED #' : 'PAID (CLICK TO COPY)'}
                </span>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
