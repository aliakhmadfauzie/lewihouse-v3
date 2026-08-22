import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { AddResidentModal } from '../../components/modals/AddResidentModal';
import { formatRupiah } from '../../utils/formatters';
import { Search, Plus, MessageSquare, Phone, MoreVertical } from 'lucide-react';

export const ResidentsScreen: React.FC = () => {
  const { residents, t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredResidents = residents.filter(
    r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title={t.residentsTitle} />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            placeholder={t.residentsSearchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#F3F0F5] border-none rounded-2xl text-sm placeholder-[#74777F] focus:outline-none focus:ring-2 focus:ring-[#0061A4] text-[#1A1C1E]"
          />
        </div>

        {/* Residents List */}
        <div className="space-y-3">
          {filteredResidents.map(resident => {
            const isPaid = resident.status === 'Paid';
            const isOverdue = resident.status === 'Overdue';

            const statusLabel = 
              resident.status === 'Paid' ? t.statusPaid :
              resident.status === 'Overdue' ? t.statusOverdue :
              t.statusPending;

            return (
              <div
                key={resident.id}
                className="p-4 bg-white rounded-2xl border border-[#C3C7CF]/30 shadow-xs flex items-center justify-between gap-3 hover:border-[#0061A4]/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F3F0F5] shrink-0 border border-[#C3C7CF]/40">
                    {resident.avatarUrl ? (
                      <img
                        src={resident.avatarUrl}
                        alt={resident.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#0061A4]">
                        {resident.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1A1C1E] truncate">
                        {resident.name}
                      </h3>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isPaid
                            ? 'bg-[#D1E4FF] text-[#001D36]'
                            : isOverdue
                            ? 'bg-[#FFB4AB] text-[#690005]'
                            : 'bg-[#FFDDAE] text-[#2A1800]'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <p className="text-xs text-[#43474E] mt-0.5">{resident.room}</p>

                    {isOverdue && resident.balance > 0 && (
                      <p className="text-xs font-bold text-[#BA1A1A] mt-1">
                        {t.residentsDueLabel} {formatRupiah(resident.balance)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`https://wa.me/?text=Halo%20${encodeURIComponent(resident.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-[#0061A4] hover:bg-[#D1E4FF]/40 transition-colors"
                    title={language === 'ID' ? 'Kirim pesan WhatsApp' : 'Send WhatsApp message'}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  {resident.phone && (
                    <a
                      href={`tel:${resident.phone}`}
                      className="p-2 rounded-xl text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
                      title={language === 'ID' ? 'Hubungi penghuni' : 'Call tenant'}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredResidents.length === 0 && (
            <div className="text-center py-12 text-[#74777F]">
              <p className="text-sm">{t.residentsNoResults} "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-6 z-20 w-14 h-14 rounded-2xl bg-[#0061A4] hover:bg-[#00518a] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all"
        title={t.residentsAddBtn}
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>

      <AddResidentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
