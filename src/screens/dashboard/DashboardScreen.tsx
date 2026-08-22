import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { GlobalSearchBar } from '../../components/dashboard/GlobalSearchBar';
import { RadialSpeedDialFAB } from '../../components/dashboard/RadialSpeedDialFAB';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { IssueTokenModal } from '../../components/modals/IssueTokenModal';
import { AddPotentialTenantModal } from '../../components/modals/AddPotentialTenantModal';
import { PotentialTenantsListModal } from '../../components/modals/PotentialTenantsListModal';
import { AddResidentModal } from '../../components/modals/AddResidentModal';
import { QuickMaintenanceModal } from '../../components/modals/QuickMaintenanceModal';
import { formatCompactRupiah, formatRupiah } from '../../utils/formatters';
import {
  AlertTriangle,
  TrendingUp,
  Zap,
  Receipt,
  Gauge,
  CreditCard,
  Wrench,
  ChevronRight,
  ArrowUpRight,
  UserPlus,
  Users,
  Compass,
  MessageSquare,
  Phone,
  Sparkles
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    setCurrentTab,
    occupancyRate,
    occupiedUnitsCount,
    totalUnitsCount,
    totalRevenue,
    outstanding,
    transactions,
    maintenanceRequests,
    potentialTenants
  } = useApp();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isLeadsListModalOpen, setIsLeadsListModalOpen] = useState(false);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);
  const [isQuickMaintenanceModalOpen, setIsQuickMaintenanceModalOpen] = useState(false);

  const vacantCount = Math.max(0, totalUnitsCount - occupiedUnitsCount);

  // Group leads by source
  const sourceStats = potentialTenants.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title="Lewi House" />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#1A1C1E] tracking-tight">Overview</h2>
            <p className="text-xs text-[#43474E] font-medium">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#D4F7DC] text-[#005221] hover:bg-[#c1f3cc] active:scale-95 font-extrabold text-xs rounded-2xl transition-all shadow-2xs border border-[#008938]/30 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#008938]" />
            <span>+ Potential Tenant</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <GlobalSearchBar
          onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
          onOpenLeadsListModal={() => setIsLeadsListModalOpen(true)}
        />

        {/* Critical Alerts */}
        {outstanding > 0 && (
          <div className="rounded-2xl bg-[#FFB4AB]/40 border border-[#FFB4AB] p-4 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#690005]">Overdue Payments</h3>
              <p className="text-xs text-[#690005]/80 mt-0.5 font-medium">
                2 units have outstanding rent payments exceeding 5 days.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('RESIDENTS')}
              className="text-xs font-extrabold text-[#BA1A1A] hover:underline px-2 py-1"
            >
              VIEW
            </button>
          </div>
        )}

        {/* Metrics Section */}
        <section className="space-y-3.5">
          {/* Occupancy Rate Card (Dark Card Theme) */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1A1C1E] text-white p-5 shadow-md">
            {/* Background circle decoration */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFB4AB]" />
                <span className="text-[11px] font-bold text-white/80 tracking-widest uppercase">
                  OCCUPANCY RATE
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#FFDDAE] text-[#2A1800] text-[10px] font-black tracking-wider">
                {occupancyRate >= 80 ? 'HIGH' : 'NORMAL'}
              </span>
            </div>

            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-5xl font-black tracking-tight leading-none">
                {occupancyRate || 85}
              </span>
              <span className="text-xl font-bold text-white/70">%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#FFB4AB] rounded-full transition-all duration-500"
                style={{ width: `${occupancyRate || 85}%` }}
              />
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB4AB]" />
                <span>{occupiedUnitsCount || 15} Occupied</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span>{vacantCount || 3} Vacant</span>
              </div>
            </div>
          </div>

          {/* Collections & Token Req Dual Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Collections */}
            <div className="rounded-3xl bg-[#EADDFF] p-5 flex flex-col justify-between min-h-[160px] shadow-xs">
              <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center text-[#21005D]">
                <TrendingUp className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#21005D]/70 uppercase tracking-wider block mb-1">
                  COLLECTIONS
                </span>
                <span className="text-xl font-black text-[#21005D] block">
                  {formatCompactRupiah(totalRevenue || 42500000)}
                </span>
                <span className="text-[10px] font-bold text-[#21005D]/70 block mt-1">
                  Target: 50M
                </span>
              </div>
            </div>

            {/* Token Req */}
            <div className="rounded-3xl bg-[#D1E4FF] p-5 flex flex-col justify-between min-h-[160px] shadow-xs">
              <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center text-[#001D36]">
                <Zap className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#001D36]/70 uppercase tracking-wider block mb-1">
                  TOKEN REQ.
                </span>
                <span className="text-xl font-black text-[#001D36] block">4</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4]" />
                  <span className="text-[10px] font-bold text-[#001D36]/80">
                    Pending issuance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions (3 buttons on mobile/tablet) */}
        <section className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex flex-col items-center justify-center h-20 bg-[#0061A4] hover:bg-[#00518a] active:scale-[0.98] text-white rounded-2xl shadow-sm transition-all group p-2 text-center"
          >
            <Receipt className="w-5 h-5 mb-1 stroke-[2.2px] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold leading-tight">Record Payment</span>
          </button>

          <button
            onClick={() => setIsTokenModalOpen(true)}
            className="flex flex-col items-center justify-center h-20 bg-transparent hover:bg-[#0061A4]/5 active:scale-[0.98] text-[#0061A4] border-2 border-[#0061A4] rounded-2xl transition-all group p-2 text-center"
          >
            <Gauge className="w-5 h-5 mb-1 stroke-[2.2px] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold leading-tight">Issue Token</span>
          </button>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="flex flex-col items-center justify-center h-20 bg-[#D4F7DC] hover:bg-[#c1f3cc] active:scale-[0.98] text-[#005221] border border-[#008938]/30 rounded-2xl transition-all group p-2 text-center"
          >
            <UserPlus className="w-5 h-5 mb-1 text-[#008938] stroke-[2.2px] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-extrabold leading-tight">+ Potential Tenant</span>
          </button>
        </section>

        {/* Prospective Inquiries & Leads Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1A1C1E]">Potential Tenants & Inquiries</h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#D4F7DC] text-[#005221]">
                {potentialTenants.length} Leads
              </span>
            </div>
            <button
              onClick={() => setIsLeadsListModalOpen(true)}
              className="text-xs font-bold text-[#0061A4] hover:underline flex items-center gap-0.5"
            >
              Manage All →
            </button>
          </div>

          {/* Sources Summary Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5">
            {Object.entries(sourceStats).map(([src, count]) => (
              <button
                key={src}
                onClick={() => setIsLeadsListModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-white border border-[#C3C7CF]/40 text-[11px] font-bold text-[#43474E] hover:border-[#0061A4] flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>{src}</span>
                <span className="w-4 h-4 rounded-full bg-[#F3F0F5] text-[#1A1C1E] flex items-center justify-center text-[10px]">
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Top 2 Recent Leads Preview */}
          <div className="rounded-2xl bg-white border border-[#C3C7CF]/30 shadow-xs divide-y divide-[#C3C7CF]/20 overflow-hidden">
            {potentialTenants.slice(0, 2).map(lead => (
              <div key={lead.id} className="p-3.5 flex items-center justify-between gap-3">
                <div
                  onClick={() => setIsLeadsListModalOpen(true)}
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#D4F7DC] text-[#008938] flex items-center justify-center font-black text-xs shrink-0">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#1A1C1E] truncate">{lead.name}</p>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#D4F7DC] text-[#005221]">
                        {lead.source}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#43474E] truncate">
                      {lead.targetUnit ? `Looking for ${lead.targetUnit}` : 'Looking for room'} • {lead.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(lead.name)},%20terima%20kasih%20sudah%20menghubungi%20Lewi%20House%20via%20${encodeURIComponent(lead.source)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-[#DCF8C6] hover:bg-[#c9f1ac] text-[#075E54] transition-colors"
                    title="Send WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsLeadsListModalOpen(true)}
                    className="p-1.5 text-[#C3C7CF] hover:text-[#0061A4]"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#1A1C1E]">Recent Activity</h3>
            <button
              onClick={() => setCurrentTab('PAYMENTS')}
              className="text-xs font-bold text-[#0061A4] hover:underline"
            >
              See All
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-[#C3C7CF]/30 shadow-xs divide-y divide-[#C3C7CF]/20 overflow-hidden">
            {/* Activity 1 */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1A1C1E] truncate">
                  Payment received Unit 102
                </p>
                <p className="text-[11px] text-[#43474E]">Today, 09:45 AM</p>
              </div>
              <span className="text-xs font-extrabold text-[#21005D] shrink-0">
                +Rp 2.5M
              </span>
            </div>

            {/* Activity 2 */}
            <div
              onClick={() => setCurrentTab('MAINTENANCE')}
              className="p-4 flex items-center gap-3 hover:bg-[#F3F0F5]/50 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F3F0F5] text-[#43474E] flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1A1C1E] truncate">
                  Maintenance req Unit 205
                </p>
                <p className="text-[11px] text-[#43474E]">Yesterday, 14:20 PM</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C3C7CF]" />
            </div>

            {/* Activity 3 */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EADDFF] text-[#21005D] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1A1C1E] truncate">
                  Token Issued Unit 101
                </p>
                <p className="text-[11px] text-[#43474E]">Oct 24, 08:30 AM</p>
              </div>
              <span className="text-xs font-extrabold text-[#0061A4] shrink-0">
                Rp 100k
              </span>
            </div>
          </div>
        </section>
      </main>

      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
      <IssueTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
      <AddPotentialTenantModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
      />
      <PotentialTenantsListModal
        isOpen={isLeadsListModalOpen}
        onClose={() => setIsLeadsListModalOpen(false)}
        onOpenAddModal={() => setIsAddLeadModalOpen(true)}
      />
      <AddResidentModal
        isOpen={isAddResidentModalOpen}
        onClose={() => setIsAddResidentModalOpen(false)}
      />
      <QuickMaintenanceModal
        isOpen={isQuickMaintenanceModalOpen}
        onClose={() => setIsQuickMaintenanceModalOpen(false)}
      />

      {/* Floating Action Button with Radial Menu */}
      <RadialSpeedDialFAB
        onOpenNewTicket={() => setIsQuickMaintenanceModalOpen(true)}
        onOpenAddTenant={() => setIsAddResidentModalOpen(true)}
        onViewBills={() => setCurrentTab('PAYMENTS')}
      />
    </div>
  );
};

