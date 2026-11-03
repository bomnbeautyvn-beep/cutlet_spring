import React, { useState } from 'react';

export interface ErrorScreenProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  title?: string;
  message?: string;
  sectionName?: string;
  isFullScreen?: boolean;
  onRetry?: () => void;
  onReload?: () => void;
  onGoHome?: () => void;
  onGoAdmin?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  errorInfo,
  title = 'Oops! Đã xảy ra sự cố ngoài ý muốn',
  message = 'Trang web vừa gặp lỗi kỹ thuật trong quá trình xử lý giao diện. Dữ liệu của bạn không bị mất. Bạn có thể thử khôi phục bên dưới.',
  sectionName,
  isFullScreen = true,
  onRetry,
  onReload,
  onGoHome,
  onGoAdmin,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (onRetry) {
        onRetry();
      } else {
        window.location.reload();
      }
    }, 400);
  };

  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoAdmin = () => {
    if (onGoAdmin) {
      onGoAdmin();
    } else {
      window.location.href = '/admin';
    }
  };

  const errorReportText = [
    `=== CUTLET SPRING ERROR REPORT ===`,
    `Section: ${sectionName || 'Global Root'}`,
    `Time: ${new Date().toISOString()}`,
    `URL: ${window.location.href}`,
    `UserAgent: ${navigator.userAgent}`,
    error ? `Error: ${error.name}: ${error.message}` : 'No Error Object',
    error?.stack ? `\nStack Trace:\n${error.stack}` : '',
    errorInfo?.componentStack ? `\nComponent Stack:\n${errorInfo.componentStack}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const handleCopyReport = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(errorReportText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = errorReportText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy error report:', err);
    }
  };

  const containerClasses = isFullScreen
    ? 'min-h-screen w-full bg-[#fbf9f6] text-[#1b1c1a] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-x-hidden'
    : 'w-full bg-[#fbf9f6] text-[#1b1c1a] py-12 px-4 sm:px-8 flex flex-col items-center justify-center rounded border border-[#eae8e5] my-4';

  const cardClasses = isFullScreen
    ? 'w-full max-w-xl bg-white border border-[#eae8e5] rounded shadow-xl p-6 sm:p-8 space-y-6 relative animate-scale-in text-center'
    : 'w-full max-w-xl bg-white border border-[#eae8e5] rounded shadow-md p-6 sm:p-8 space-y-6 relative text-center';

  const isCurrentAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/fe/admin');

  return (
    <div className={containerClasses}>
      {/* Background Decorative subtle grain / glow */}
      {isFullScreen && (
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#af101a_1px,transparent_1px)] [background-size:24px_24px] -z-10" />
      )}

      <div className={cardClasses}>
        {/* Brand Header Tag */}
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f2ed] border border-[#d2cec9] rounded text-[10px] uppercase font-bold tracking-widest text-[#8f6f6c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#af101a] animate-pulse" />
            Cutlet Spring • 봄돈까스
            {sectionName && <span className="text-[#1b1c1a]/60">| {sectionName}</span>}
          </span>
        </div>

        {/* Visual Icon Illustration */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded bg-red-50 border border-red-200 flex items-center justify-center text-[#af101a] shadow-inner">
              <span className="material-symbols-outlined text-[44px]">sentiment_dissatisfied</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded bg-[#af101a] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[16px]">warning</span>
            </div>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b1c1a] tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#585757] leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        {/* Status / Safety Notice */}
        <div className="p-3 bg-[#fbf9f6] border border-[#eae8e5] rounded text-left flex items-start gap-3">
          <span className="material-symbols-outlined text-[#8f6f6c] text-[18px] shrink-0 mt-0.5">
            verified_user
          </span>
          <div className="text-[11px] text-[#585757] space-y-0.5 leading-normal">
            <span className="font-bold text-[#1b1c1a] block">An Toàn &amp; Bảo Mật Dữ Liệu</span>
            Hệ thống quản lý dữ liệu không bị ảnh hưởng. Bạn có thể nhấn nút thử lại hoặc tải lại để tiếp tục thao tác.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#af101a] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#8f0d15] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRetrying ? 'animate-spin' : ''}`}>
              replay
            </span>
            <span>{isRetrying ? 'Đang khôi phục...' : 'Thử Lại Ngay'}</span>
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#d2cec9] text-[#1b1c1a] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#f5f2ed] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Tải Lại Trang</span>
          </button>
        </div>

        {/* Navigation Escape Hatches */}
        <div className="pt-2 border-t border-[#eae8e5] flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            type="button"
            onClick={handleGoHome}
            className="text-[#8f6f6c] hover:text-[#af101a] transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Quay về Trang Chủ</span>
          </button>

          {isCurrentAdmin && (
            <button
              type="button"
              onClick={handleGoAdmin}
              className="text-[#8f6f6c] hover:text-[#af101a] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span>Về Bảng Điều Khiển Admin</span>
            </button>
          )}
        </div>

        {/* Diagnostic Accordion */}
        {(error || errorInfo) && (
          <div className="pt-2 text-left">
            <button
              type="button"
              onClick={() => setIsDetailsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-[11px] text-[#8f6f6c] hover:text-[#1b1c1a] py-1 cursor-pointer transition-colors"
            >
              <span className="font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                Chi tiết kỹ thuật (Dành cho Kỹ thuật viên)
              </span>
              <span className="material-symbols-outlined text-[16px] transition-transform duration-200">
                {isDetailsOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isDetailsOpen && (
              <div className="mt-2 p-3 bg-[#1b1c1a] text-[#eae8e5] rounded text-left border border-black/40 space-y-2 animate-fade-in font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-red-400 font-bold break-all">
                    {error?.name || 'Error'}: {error?.message || 'Unknown runtime error'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="shrink-0 ml-2 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 text-[10px] text-white/70 select-text font-mono leading-relaxed pr-1 scrollbar-thin">
                  {error?.stack && (
                    <pre className="whitespace-pre-wrap break-all">{error.stack}</pre>
                  )}
                  {errorInfo?.componentStack && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-white/40 block mb-0.5">Component Stack:</span>
                      <pre className="whitespace-pre-wrap break-all text-white/60">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
