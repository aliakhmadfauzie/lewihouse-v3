import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { NewRequestScreen } from './NewRequestScreen';
import {
  Wrench,
  Plus,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Edit3,
  Check,
  ChevronDown,
  X,
  Send,
  MessageSquare
} from 'lucide-react';
import { MaintenanceRequest } from '../../types';

export const MaintenanceScreen: React.FC = () => {
  const {
    maintenanceRequests,
    isNewRequestOpen,
    setIsNewRequestOpen,
    updateMaintenanceStatus,
    simulateMaintenanceUpdate,
    t,
    language
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [editingTicket, setEditingTicket] = useState<MaintenanceRequest | null>(null);
  const [targetStatus, setTargetStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('In Progress');
  const [statusNote, setStatusNote] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isNewRequestOpen) {
    return <NewRequestScreen onBack={() => setIsNewRequestOpen(false)} />;
  }

  const filteredRequests = maintenanceRequests.filter((req) => {
    if (selectedFilter === 'All') return true;
    return req.priority === selectedFilter;
  });

  const getFilterLabel = (filter: 'All' | 'High' | 'Medium' | 'Low') => {
    if (filter === 'All') return t.maintenanceAllTickets;
    if (filter === 'High') return t.maintenanceHighPriority;
    if (filter === 'Medium') return t.maintenanceMediumPriority;
    return t.maintenanceLowPriority;
  };

  const getPriorityLabel = (priority: 'High' | 'Medium' | 'Low') => {
    if (priority === 'High') return t.statusHigh;
    if (priority === 'Medium') return t.statusMedium;
    return t.statusLow;
  };

  const openStatusModal = (req: MaintenanceRequest, defaultNext?: 'Pending' | 'In Progress' | 'Resolved') => {
    setEditingTicket(req);
    const next = defaultNext || (req.status === 'Pending' ? 'In Progress' : req.status === 'In Progress' ? 'Resolved' : 'Pending');
    setTargetStatus(next);
    setStatusNote('');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;
    updateMaintenanceStatus(editingTicket.id, targetStatus, statusNote.trim() || undefined);
    setEditingTicket(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title={t.maintenanceTitle} />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Simulation / Toast Notification Info Banner */}
        <div className="p-3.5 bg-gradient-to-r from-[#D1E4FF]/60 to-[#EADDFF]/50 border border-[#0061A4]/20 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0061A4] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-[#001D36]">{t.maintenanceSimulateUpdate}</h2>
              <p className="text-[11px] text-[#43474E] leading-tight">
                {t.maintenanceSimulateDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => simulateMaintenanceUpdate()}
            className="px-3 py-1.5 bg-[#0061A4] hover:bg-[#004d84] text-white text-xs font-bold rounded-xl shrink-0 transition-all active:scale-95 shadow-2xs flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ID' ? 'Kirim Toast' : 'Trigger Toast'}</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedFilter === filter
                  ? 'bg-[#0061A4] text-white shadow-xs'
                  : 'bg-[#F3F0F5] text-[#43474E] hover:bg-[#e4e1e8]'
              }`}
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const isHigh = req.priority === 'High';
            const isMedium = req.priority === 'Medium';
            const isResolved = req.status === 'Resolved';
            const isInProgress = req.status === 'In Progress';

            return (
              <div
                key={req.id}
                className="p-4 bg-white rounded-2xl border border-[#C3C7CF]/30 shadow-xs flex flex-col gap-3 hover:border-[#0061A4]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0061A4] bg-[#D1E4FF] px-2 py-0.5 rounded-md">
                        {req.unit}
                      </span>
                      {req.isEmergency && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-[#690005] bg-[#FFB4AB] px-2 py-0.5 rounded-md uppercase">
                          <AlertOctagon className="w-3 h-3" /> {t.maintenanceEmergencyBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#1A1C1E] mt-1.5">{req.issue}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase shrink-0 ${
                      isHigh
                        ? 'bg-[#FFB4AB] text-[#690005]'
                        : isMedium
                        ? 'bg-[#FFDDAE] text-[#2A1800]'
                        : 'bg-[#D1E4FF] text-[#001D36]'
                    }`}
                  >
                    {getPriorityLabel(req.priority)}
                  </span>
                </div>

                {req.description && (
                  <p className="text-xs text-[#43474E] leading-relaxed break-words">
                    {req.description}
                  </p>
                )}

                {req.photoUrl && (
                  <button
                    onClick={() => setSelectedImage(req.photoUrl || null)}
                    className="flex items-center gap-1.5 text-xs text-[#0061A4] font-bold hover:underline w-fit"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{t.maintenancePhotoAttached}</span>
                  </button>
                )}

                {/* Footer & Status Change Buttons */}
                <div className="pt-2 border-t border-[#C3C7CF]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-[#43474E]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#74777F]" />
                    {req.date}
                  </span>

                  {/* Status Badge & Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`font-black text-[10px] px-2.5 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-[#D1E4FF] text-[#003258]'
                          : isInProgress
                          ? 'bg-[#FFDDAE] text-[#4A2800]'
                          : 'bg-[#F3F0F5] text-[#43474E]'
                      }`}
                    >
                      {req.status === 'Resolved'
                        ? (language === 'ID' ? 'Selesai' : 'Resolved')
                        : req.status === 'In Progress'
                        ? (language === 'ID' ? 'Sedang Dikerjakan' : 'In Progress')
                        : (language === 'ID' ? 'Menunggu' : 'Pending')}
                    </span>

                    {/* Quick Update Button */}
                    <button
                      onClick={() => openStatusModal(req)}
                      className="px-2.5 py-1 rounded-lg bg-[#EFF4FA] hover:bg-[#D1E4FF] text-[#0061A4] text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title={t.maintenanceUpdateStatusBtn}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{t.maintenanceUpdateStatusBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-[#74777F]">
              <p className="text-sm">{t.maintenanceNoTickets}</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsNewRequestOpen(true)}
        className="fixed bottom-20 right-6 z-20 w-14 h-14 rounded-2xl bg-[#0061A4] hover:bg-[#00518a] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all"
        title={t.maintenanceReportBtn}
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>

      {/* Interactive Status Update Modal */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-[#1A1C1E]">{t.maintenanceUpdateStatusBtn}</h3>
                <p className="text-xs text-[#43474E] mt-0.5">
                  {editingTicket.unit}: {editingTicket.issue}
                </p>
              </div>
              <button
                onClick={() => setEditingTicket(null)}
                className="p-1.5 text-[#74777F] hover:bg-black/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#1A1C1E] mb-2 uppercase tracking-wide">
                  {language === 'ID' ? 'Pilih Status Baru' : 'Select New Status'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Pending')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      targetStatus === 'Pending'
                        ? 'bg-[#F3F0F5] border-[#535F70] text-[#1A1C1E] ring-2 ring-[#535F70]/20'
                        : 'bg-white border-[#C3C7CF]/50 text-[#74777F] hover:bg-[#F3F0F5]'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{language === 'ID' ? 'Menunggu' : 'Pending'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('In Progress')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      targetStatus === 'In Progress'
                        ? 'bg-[#FFDDAE]/50 border-[#9C4300] text-[#4A2800] ring-2 ring-[#9C4300]/20'
                        : 'bg-white border-[#C3C7CF]/50 text-[#74777F] hover:bg-[#FFF8F0]'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>{language === 'ID' ? 'Dikerjakan' : 'In Progress'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('Resolved')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      targetStatus === 'Resolved'
                        ? 'bg-[#D1E4FF]/60 border-[#0061A4] text-[#003258] ring-2 ring-[#0061A4]/20'
                        : 'bg-white border-[#C3C7CF]/50 text-[#74777F] hover:bg-[#D1E4FF]/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ID' ? 'Selesai' : 'Resolved'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1C1E] mb-1.5">
                  {language === 'ID' ? 'Catatan Tambahan (Opsional)' : 'Progress Note (Optional)'}
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={
                    language === 'ID'
                      ? 'Contoh: Teknisi pipa telah mengganti segel dan kran air...'
                      : 'e.g. Technician replaced pipe seal and verified drainage...'
                  }
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#F3F0F5] rounded-xl text-xs text-[#1A1C1E] placeholder:text-[#74777F] focus:outline-none focus:ring-2 focus:ring-[#0061A4] border border-transparent resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="flex-1 py-2.5 bg-[#F3F0F5] hover:bg-[#e6e2ea] text-[#43474E] text-xs font-bold rounded-xl transition-all"
                >
                  {language === 'ID' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0061A4] hover:bg-[#004d84] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ID' ? 'Simpan & Beritahu' : 'Save & Notify'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div className="relative max-w-lg w-full bg-black rounded-2xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Bukti Pemeliharaan"
              className="w-full h-auto max-h-[80vh] object-contain"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
