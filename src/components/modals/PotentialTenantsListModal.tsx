import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PotentialTenant, TenantLeadSource } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  X,
  Users,
  Search,
  MessageSquare,
  Phone,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building,
  Trash2,
  Filter,
  DollarSign
} from 'lucide-react';

interface PotentialTenantsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal: () => void;
}

export const PotentialTenantsListModal: React.FC<PotentialTenantsListModalProps> = ({
  isOpen,
  onClose,
  onOpenAddModal
}) => {
  const { potentialTenants, deletePotentialTenant, updatePotentialTenant, convertLeadToResident, setCurrentTab, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
  const [convertSuccessMessage, setConvertSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sourcesList = ['All', ...Array.from(new Set(potentialTenants.map(l => l.source)))];
  const statusesList = ['All', 'New', 'Viewing Scheduled', 'Follow Up', 'Converted'];

  const filteredLeads = potentialTenants.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.targetUnit && lead.targetUnit.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = selectedSource === 'All' || lead.source === selectedSource;
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const handleConvert = (lead: PotentialTenant) => {
    setConvertingLeadId(lead.id);
    const newRes = convertLeadToResident(lead.id, lead.targetUnit, 0);
    setTimeout(() => {
      setConvertingLeadId(null);
      setConvertSuccessMessage(language === 'ID' 
        ? `Berhasil mengonversi ${lead.name} menjadi penghuni aktif di ${newRes?.room || 'kamar pilihan'}!`
        : `Successfully converted ${lead.name} to active resident in ${newRes?.room || 'assigned room'}!`);
      setTimeout(() => setConvertSuccessMessage(null), 4000);
    }, 400);
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'Mamikos':
        return 'bg-[#D4F7DC] text-[#005221] border-[#008938]/30';
      case 'Instagram':
        return 'bg-[#FDE2EC] text-[#D62976] border-[#D62976]/30';
      case 'WhatsApp':
        return 'bg-[#DCF8C6] text-[#075E54] border-[#128C7E]/30';
      case 'OLX':
        return 'bg-[#F3E5F5] text-[#4A148C] border-[#7B1FA2]/30';
      case 'Google Maps':
        return 'bg-[#E3F2FD] text-[#0D47A1] border-[#1976D2]/30';
      case 'Direct Walk-in':
        return 'bg-[#FFE0B2] text-[#E65100] border-[#E65100]/30';
      default:
        return 'bg-[#D1E4FF] text-[#001D36] border-[#0061A4]/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-[#D1E4FF] text-[#001D36]';
      case 'Viewing Scheduled':
        return 'bg-[#FFDDAE] text-[#2A1800]';
      case 'Follow Up':
        return 'bg-[#F3F0F5] text-[#43474E]';
      case 'Converted':
        return 'bg-[#D4F7DC] text-[#005221]';
      default:
        return 'bg-[#F3F0F5] text-[#43474E]';
    }
  };

  const getStatusLabel = (status: string) => {
    if (language !== 'ID') return status;
    switch (status) {
      case 'New': return t.statusNew;
      case 'Viewing Scheduled': return t.statusViewingScheduled;
      case 'Follow Up': return t.statusFollowUp;
      case 'Converted': return t.statusConverted;
      case 'Cancelled': return t.statusCancelled;
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FDFBFF] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 animate-in fade-in zoom-in-95 my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C3C7CF]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F7DC] text-[#008938] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#1A1C1E] tracking-tight">{t.leadsListTitle}</h2>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#D4F7DC] text-[#005221]">
                  {potentialTenants.length} {language === 'ID' ? 'Total Prospek' : 'Total'}
                </span>
              </div>
              <p className="text-xs text-[#43474E]">{t.leadsListSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAddModal();
              }}
              className="px-3 py-1.5 bg-[#0061A4] text-white hover:bg-[#00518a] rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" /> {t.leadsListAddNewBtn}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#43474E] hover:bg-[#F3F0F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success message banner */}
        {convertSuccessMessage && (
          <div className="mt-3 p-3 bg-[#D4F7DC] border border-[#008938]/30 rounded-2xl text-[#005221] text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#008938]" />
              <span>{convertSuccessMessage}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                setCurrentTab('RESIDENTS');
              }}
              className="text-xs underline font-black ml-2"
            >
              {language === 'ID' ? 'Buka Daftar Penghuni →' : 'View in Residents →'}
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-2.5 my-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              placeholder={t.leadsListSearchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#C3C7CF]/60 rounded-xl text-xs font-medium text-[#1A1C1E] placeholder-[#74777F] focus:outline-none focus:border-[#0061A4]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-bold text-[#43474E] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#0061A4]" /> {language === 'ID' ? 'Sumber:' : 'Source:'}
            </span>
            {sourcesList.map(src => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedSource === src
                    ? 'bg-[#0061A4] text-white shadow-2xs'
                    : 'bg-white border border-[#C3C7CF]/40 text-[#43474E] hover:bg-[#F3F0F5]'
                }`}
              >
                {src === 'All' ? t.all : src}
              </button>
            ))}
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {filteredLeads.map(lead => {
            const isConverted = lead.status === 'Converted';

            return (
              <div
                key={lead.id}
                className="p-4 bg-white rounded-2xl border border-[#C3C7CF]/40 shadow-xs hover:border-[#0061A4]/40 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#F3F0F5] border border-[#C3C7CF]/30 flex items-center justify-center font-black text-sm text-[#0061A4] shrink-0">
                      {lead.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black text-[#1A1C1E]">{lead.name}</h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getSourceBadge(lead.source)}`}>
                          {lead.source}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#43474E] mt-1">
                        <span className="font-semibold text-[#1A1C1E]">{lead.phone}</span>
                        {lead.email && <span>• {lead.email}</span>}
                        <span>• {language === 'ID' ? 'Masuk:' : 'Added'} {lead.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(t.leadsListDeleteConfirm)) {
                        deletePotentialTenant(lead.id);
                      }
                    }}
                    className="text-[#BA1A1A] hover:bg-[#FFDAD6] p-1.5 rounded-lg transition-colors"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Preference Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  {lead.targetUnit && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#D1E4FF]/60 text-[#001D36] font-bold">
                      <Building className="w-3 h-3 text-[#0061A4]" />
                      <span>{lead.targetUnit}</span>
                    </div>
                  )}
                  {lead.budget && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EADDFF]/60 text-[#21005D] font-bold">
                      <DollarSign className="w-3 h-3 text-[#21005D]" />
                      <span>{t.searchBudgetLabel} {formatRupiah(lead.budget)}/{language === 'ID' ? 'bln' : 'mo'}</span>
                    </div>
                  )}
                  {lead.expectedMoveInDate && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F3F0F5] text-[#43474E] font-medium">
                      <Calendar className="w-3 h-3 text-[#0061A4]" />
                      <span>{language === 'ID' ? 'Rencana Masuk:' : 'Move-in:'} {lead.expectedMoveInDate}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {lead.notes && (
                  <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#C3C7CF]/20 text-xs text-[#43474E] italic">
                    "{lead.notes}"
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#C3C7CF]/20">
                  {/* Contact Buttons */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(lead.name)},%20terima%20kasih%20sudah%20menghubungi%20Lewi%20House%20via%20${encodeURIComponent(lead.source)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#DCF8C6] hover:bg-[#c9f1ac] text-[#075E54] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-[#F3F0F5] hover:bg-[#e4e1e8] text-[#43474E] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> {t.leadsListCall}
                    </a>
                  </div>

                  {/* Status / Convert Action */}
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={e => updatePotentialTenant(lead.id, { status: e.target.value as any })}
                      className="px-2.5 py-1 bg-white border border-[#C3C7CF] rounded-lg text-xs font-bold text-[#1A1C1E] focus:outline-none"
                    >
                      <option value="New">{t.statusNew}</option>
                      <option value="Viewing Scheduled">{t.statusViewingScheduled}</option>
                      <option value="Follow Up">{t.statusFollowUp}</option>
                      <option value="Converted">{t.statusConverted}</option>
                      <option value="Cancelled">{t.statusCancelled}</option>
                    </select>

                    {!isConverted && (
                      <button
                        onClick={() => handleConvert(lead)}
                        disabled={convertingLeadId === lead.id}
                        className="px-3 py-1 bg-[#0061A4] hover:bg-[#00518a] active:scale-95 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-2xs transition-all"
                      >
                        <span>{convertingLeadId === lead.id ? t.leadsListConverting : t.leadsListConvertToResident}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-[#74777F]">
              <p className="text-sm font-medium">{t.leadsListNoResults}</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal();
                }}
                className="mt-3 text-xs font-bold text-[#0061A4] underline"
              >
                {t.leadsListAddNewBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

