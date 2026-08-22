import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { formatRupiah } from '../../utils/formatters';
import { DoorOpen, CheckCircle, Clock, Plus, Users } from 'lucide-react';

export const RoomsScreen: React.FC = () => {
  const { units, residents, t, language } = useApp();
  const [filter, setFilter] = useState<'All' | 'Occupied' | 'Vacant'>('All');

  const filteredUnits = units.filter(u => {
    if (filter === 'Occupied') return u.isOccupied;
    if (filter === 'Vacant') return !u.isOccupied;
    return true;
  });

  const getTabLabel = (tab: 'All' | 'Occupied' | 'Vacant') => {
    if (tab === 'All') return t.roomsFilterAll;
    if (tab === 'Occupied') return t.roomsFilterOccupied;
    return t.roomsFilterVacant;
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] pb-24">
      <TopBar title={t.roomsTitle} />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Filter Pills */}
        <div className="flex gap-2">
          {(['All', 'Occupied', 'Vacant'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-[#0061A4] text-white shadow-xs'
                  : 'bg-[#F3F0F5] text-[#43474E] hover:bg-[#e4e1e8]'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Units Grid */}
        <div className="space-y-3">
          {filteredUnits.map(unit => {
            const occupant = residents.find(r => r.room === unit.unitNumber);

            return (
              <div
                key={unit.id}
                className="p-4 bg-white rounded-2xl border border-[#C3C7CF]/30 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${
                      unit.isOccupied
                        ? 'bg-[#D1E4FF] text-[#001D36]'
                        : 'bg-[#F3F0F5] text-[#43474E]'
                    }`}
                  >
                    <DoorOpen className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1A1C1E]">{unit.unitNumber}</h3>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                          unit.isOccupied
                            ? 'bg-[#D1E4FF] text-[#001D36]'
                            : 'bg-[#FFDDAE] text-[#2A1800]'
                        }`}
                      >
                        {unit.isOccupied ? t.statusOccupied : t.statusVacant}
                      </span>
                    </div>
                    <p className="text-xs text-[#43474E] mt-0.5">
                      {unit.type} • {formatRupiah(unit.price)}{t.roomsPerMonth}
                    </p>
                    {unit.isOccupied && occupant && (
                      <p className="text-xs font-medium text-[#0061A4] mt-0.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {occupant.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
