import React from 'react';
import { DatabaseStatus } from '@/types/database.types';

interface DatabaseOverviewCardProps {
  status: DatabaseStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const DatabaseOverviewCard: React.FC<DatabaseOverviewCardProps> = ({
  status,
  isLoading,
  onRefresh,
}) => {
  if (isLoading && !status) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-[#eae8e5] animate-pulse space-y-4 shadow-xs">
        <div className="h-5 w-48 bg-zinc-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-16 bg-zinc-100 rounded-xl" />
          <div className="h-16 bg-zinc-100 rounded-xl" />
          <div className="h-16 bg-zinc-100 rounded-xl" />
          <div className="h-16 bg-zinc-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const isConnected = status?.connected ?? false;
  const isMaintenance = status?.maintenanceMode ?? false;

  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Top Banner / Status Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eae8e5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b1c1a] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">database</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b1c1a]">PostgreSQL Production Engine</h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                {isConnected ? 'Connected & Healthy' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-[#8f6f6c] mt-0.5">
              Target database: <span className="font-mono font-semibold text-[#1b1c1a]">{status?.databaseName || 'cutlet_spring'}</span>
              <span className="mx-1.5">•</span>
              {status?.databaseType || 'PostgreSQL'} {status?.databaseVersion ? `(${status.databaseVersion.split(' ')[0]})` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-center px-3.5 py-2 text-xs font-bold text-[#585757] hover:text-[#1b1c1a] hover:bg-[#fbf9f6] rounded-xl border border-[#eae8e5] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Maintenance Mode Alert if active */}
      {isMaintenance && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900">
          <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">
            warning
          </span>
          <div className="text-xs space-y-1">
            <div className="font-bold uppercase tracking-wider">
              Maintenance Mode Active (HTTP 503 Enforced for Non-Admin Operations)
            </div>
            <p className="text-amber-800">
              {status?.maintenanceReason || 'A database restoration is currently in progress.'}
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Database Size */}
        <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5]">
          <div className="flex items-center justify-between text-[#8f6f6c] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Database Size</span>
            <span className="material-symbols-outlined text-[18px] text-[#af101a]">hard_drive</span>
          </div>
          <div className="font-price-numeral text-xl sm:text-2xl font-black text-[#1b1c1a]">
            {status?.databaseSize || 'N/A'}
          </div>
          <div className="text-[10px] text-[#8f6f6c] mt-1">Schema & indexes included</div>
        </div>

        {/* Public Tables */}
        <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5]">
          <div className="flex items-center justify-between text-[#8f6f6c] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Tables</span>
            <span className="material-symbols-outlined text-[18px] text-[#feae2c]">table_chart</span>
          </div>
          <div className="font-price-numeral text-xl sm:text-2xl font-black text-[#1b1c1a]">
            {status?.tableCount ?? 0}
          </div>
          <div className="text-[10px] text-[#8f6f6c] mt-1">Managed by Flyway V10</div>
        </div>

        {/* Total Records */}
        <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5]">
          <div className="flex items-center justify-between text-[#8f6f6c] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Records</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">data_array</span>
          </div>
          <div className="font-price-numeral text-xl sm:text-2xl font-black text-[#1b1c1a]">
            {status?.totalRecords ?? 0}
          </div>
          <div className="text-[10px] text-[#8f6f6c] mt-1">Live table rows</div>
        </div>

        {/* Last Backup */}
        <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5]">
          <div className="flex items-center justify-between text-[#8f6f6c] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Last Backup</span>
            <span className="material-symbols-outlined text-[18px] text-blue-600">verified</span>
          </div>
          <div className="text-xs font-bold text-[#1b1c1a] truncate" title={status?.lastBackupFilename || 'None'}>
            {status?.lastBackupTime
              ? new Date(status.lastBackupTime).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No Backup Yet'}
          </div>
          <div className="text-[10px] text-[#8f6f6c] mt-1 truncate" title={status?.lastBackupFilename || ''}>
            {status?.lastBackupFilename || 'Manual export available'}
          </div>
        </div>
      </div>
    </div>
  );
};

