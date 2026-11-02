import React, { useState } from 'react';

interface SeatSlot {
  id: string;
  label: string;
  occupied: boolean;
  guestName?: string;
  seatedAt?: string;
}

export const CounterTheaterSeating: React.FC = () => {
  // Counter theater: 10 seats
  const [counterSeats, setCounterSeats] = useState<SeatSlot[]>([
    { id: 'C-01', label: 'Counter 1', occupied: true, guestName: 'Lee J.', seatedAt: '12:10 PM' },
    { id: 'C-02', label: 'Counter 2', occupied: true, guestName: 'Lee J. (Guest)', seatedAt: '12:10 PM' },
    { id: 'C-03', label: 'Counter 3', occupied: true, guestName: 'Nguyen V.', seatedAt: '12:15 PM' },
    { id: 'C-04', label: 'Counter 4', occupied: false },
    { id: 'C-05', label: 'Counter 5', occupied: false },
    { id: 'C-06', label: 'Counter 6', occupied: false },
    { id: 'C-07', label: 'Counter 7', occupied: true, guestName: 'Tanaka K.', seatedAt: '12:22 PM' },
    { id: 'C-08', label: 'Counter 8', occupied: false },
    { id: 'C-09', label: 'Counter 9', occupied: false },
    { id: 'C-10', label: 'Counter 10', occupied: false },
  ]);

  const toggleSeat = (id: string) => {
    setCounterSeats((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              occupied: !s.occupied,
              guestName: !s.occupied ? 'Walk-In Guest' : undefined,
              seatedAt: !s.occupied ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            }
          : s
      )
    );
  };

  const occupiedCount = counterSeats.filter((s) => s.occupied).length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
          Chef Counter Theater &amp; Hall Seating
        </h1>
        <p className="text-xs text-[#585757] mt-0.5">
          Live seat occupancy map, counter theater direct view capacity, and dining hall table management
        </p>
      </div>

      {/* Utilization Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded border border-[#eae8e5] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8f6f6c] block mb-1">
            Chef Counter Occupancy
          </span>
          <div className="font-price-numeral text-3xl font-black text-[#af101a]">
            {occupiedCount} / 10 Seats
          </div>
          <div className="text-[11px] text-[#585757] mt-1">
            {10 - occupiedCount} seats currently available for walk-in dining
          </div>
        </div>

        <div className="p-5 bg-white rounded border border-[#eae8e5] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8f6f6c] block mb-1">
            Main Atelier Hall
          </span>
          <div className="font-price-numeral text-3xl font-black text-[#1b1c1a]">
            18 / 30 Seats
          </div>
          <div className="text-[11px] text-[#585757] mt-1">
            Table configuration: 6 tables of 4, 3 tables of 2
          </div>
        </div>

        <div className="p-5 bg-white rounded border border-[#eae8e5] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8f6f6c] block mb-1">
            Counter Theater Experience
          </span>
          <div className="text-xs font-bold text-[#1b1c1a] mt-1">
            Open-Kitchen Panko Fryer Front Line
          </div>
          <p className="text-[11px] text-[#585757] mt-1">
            Guests observe fresh cutlet breading and low-temperature oil immersion in real time.
          </p>
        </div>
      </div>

      {/* Counter Theater Interactive Seat Map */}
      <div className="p-6 bg-white rounded border border-[#eae8e5] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
          <div>
            <h3 className="font-headline-sm text-sm font-bold uppercase tracking-wider text-[#1b1c1a]">
              Chef Counter Theater Bar Layout (10 Dedicated Stools)
            </h3>
            <span className="text-[11px] text-[#8f6f6c]">
              Click on a stool to toggle guest walk-in occupancy
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="flex items-center gap-1.5 text-[#af101a] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#af101a]" />
              Seated Guest
            </span>
          </div>
        </div>

        {/* Fryer Kitchen Stage Line */}
        <div className="p-4 bg-[#1b1c1a] text-white rounded text-center space-y-1">
          <span className="font-kr-serif text-xs text-[#feae2c] font-bold block">
            오픈 키친 튀김대 • Panko Frying Stage Line
          </span>
          <span className="text-[11px] text-white/60">
            Open Fryer Theater &amp; Precision Cutting Station
          </span>
        </div>

        {/* 10 Stool Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {counterSeats.map((seat) => (
            <div
              key={seat.id}
              onClick={() => toggleSeat(seat.id)}
              className={`p-4 rounded border-2 transition-all cursor-pointer text-center space-y-2 ${
                seat.occupied
                  ? 'border-[#af101a] bg-[#af101a]/5 hover:bg-[#af101a]/10'
                  : 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[28px] ${
                    seat.occupied ? 'text-[#af101a]' : 'text-emerald-600'
                  }`}
                >
                  chair_alt
                </span>
              </div>
              <div className="font-bold text-xs text-[#1b1c1a]">{seat.label}</div>
              <div className="text-[10px]">
                {seat.occupied ? (
                  <div>
                    <span className="font-semibold text-[#af101a] block truncate">
                      {seat.guestName}
                    </span>
                    <span className="text-[#8f6f6c]">{seat.seatedAt}</span>
                  </div>
                ) : (
                  <span className="text-emerald-700 font-bold uppercase tracking-wider">
                    Available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

