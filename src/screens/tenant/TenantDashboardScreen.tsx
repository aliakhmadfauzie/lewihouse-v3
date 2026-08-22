import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { AvatarUploadModal } from '../../components/modals/AvatarUploadModal';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { formatRupiah } from '../../utils/formatters';
import {
  Camera,
  CreditCard,
  Wrench,
  MessageSquare,
  Zap,
  Calendar,
  Home,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TenantDashboardScreen: React.FC = () => {
  const { currentResident, setCurrentTab, setIsNewRequestOpen, language, t } = useApp();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paidToast, setPaidToast] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'ID') {
      if (hour < 11) return 'Selamat pagi,';
      if (hour < 15) return 'Selamat siang,';
      if (hour < 18) return 'Selamat sore,';
      return 'Selamat malam,';
    }
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  const name = currentResident?.name || 'Ananda Rizky';
  const room = currentResident?.room || 'Room 102';
  const balance = currentResident?.balance || 0;
  const isOverdue = currentResident?.status === 'Overdue';

  const handleSimulatePayment = () => {
    setPaidToast(true);
    setTimeout(() => setPaidToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title="Lewi House" />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Profile Header & Greeting */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentTab('PROFILE')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xs text-[#43474E] font-medium block">{getGreeting()}</span>
            <div className="flex items-center gap-1.5">
              <h2 className="text-2xl font-black text-[#1A1C1E] tracking-tight group-hover:text-[#0061A4] transition-colors">{name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1E4FF] text-[#0061A4]">
                {language === 'ID' ? 'Profil →' : 'Profile →'}
              </span>
            </div>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0061A4] shadow-sm active:scale-95 transition-all group"
            >
              {currentResident?.avatarUrl ? (
                <img
                  src={currentResident.avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center font-bold text-lg">
                  {name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0061A4] text-white rounded-full flex items-center justify-center shadow-xs pointer-events-none">
              <Camera className="w-3 h-3" />
            </div>
          </div>
        </div>

        {paidToast && (
          <div className="p-4 rounded-2xl bg-[#D1E4FF] text-[#001D36] flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#0061A4] shrink-0" />
            <div className="text-xs font-bold">
              {language === 'ID'
                ? 'Transfer pembayaran berhasil dikonfirmasi! Bukti transaksi dikirim ke email.'
                : 'Payment transfer confirmed! Receipt dispatched to your email.'}
            </div>
          </div>
        )}

        {/* Upcoming Rent Card (Hero) */}
        <section
          className={`rounded-3xl p-5 shadow-md text-white ${
            isOverdue ? 'bg-[#21005D]' : 'bg-[#0061A4]'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
              {isOverdue 
                ? (language === 'ID' ? 'TUNGGAKAN SEWA' : 'OVERDUE RENT') 
                : (language === 'ID' ? 'TAGIHAN BULAN INI' : 'CURRENT BILL')}
            </span>
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                isOverdue ? 'bg-[#FFB4AB] text-[#690005]' : 'bg-[#D1E4FF] text-[#001D36]'
              }`}
            >
              {isOverdue 
                ? (language === 'ID' ? 'SEGERA BAYAR' : 'DUE NOW') 
                : (language === 'ID' ? 'JATUH TEMPO 1 NOV' : 'DUE NOV 1')}
            </span>
          </div>

          <div className="mt-3">
            <span className="text-3xl font-black tracking-tight block">
              {formatRupiah(isOverdue && balance > 0 ? balance : 3500000)}
            </span>
            <span className="text-xs text-white/80 mt-1 block">
              {language === 'ID' ? 'Sewa Kamar Bulanan & Layanan Utilitas' : 'Monthly Rent & Utility Service'}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={handleSimulatePayment}
              className="flex-1 py-2.5 bg-white text-[#001D36] hover:bg-white/90 active:scale-[0.98] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" /> {language === 'ID' ? 'Bayar via QRIS / VA' : 'Pay via QRIS / VA'}
            </button>
            <button
              onClick={() => setCurrentTab('BILLS')}
              className="px-3.5 py-2.5 bg-white/15 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all"
            >
              {t.details}
            </button>
          </div>
        </section>

        {/* Lease Information Card */}
        <section className="rounded-3xl bg-white border border-[#C3C7CF]/30 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#C3C7CF]/20">
            <div className="p-2 bg-[#F3F0F5] text-[#0061A4] rounded-xl">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1C1E]">
                {language === 'ID' ? 'Informasi Kontrak Sewa' : 'Lease Information'}
              </h3>
              <p className="text-xs text-[#43474E]">{room} • Deluxe Suite</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F3F0F5] rounded-xl">
              <span className="text-[10px] font-bold text-[#43474E] uppercase block mb-0.5">
                {language === 'ID' ? 'Berakhir Pada' : 'Lease Expiry'}
              </span>
              <span className="font-bold text-[#1A1C1E]">31 Des 2026</span>
            </div>

            <div className="p-3 bg-[#F3F0F5] rounded-xl">
              <span className="text-[10px] font-bold text-[#43474E] uppercase block mb-0.5">
                {language === 'ID' ? 'Tarif / Bulan' : 'Rate / Month'}
              </span>
              <span className="font-bold text-[#1A1C1E]">Rp 3.500.000</span>
            </div>
          </div>
        </section>

        {/* Maintenance Status Quick Widget */}
        <section className="rounded-3xl bg-white border border-[#C3C7CF]/30 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#D1E4FF] text-[#0061A4] rounded-lg">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-[#1A1C1E]">
                {language === 'ID' ? 'Status Pemeliharaan Unit' : 'Unit Maintenance Status'}
              </h3>
            </div>
            <button
              onClick={() => setCurrentTab('MAINTENANCE')}
              className="text-[11px] font-bold text-[#0061A4] hover:underline"
            >
              {language === 'ID' ? 'Lihat Semua' : 'View All'} →
            </button>
          </div>

          <div className="p-3 bg-[#F3F0F5] rounded-2xl flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#1A1C1E] block truncate">
                {language === 'ID' ? 'Inspeksi AC & Tekanan Air' : 'AC & Water Pressure Inspection'}
              </span>
              <span className="text-[10px] text-[#43474E]">
                {language === 'ID' ? 'Update otomatis via notifikasi toast' : 'Live updates via toast alert'}
              </span>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#D1E4FF] text-[#003258] shrink-0">
              {language === 'ID' ? 'Aktif' : 'Active'}
            </span>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-3.5">
          <button
            onClick={() => {
              setCurrentTab('MAINTENANCE');
              setIsNewRequestOpen(true);
            }}
            className="p-4 rounded-2xl bg-white border border-[#C3C7CF]/30 hover:border-[#0061A4]/40 shadow-xs flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1A1C1E] block">
                {language === 'ID' ? 'Lapor Kerusakan' : 'Report Issue'}
              </span>
              <span className="text-[10px] text-[#43474E]">
                {language === 'ID' ? 'Tiket perbaikan' : 'Maintenance ticket'}
              </span>
            </div>
          </button>

          <a
            href="https://wa.me/?text=Halo%20Pengelola%20Lewi%20House"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-white border border-[#C3C7CF]/30 hover:border-[#0061A4]/40 shadow-xs flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EADDFF] text-[#21005D] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1A1C1E] block">
                {language === 'ID' ? 'Chat Pengelola' : 'Chat Manager'}
              </span>
              <span className="text-[10px] text-[#43474E]">
                {language === 'ID' ? 'WhatsApp Langsung' : 'Direct WhatsApp'}
              </span>
            </div>
          </a>
        </section>
      </main>

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </div>
  );
};
