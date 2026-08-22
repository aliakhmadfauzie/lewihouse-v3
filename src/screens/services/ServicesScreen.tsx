import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { QuickMaintenanceModal } from '../../components/modals/QuickMaintenanceModal';
import { IssueTokenModal } from '../../components/modals/IssueTokenModal';
import { formatCompactRupiah, formatRupiah } from '../../utils/formatters';
import {
  Wrench,
  Zap,
  Plus,
  Gauge,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const ServicesScreen: React.FC = () => {
  const {
    maintenanceRequests,
    updateMaintenanceStatus,
    tokenPurchases,
    units,
    language,
    t,
    userRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MAINTENANCE' | 'UTILITIES'>('MAINTENANCE');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isIssueTokenModalOpen, setIsIssueTokenModalOpen] = useState(false);

  // Meter Reading Sub-calculator State
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.unitNumber || 'Unit 101');
  const [initialKwh, setInitialKwh] = useState('1240.5');
  const [finalKwh, setFinalKwh] = useState('1315.2');
  const [ratePerKwh] = useState(1500);
  const [readingSaved, setReadingSaved] = useState(false);

  const initVal = parseFloat(initialKwh) || 0;
  const finalVal = parseFloat(finalKwh) || 0;
  const usageKwh = Math.max(0, finalVal - initVal);
  const totalCost = usageKwh * ratePerKwh;

  const handleSaveMeterReading = (e: React.FormEvent) => {
    e.preventDefault();
    setReadingSaved(true);
    setTimeout(() => setReadingSaved(false), 3000);
  };

  const filteredRequests = maintenanceRequests.filter(req => {
    if (maintenanceFilter === 'All') return true;
    return req.status === maintenanceFilter;
  });

  const pendingCount = maintenanceRequests.filter(r => r.status === 'Pending').length;
  const inProgressCount = maintenanceRequests.filter(r => r.status === 'In Progress').length;
  const emergencyCount = maintenanceRequests.filter(r => r.isEmergency && r.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#FDFBFF] dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] pb-24">
      <TopBar title={language === 'ID' ? 'Layanan & Pemeliharaan' : 'Services & Utilities'} />

      <main className="max-w-md md:max-w-2xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Material 3 Segmented Control for Services */}
        <div className="p-1 bg-[#E1E2E8] dark:bg-[#1E2024] rounded-2xl flex items-center gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('MAINTENANCE')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'MAINTENANCE'
                ? 'bg-white dark:bg-[#2D3139] text-[#0061A4] dark:text-[#9ECAFF] shadow-sm'
                : 'text-[#43474E] dark:text-[#8E9099] hover:text-[#1A1C1E] dark:hover:text-[#E2E2E6]'
            }`}
          >
            <Wrench className="w-4 h-4 stroke-[2.2px]" />
            <span>{language === 'ID' ? 'Pemeliharaan / Tiket' : 'Maintenance & Repairs'}</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#FFDDAE] text-[#2A1800] text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('UTILITIES')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'UTILITIES'
                ? 'bg-white dark:bg-[#2D3139] text-[#0061A4] dark:text-[#9ECAFF] shadow-sm'
                : 'text-[#43474E] dark:text-[#8E9099] hover:text-[#1A1C1E] dark:hover:text-[#E2E2E6]'
            }`}
          >
            <Zap className="w-4 h-4 stroke-[2.2px]" />
            <span>{language === 'ID' ? 'Listrik & Token PLN' : 'Electricity & Tokens'}</span>
          </button>
        </div>

        {/* TAB 1: MAINTENANCE & REPAIRS */}
        {activeTab === 'MAINTENANCE' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Summary Banner Card */}
            <div className="rounded-[28px] bg-[#EADDFF] dark:bg-[#2B1B4D] p-5 text-[#21005D] dark:text-[#EADDFF] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase opacity-80 block mb-1">
                  {language === 'ID' ? 'STATUS TIKET PERBAIKAN' : 'TICKET QUEUE SUMMARY'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{pendingCount} {language === 'ID' ? 'Menunggu' : 'Pending'}</span>
                  <span className="text-xs font-bold opacity-75">• {inProgressCount} {language === 'ID' ? 'Proses' : 'Active'}</span>
                </div>
                {emergencyCount > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs font-black text-[#BA1A1A] dark:text-[#FFB4AB]">
                    <ShieldAlert className="w-4 h-4 animate-pulse" />
                    <span>{emergencyCount} {language === 'ID' ? 'Laporan Darurat / Emergency' : 'Emergency Priority Reports'}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsTicketModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#0061A4] text-white hover:bg-[#00497D] active:scale-95 text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>{language === 'ID' ? 'Tiket Baru' : 'New Ticket'}</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setMaintenanceFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    maintenanceFilter === filter
                      ? 'bg-[#0061A4] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1E2024] text-[#43474E] dark:text-[#C4C6D0] border border-[#C3C7CF]/40 dark:border-[#44474F]/50 hover:border-[#0061A4]'
                  }`}
                >
                  {filter === 'All'
                    ? (language === 'ID' ? 'Semua' : 'All')
                    : filter === 'Pending'
                    ? (language === 'ID' ? 'Menunggu' : 'Pending')
                    : filter === 'In Progress'
                    ? (language === 'ID' ? 'Dikerjakan' : 'In Progress')
                    : (language === 'ID' ? 'Selesai' : 'Resolved')}
                </button>
              ))}
            </div>

            {/* Maintenance Tickets List */}
            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <div className="p-8 rounded-[24px] bg-white dark:bg-[#1E2024] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#008938] mx-auto mb-2 opacity-75" />
                  <p className="text-sm font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">
                    {language === 'ID' ? 'Semua tiket telah terselesaikan!' : 'No maintenance tickets matching filter.'}
                  </p>
                </div>
              ) : (
                filteredRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-[24px] bg-white dark:bg-[#1E2024] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-2xl ${req.isEmergency ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#D1E4FF] dark:bg-[#00497D] text-[#0061A4] dark:text-[#D1E4FF]'}`}>
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-[#1A1C1E] dark:text-[#E2E2E6]">{req.unit}</h4>
                            {req.isEmergency && (
                              <span className="px-1.5 py-0.2 rounded bg-[#BA1A1A] text-white text-[9px] font-black uppercase tracking-wider">
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mt-0.5">{req.issue}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          req.status === 'Resolved'
                            ? 'bg-[#D4F7DC] text-[#005221] dark:bg-[#005221] dark:text-[#D4F7DC]'
                            : req.status === 'In Progress'
                            ? 'bg-[#FFDDAE] text-[#2A1800] dark:bg-[#783800] dark:text-[#FFDCC2]'
                            : 'bg-[#FFDAD6] text-[#410002] dark:bg-[#93000A] dark:text-[#FFDAD6]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {req.description && (
                      <p className="text-[11px] text-[#43474E] dark:text-[#8E9099] bg-[#F3F0F5] dark:bg-[#121316] p-2.5 rounded-xl">
                        {req.description}
                      </p>
                    )}

                    {/* Admin Status Switcher Controls */}
                    {userRole === 'ADMIN' && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#C3C7CF]/20 dark:border-[#44474F]/30 text-xs">
                        <span className="text-[10px] font-bold text-[#43474E] dark:text-[#8E9099]">
                          {language === 'ID' ? 'Ubah Status:' : 'Update Status:'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateMaintenanceStatus(req.id, 'Pending')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              req.status === 'Pending'
                                ? 'bg-[#BA1A1A] text-white'
                                : 'bg-[#F3F0F5] dark:bg-[#121316] text-[#43474E] dark:text-[#C4C6D0]'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => updateMaintenanceStatus(req.id, 'In Progress')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              req.status === 'In Progress'
                                ? 'bg-[#825500] text-white'
                                : 'bg-[#F3F0F5] dark:bg-[#121316] text-[#43474E] dark:text-[#C4C6D0]'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => updateMaintenanceStatus(req.id, 'Resolved')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              req.status === 'Resolved'
                                ? 'bg-[#008938] text-white'
                                : 'bg-[#F3F0F5] dark:bg-[#121316] text-[#43474E] dark:text-[#C4C6D0]'
                            }`}
                          >
                            Resolved
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ELECTRICITY & TOKENS */}
        {activeTab === 'UTILITIES' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Fast Action Banner */}
            <div className="rounded-[28px] bg-[#D1E4FF] dark:bg-[#00497D] p-5 text-[#001D36] dark:text-[#D1E4FF] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase opacity-80 block mb-1">
                  {language === 'ID' ? 'TOKEN LISTRIK PRABAYAR' : 'PREPAID PLN ELECTRICITY'}
                </span>
                <p className="text-sm font-black">
                  {language === 'ID' ? 'Kelola meteran kamar & pembelian token' : 'Manage room meters & token issuance'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsIssueTokenModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#0061A4] text-white hover:bg-[#00497D] active:scale-95 text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>{language === 'ID' ? 'Beli Token' : 'Issue Token'}</span>
              </button>
            </div>

            {/* Sub-meter Reading Calculator */}
            <section className="rounded-[28px] bg-white dark:bg-[#1E2024] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
                <div className="p-2 bg-[#D1E4FF] dark:bg-[#00497D] text-[#001D36] dark:text-[#D1E4FF] rounded-xl">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1A1C1E] dark:text-[#E2E2E6]">
                    {language === 'ID' ? 'Kalkulator Meteran Kamar' : 'Sub-Meter Electricity Calculator'}
                  </h3>
                  <p className="text-[11px] text-[#43474E] dark:text-[#8E9099]">
                    {language === 'ID' ? 'Hitung pemakaian listrik berdasarkan kWh meter' : 'Compute unit electricity usage from meter numbers'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveMeterReading} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {language === 'ID' ? 'Pilih Kamar' : 'Select Unit'}
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={e => setSelectedUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] bg-white dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0061A4]"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.unitNumber}>
                        {u.unitNumber} ({u.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                      {language === 'ID' ? 'Meter Awal (kWh)' : 'Initial Meter (kWh)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={initialKwh}
                      onChange={e => setInitialKwh(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] bg-white dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0061A4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                      {language === 'ID' ? 'Meter Akhir (kWh)' : 'Final Meter (kWh)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={finalKwh}
                      onChange={e => setFinalKwh(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F] bg-white dark:bg-[#121316] text-[#1A1C1E] dark:text-[#E2E2E6] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0061A4]"
                    />
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="p-3.5 rounded-2xl bg-[#F3F0F5] dark:bg-[#121316] flex items-center justify-between border border-[#C3C7CF]/30 dark:border-[#44474F]/40">
                  <div>
                    <span className="text-[10px] font-bold text-[#43474E] dark:text-[#8E9099] uppercase block">
                      {language === 'ID' ? 'Total Pemakaian' : 'Total Usage'}
                    </span>
                    <span className="text-base font-black text-[#1A1C1E] dark:text-[#E2E2E6]">
                      {usageKwh.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#43474E] dark:text-[#8E9099] uppercase block">
                      {language === 'ID' ? 'Biaya Listrik' : 'Calculated Cost'}
                    </span>
                    <span className="text-base font-black text-[#0061A4] dark:text-[#9ECAFF]">
                      {formatRupiah(totalCost)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0061A4] text-white hover:bg-[#00497D] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {readingSaved ? <CheckCircle2 className="w-4 h-4 text-[#67DC8B]" /> : <Gauge className="w-4 h-4" />}
                  <span>{readingSaved ? (language === 'ID' ? 'Tersimpan ke Sistem!' : 'Reading Saved!') : (language === 'ID' ? 'Catat Hasil Meteran' : 'Save Meter Reading')}</span>
                </button>
              </form>
            </section>

            {/* Token History */}
            <section className="space-y-2 pt-1">
              <h3 className="text-xs font-black uppercase text-[#43474E] dark:text-[#8E9099] tracking-wider">
                {language === 'ID' ? 'Riwayat Pembelian Token PLN' : 'Recent Token Purchases'}
              </h3>
              <div className="rounded-[24px] bg-white dark:bg-[#1E2024] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 divide-y divide-[#C3C7CF]/20 dark:divide-[#44474F]/30 overflow-hidden shadow-xs">
                {tokenPurchases.slice(0, 5).map(token => (
                  <div key={token.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#D1E4FF] dark:bg-[#00497D] text-[#0061A4] dark:text-[#D1E4FF]">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#1A1C1E] dark:text-[#E2E2E6]">{token.unit}</p>
                        <p className="text-[11px] font-mono text-[#0061A4] dark:text-[#9ECAFF] font-bold tracking-wider">
                          {token.tokenNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-[#1A1C1E] dark:text-[#E2E2E6]">
                        {formatCompactRupiah(token.amount)}
                      </p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D4F7DC] text-[#005221] dark:bg-[#005221] dark:text-[#D4F7DC]">
                        {token.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <QuickMaintenanceModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
      <IssueTokenModal
        isOpen={isIssueTokenModalOpen}
        onClose={() => setIsIssueTokenModalOpen(false)}
      />
    </div>
  );
};
