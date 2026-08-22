import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import {
  Search,
  X,
  DoorOpen,
  User,
  Wrench,
  Users,
  ArrowUpRight,
  MessageSquare,
  Phone,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface GlobalSearchBarProps {
  onOpenAddLeadModal?: () => void;
  onOpenLeadsListModal?: () => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onOpenAddLeadModal,
  onOpenLeadsListModal
}) => {
  const {
    units,
    residents,
    maintenanceRequests,
    potentialTenants,
    setCurrentTab,
    language,
    t
  } = useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ROOMS' | 'TENANTS' | 'MAINTENANCE' | 'LEADS'>('ALL');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Search Rooms
  const matchedRooms = units.filter(u => {
    if (!cleanQuery) return false;
    const occupant = residents.find(r => r.room.toLowerCase() === u.unitNumber.toLowerCase());
    return (
      u.unitNumber.toLowerCase().includes(cleanQuery) ||
      u.type.toLowerCase().includes(cleanQuery) ||
      (occupant && occupant.name.toLowerCase().includes(cleanQuery)) ||
      ((cleanQuery.includes('vacant') || cleanQuery.includes('kosong')) && !u.isOccupied) ||
      ((cleanQuery.includes('occupied') || cleanQuery.includes('terisi') || cleanQuery.includes('penuh')) && u.isOccupied)
    );
  });

  // Search Residents
  const matchedResidents = residents.filter(r => {
    if (!cleanQuery) return false;
    return (
      r.name.toLowerCase().includes(cleanQuery) ||
      r.room.toLowerCase().includes(cleanQuery) ||
      r.email.toLowerCase().includes(cleanQuery) ||
      (r.phone && r.phone.toLowerCase().includes(cleanQuery)) ||
      ((cleanQuery.includes('overdue') || cleanQuery.includes('menunggak') || cleanQuery.includes('tunggakan')) && r.status === 'Overdue') ||
      ((cleanQuery.includes('paid') || cleanQuery.includes('lunas')) && r.status === 'Paid') ||
      (r.occupation && r.occupation.toLowerCase().includes(cleanQuery))
    );
  });

  // Search Maintenance
  const matchedMaintenance = maintenanceRequests.filter(m => {
    if (!cleanQuery) return false;
    return (
      m.issue.toLowerCase().includes(cleanQuery) ||
      m.unit.toLowerCase().includes(cleanQuery) ||
      (m.description && m.description.toLowerCase().includes(cleanQuery)) ||
      m.priority.toLowerCase().includes(cleanQuery) ||
      m.status.toLowerCase().includes(cleanQuery) ||
      ((cleanQuery.includes('emergency') || cleanQuery.includes('darurat') || cleanQuery.includes('mendesak')) && m.isEmergency)
    );
  });

  // Search Potential Tenants (Leads)
  const matchedLeads = potentialTenants.filter(l => {
    if (!cleanQuery) return false;
    return (
      l.name.toLowerCase().includes(cleanQuery) ||
      l.source.toLowerCase().includes(cleanQuery) ||
      l.phone.toLowerCase().includes(cleanQuery) ||
      (l.targetUnit && l.targetUnit.toLowerCase().includes(cleanQuery)) ||
      (l.notes && l.notes.toLowerCase().includes(cleanQuery)) ||
      l.status.toLowerCase().includes(cleanQuery)
    );
  });

  const totalMatches =
    matchedRooms.length +
    matchedResidents.length +
    matchedMaintenance.length +
    matchedLeads.length;

  const quickSuggestions = language === 'ID' ? [
    { label: t.searchSuggestionVacant, query: 'kosong' },
    { label: t.searchSuggestionOverdue, query: 'menunggak' },
    { label: t.searchSuggestionMamikos, query: 'mamikos' },
    { label: t.searchSuggestionEmergency, query: 'darurat' },
    { label: 'Kamar 101', query: '101' },
    { label: 'Kamar 205', query: '205' }
  ] : [
    { label: t.searchSuggestionVacant, query: 'vacant' },
    { label: t.searchSuggestionOverdue, query: 'overdue' },
    { label: t.searchSuggestionMamikos, query: 'mamikos' },
    { label: t.searchSuggestionEmergency, query: 'emergency' },
    { label: 'Room 101', query: '101' },
    { label: 'Room 205', query: '205' }
  ];

  const handleSelectSuggestion = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      {/* Search Input Bar */}
      <div
        className={`relative flex items-center bg-white rounded-2xl border transition-all shadow-xs ${
          isOpen
            ? 'border-[#0061A4] ring-2 ring-[#0061A4]/20 shadow-md'
            : 'border-[#C3C7CF]/60 hover:border-[#0061A4]/50'
        }`}
      >
        <div className="pl-3.5 pr-2 py-3 text-[#74777F] flex items-center">
          <Search className="w-5 h-5 text-[#0061A4]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={t.searchPlaceholder}
          className="w-full py-3 pr-10 text-xs sm:text-sm font-medium text-[#1A1C1E] placeholder-[#74777F] bg-transparent focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-full text-[#74777F] hover:bg-[#F3F0F5] hover:text-[#1A1C1E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-[#C3C7CF]/40 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95">
          {/* Filter Pills when querying */}
          {cleanQuery && (
            <div className="p-3 border-b border-[#C3C7CF]/20 bg-[#FDFBFF] flex items-center gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-[#0061A4] text-white shadow-2xs'
                    : 'bg-white border border-[#C3C7CF]/50 text-[#43474E] hover:bg-[#F3F0F5]'
                }`}
              >
                {t.searchFilterAll} ({totalMatches})
              </button>
              <button
                onClick={() => setActiveFilter('ROOMS')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'ROOMS'
                    ? 'bg-[#0061A4] text-white shadow-2xs'
                    : 'bg-white border border-[#C3C7CF]/50 text-[#43474E] hover:bg-[#F3F0F5]'
                }`}
              >
                {t.searchFilterRooms} ({matchedRooms.length})
              </button>
              <button
                onClick={() => setActiveFilter('TENANTS')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'TENANTS'
                    ? 'bg-[#0061A4] text-white shadow-2xs'
                    : 'bg-white border border-[#C3C7CF]/50 text-[#43474E] hover:bg-[#F3F0F5]'
                }`}
              >
                {t.searchFilterTenants} ({matchedResidents.length})
              </button>
              <button
                onClick={() => setActiveFilter('MAINTENANCE')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'MAINTENANCE'
                    ? 'bg-[#0061A4] text-white shadow-2xs'
                    : 'bg-white border border-[#C3C7CF]/50 text-[#43474E] hover:bg-[#F3F0F5]'
                }`}
              >
                {t.searchFilterMaintenance} ({matchedMaintenance.length})
              </button>
              <button
                onClick={() => setActiveFilter('LEADS')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'LEADS'
                    ? 'bg-[#0061A4] text-white shadow-2xs'
                    : 'bg-white border border-[#C3C7CF]/50 text-[#43474E] hover:bg-[#F3F0F5]'
                }`}
              >
                {t.searchFilterLeads} ({matchedLeads.length})
              </button>
            </div>
          )}

          {/* Results Area */}
          <div className="overflow-y-auto p-3 space-y-4 flex-1">
            {!cleanQuery ? (
              /* Quick Suggestions When Empty */
              <div className="space-y-3 p-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0061A4] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> {t.searchQuickSuggestions}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map(s => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handleSelectSuggestion(s.query)}
                      className="px-3 py-1.5 rounded-xl bg-[#F3F0F5] hover:bg-[#D1E4FF]/60 hover:text-[#001D36] text-xs font-bold text-[#43474E] transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#C3C7CF]/20">
                  <span className="text-[11px] font-bold text-[#74777F] block mb-2">{language === 'ID' ? 'PINTASAN MENU' : 'QUICK OVERVIEW'}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setCurrentTab('ROOMS');
                      }}
                      className="p-3 rounded-2xl bg-[#FDFBFF] border border-[#C3C7CF]/40 hover:border-[#0061A4] text-left flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <DoorOpen className="w-4 h-4 text-[#0061A4]" />
                        <span className="font-bold text-[#1A1C1E]">{language === 'ID' ? 'Lihat Semua Kamar' : 'View All Rooms'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C3C7CF] group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setCurrentTab('MAINTENANCE');
                      }}
                      className="p-3 rounded-2xl bg-[#FDFBFF] border border-[#C3C7CF]/40 hover:border-[#0061A4] text-left flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#0061A4]" />
                        <span className="font-bold text-[#1A1C1E]">{language === 'ID' ? 'Pusat Pemeliharaan' : 'Maintenance Hub'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C3C7CF] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ) : totalMatches === 0 ? (
              /* Empty State */
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#F3F0F5] text-[#74777F] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#1A1C1E]">{t.searchNoResults} "{query}"</p>
                <p className="text-[11px] text-[#74777F]">
                  {t.searchTryDifferent}
                </p>
                {onOpenAddLeadModal && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAddLeadModal();
                    }}
                    className="mt-2 text-xs font-bold text-[#0061A4] hover:underline"
                  >
                    {language === 'ID' ? `+ Catat "${query}" sebagai Calon Penghuni Baru` : `+ Record "${query}" as Potential Tenant Lead`}
                  </button>
                )}
              </div>
            ) : (
              /* Results List */
              <div className="space-y-4">
                {/* Rooms Section */}
                {(activeFilter === 'ALL' || activeFilter === 'ROOMS') && matchedRooms.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-[#43474E] uppercase tracking-wider px-1">
                      <span className="flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-[#0061A4]" /> {t.searchFilterRooms} ({matchedRooms.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setCurrentTab('ROOMS');
                        }}
                        className="text-[#0061A4] hover:underline font-bold"
                      >
                        {language === 'ID' ? 'Buka Manajemen Kamar →' : 'See in Rooms →'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {matchedRooms.map(room => {
                        const occupant = residents.find(r => r.room === room.unitNumber);
                        return (
                          <div
                            key={room.id}
                            onClick={() => {
                              setIsOpen(false);
                              setCurrentTab('ROOMS');
                            }}
                            className="p-3 bg-[#FDFBFF] hover:bg-[#D1E4FF]/30 border border-[#C3C7CF]/30 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                  room.isOccupied ? 'bg-[#D1E4FF] text-[#001D36]' : 'bg-[#FFDDAE] text-[#2A1800]'
                                }`}
                              >
                                <DoorOpen className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-[#1A1C1E]">{room.unitNumber}</h4>
                                  <span
                                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                                      room.isOccupied ? 'bg-[#D1E4FF] text-[#001D36]' : 'bg-[#FFDDAE] text-[#2A1800]'
                                    }`}
                                  >
                                    {room.isOccupied ? t.statusOccupied : t.statusVacant}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#43474E]">
                                  {room.type} • {formatRupiah(room.price)}/{language === 'ID' ? 'bln' : 'mo'}
                                  {occupant && <span className="text-[#0061A4] font-semibold"> • {language === 'ID' ? 'Penghuni:' : 'Occupant:'} {occupant.name}</span>}
                                </p>
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#74777F]" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tenants Section */}
                {(activeFilter === 'ALL' || activeFilter === 'TENANTS') && matchedResidents.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-[#43474E] uppercase tracking-wider px-1">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#0061A4]" /> {t.searchFilterTenants} ({matchedResidents.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setCurrentTab('RESIDENTS');
                        }}
                        className="text-[#0061A4] hover:underline font-bold"
                      >
                        {language === 'ID' ? 'Lihat Semua Penghuni →' : 'See in Residents →'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {matchedResidents.map(res => (
                        <div
                          key={res.id}
                          className="p-3 bg-[#FDFBFF] hover:bg-[#D1E4FF]/30 border border-[#C3C7CF]/30 rounded-2xl flex items-center justify-between transition-colors"
                        >
                          <div
                            onClick={() => {
                              setIsOpen(false);
                              setCurrentTab('RESIDENTS');
                            }}
                            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                              {res.avatarUrl ? (
                                <img src={res.avatarUrl} alt={res.name} className="w-full h-full object-cover" />
                              ) : (
                                res.name.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-[#1A1C1E] truncate">{res.name}</h4>
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                                    res.status === 'Paid'
                                      ? 'bg-[#D1E4FF] text-[#001D36]'
                                      : 'bg-[#FFB4AB] text-[#690005]'
                                  }`}
                                >
                                  {res.status === 'Paid' ? t.statusPaid : t.statusOverdue}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#43474E] truncate">
                                {res.room} • {res.email}
                                {res.balance > 0 && <span className="text-[#BA1A1A] font-bold"> • {t.searchDueNow} {formatRupiah(res.balance)}</span>}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <a
                              href={`https://wa.me/?text=Halo%20${encodeURIComponent(res.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-[#0061A4] hover:bg-[#D1E4FF] transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            {res.phone && (
                              <a
                                href={`tel:${res.phone}`}
                                className="p-1.5 rounded-lg text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
                                title="Telepon"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Maintenance Requests Section */}
                {(activeFilter === 'ALL' || activeFilter === 'MAINTENANCE') && matchedMaintenance.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-[#43474E] uppercase tracking-wider px-1">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#0061A4]" /> {t.searchFilterMaintenance} ({matchedMaintenance.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setCurrentTab('MAINTENANCE');
                        }}
                        className="text-[#0061A4] hover:underline font-bold"
                      >
                        {language === 'ID' ? 'Buka Menu Bantuan →' : 'See in Support →'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {matchedMaintenance.map(req => (
                        <div
                          key={req.id}
                          onClick={() => {
                            setIsOpen(false);
                            setCurrentTab('MAINTENANCE');
                          }}
                          className="p-3 bg-[#FDFBFF] hover:bg-[#D1E4FF]/30 border border-[#C3C7CF]/30 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                req.priority === 'High'
                                  ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                                  : 'bg-[#F3F0F5] text-[#43474E]'
                              }`}
                            >
                              <Wrench className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-[#1A1C1E]">{req.issue}</h4>
                                {req.isEmergency && (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#BA1A1A] text-white uppercase">
                                    {t.statusEmergency}
                                  </span>
                                )}
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#F3F0F5] text-[#43474E]">
                                  {req.status === 'Pending' ? t.statusPending : req.status === 'Resolved' ? (language === 'ID' ? 'Selesai' : 'Resolved') : (language === 'ID' ? 'Dalam Proses' : 'In Progress')}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#43474E]">
                                {req.unit} • {language === 'ID' ? 'Prioritas:' : 'Priority:'} <span className="font-semibold">{req.priority}</span> • {req.date}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-[#74777F]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Potential Tenants (Leads) Section */}
                {(activeFilter === 'ALL' || activeFilter === 'LEADS') && matchedLeads.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-[#43474E] uppercase tracking-wider px-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#008938]" /> {t.searchFilterLeads} ({matchedLeads.length})
                      </span>
                      {onOpenLeadsListModal && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onOpenLeadsListModal();
                          }}
                          className="text-[#008938] hover:underline font-bold"
                        >
                          {t.dashManageLeads} →
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {matchedLeads.map(lead => (
                        <div
                          key={lead.id}
                          className="p-3 bg-[#FDFBFF] hover:bg-[#D4F7DC]/30 border border-[#C3C7CF]/30 rounded-2xl flex items-center justify-between transition-colors"
                        >
                          <div
                            onClick={() => {
                              setIsOpen(false);
                              if (onOpenLeadsListModal) onOpenLeadsListModal();
                            }}
                            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#D4F7DC] text-[#008938] flex items-center justify-center font-bold text-xs shrink-0">
                              {lead.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-[#1A1C1E] truncate">{lead.name}</h4>
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#D4F7DC] text-[#005221]">
                                  {lead.source}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#F3F0F5] text-[#43474E]">
                                  {lead.status === 'New' ? t.statusNew : lead.status === 'Viewing Scheduled' ? t.statusViewingScheduled : lead.status === 'Follow Up' ? t.statusFollowUp : lead.status === 'Converted' ? t.statusConverted : lead.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#43474E] truncate">
                                {lead.phone}
                                {lead.targetUnit && <span> • {t.searchAssignedRoom} {lead.targetUnit}</span>}
                                {lead.budget && <span> • {t.searchBudgetLabel} {formatRupiah(lead.budget)}/{language === 'ID' ? 'bln' : 'mo'}</span>}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(lead.name)},%20terima%20kasih%20sudah%20menghubungi%20Lewi%20House.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-[#075E54] hover:bg-[#DCF8C6] transition-colors"
                              title="Chat WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1.5 rounded-lg text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
                              title="Telepon"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
