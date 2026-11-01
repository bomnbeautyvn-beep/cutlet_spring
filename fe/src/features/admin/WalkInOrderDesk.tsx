import React, { useState } from 'react';

interface OrderTicket {
  ticketNumber: string;
  guestName: string;
  items: string[];
  seatType: 'COUNTER' | 'HALL';
  placedAt: string;
  status: 'QUEUED' | 'IN_FRYER' | 'RESTING' | 'SERVED';
  prepTimeRemaining: number; // minutes
}

const INITIAL_TICKETS: OrderTicket[] = [
  {
    ticketNumber: 'ORD-101',
    guestName: 'Counter Guest #3',
    items: ['Spring Signature Set (Special Tenderloin + Cheese + King Tiger Prawn)'],
    seatType: 'COUNTER',
    placedAt: '12:15 PM',
    status: 'IN_FRYER',
    prepTimeRemaining: 8,
  },
  {
    ticketNumber: 'ORD-102',
    guestName: 'Table H-4',
    items: ['Half & Half Pork Cutlet (Loin & Tenderloin)', 'Cold Buckwheat Noodle Set'],
    seatType: 'HALL',
    placedAt: '12:19 PM',
    status: 'IN_FRYER',
    prepTimeRemaining: 12,
  },
  {
    ticketNumber: 'ORD-103',
    guestName: 'Counter Guest #7',
    items: ['Cheese King Katsu (Overflowing Mozzarella)'],
    seatType: 'COUNTER',
    placedAt: '12:22 PM',
    status: 'QUEUED',
    prepTimeRemaining: 18,
  },
  {
    ticketNumber: 'ORD-104',
    guestName: 'Table H-2',
    items: ['Korean Retro Tonkatsu (L Size)', 'Sapporo Draft Beer (500ml)'],
    seatType: 'HALL',
    placedAt: '12:05 PM',
    status: 'SERVED',
    prepTimeRemaining: 0,
  },
];

export const WalkInOrderDesk: React.FC = () => {
  const [tickets, setTickets] = useState<OrderTicket[]>(INITIAL_TICKETS);
  const [filterSeat, setFilterSeat] = useState<'ALL' | 'COUNTER' | 'HALL'>('ALL');

  const advanceStatus = (ticketNumber: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketNumber !== ticketNumber) return t;
        const nextStatus: OrderTicket['status'] =
          t.status === 'QUEUED'
            ? 'IN_FRYER'
            : t.status === 'IN_FRYER'
            ? 'RESTING'
            : t.status === 'RESTING'
            ? 'SERVED'
            : 'SERVED';
        return {
          ...t,
          status: nextStatus,
          prepTimeRemaining: nextStatus === 'SERVED' ? 0 : Math.max(0, t.prepTimeRemaining - 5),
        };
      })
    );
  };

  const filteredTickets = tickets.filter(
    (t) => filterSeat === 'ALL' || t.seatType === filterSeat
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
            Walk-In Order Desk &amp; Kitchen Display
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            Real-time counter theater ticket management and precision kitchen frying queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSeat('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${
              filterSeat === 'ALL'
                ? 'bg-[#1b1c1a] text-white'
                : 'bg-white border border-[#eae8e5] text-[#585757]'
            }`}
          >
            All Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setFilterSeat('COUNTER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${
              filterSeat === 'COUNTER'
                ? 'bg-[#af101a] text-white'
                : 'bg-white border border-[#eae8e5] text-[#585757]'
            }`}
          >
            Counter Theater
          </button>
          <button
            onClick={() => setFilterSeat('HALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${
              filterSeat === 'HALL'
                ? 'bg-[#5b403d] text-white'
                : 'bg-white border border-[#eae8e5] text-[#585757]'
            }`}
          >
            Main Atelier Hall
          </button>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((t) => {
          const statusBadge =
            t.status === 'QUEUED'
              ? { text: 'In Queue', bg: 'bg-zinc-100 text-zinc-800 border-zinc-200' }
              : t.status === 'IN_FRYER'
              ? { text: 'Crisping in Fryer', bg: 'bg-amber-100 text-amber-900 border-amber-300' }
              : t.status === 'RESTING'
              ? { text: 'Resting & Slicing', bg: 'bg-blue-100 text-blue-900 border-blue-300' }
              : { text: 'Served to Guest', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };

          return (
            <div
              key={t.ticketNumber}
              className="p-5 bg-white rounded-2xl border border-[#eae8e5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#af101a] bg-[#af101a]/10 px-2 py-0.5 rounded">
                    {t.ticketNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${statusBadge.bg}`}
                  >
                    {statusBadge.text}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#1b1c1a]">{t.guestName}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#8f6f6c] mt-0.5">
                    <span>{t.seatType === 'COUNTER' ? 'Chef Counter Seating' : 'Atelier Hall Table'}</span>
                    <span>•</span>
                    <span>Placed {t.placedAt}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#585757]">
                    Dishes on Ticket:
                  </span>
                  {t.items.map((it, idx) => (
                    <div key={idx} className="font-medium text-[#1b1c1a] flex items-start gap-1.5">
                      <span className="text-[#af101a]">•</span>
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#eae8e5] flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-[10px] text-[#8f6f6c] uppercase font-bold block">
                    Estimated Time:
                  </span>
                  <span className="font-price-numeral font-bold text-[#1b1c1a]">
                    {t.prepTimeRemaining > 0 ? `${t.prepTimeRemaining} mins` : 'Complete'}
                  </span>
                </div>

                {t.status !== 'SERVED' && (
                  <button
                    onClick={() => advanceStatus(t.ticketNumber)}
                    className="px-3 py-1.5 bg-[#1b1c1a] hover:bg-[#af101a] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Advance Step
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

