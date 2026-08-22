import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastNotification } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, AlertOctagon, X, Wrench, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  onNavigateToTicket?: (requestId?: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onNavigateToTicket
}) => {
  const { language, setCurrentTab, setIsNewRequestOpen } = useApp();

  return (
    <div
      id="toast-notification-container"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none flex flex-col gap-2.5 items-center"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isResolved = toast.status === 'Resolved' || toast.type === 'success';
          const isInProgress = toast.status === 'In Progress' || toast.type === 'warning';
          const isEmergency = toast.type === 'alert' || toast.title.toLowerCase().includes('darurat');

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -16 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`pointer-events-auto w-full rounded-2xl shadow-xl border overflow-hidden backdrop-blur-md transition-all ${
                isResolved
                  ? 'bg-white/95 border-[#0061A4]/30 text-[#1A1C1E]'
                  : isInProgress
                  ? 'bg-[#FFF8F0]/95 border-[#FFB4AB]/40 text-[#1A1C1E]'
                  : isEmergency
                  ? 'bg-[#FFDAD6]/95 border-[#BA1A1A]/30 text-[#410002]'
                  : 'bg-white/95 border-[#C3C7CF]/50 text-[#1A1C1E]'
              }`}
            >
              {/* Top Accent bar */}
              <div
                className={`h-1 w-full ${
                  isResolved
                    ? 'bg-[#0061A4]'
                    : isInProgress
                    ? 'bg-[#9C4300]'
                    : isEmergency
                    ? 'bg-[#BA1A1A]'
                    : 'bg-[#535F70]'
                }`}
              />

              <div className="p-3.5 flex items-start gap-3">
                {/* Status / Type Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isResolved
                      ? 'bg-[#D1E4FF] text-[#0061A4]'
                      : isInProgress
                      ? 'bg-[#FFDDAE] text-[#9C4300]'
                      : isEmergency
                      ? 'bg-[#FFB4AB] text-[#690005]'
                      : 'bg-[#F3F0F5] text-[#0061A4]'
                  }`}
                >
                  {isResolved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isInProgress ? (
                    <Wrench className="w-5 h-5" />
                  ) : isEmergency ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black tracking-tight text-[#1A1C1E]">
                        {toast.title}
                      </span>
                      {toast.unit && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#D1E4FF] text-[#001D36]">
                          {toast.unit}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-[#74777F] shrink-0">
                      {toast.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#43474E] leading-snug break-words">
                    {toast.message}
                  </p>

                  {/* Status Badge & Action Pill */}
                  <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[#C3C7CF]/20 text-[11px]">
                    {toast.status && (
                      <span
                        className={`font-black text-[10px] px-2 py-0.5 rounded-full uppercase ${
                          isResolved
                            ? 'bg-[#D1E4FF] text-[#003258]'
                            : isInProgress
                            ? 'bg-[#FFDDAE] text-[#4A2800]'
                            : 'bg-[#F3F0F5] text-[#43474E]'
                        }`}
                      >
                        {toast.status === 'Resolved'
                          ? (language === 'ID' ? 'Status: Selesai' : 'Status: Resolved')
                          : toast.status === 'In Progress'
                          ? (language === 'ID' ? 'Status: Dikerjakan' : 'Status: In Progress')
                          : (language === 'ID' ? 'Status: Menunggu' : 'Status: Pending')}
                      </span>
                    )}

                    <button
                      onClick={() => {
                        onDismiss(toast.id);
                        if (onNavigateToTicket) {
                          onNavigateToTicket(toast.requestId);
                        } else {
                          setIsNewRequestOpen(false);
                          setCurrentTab('MAINTENANCE');
                        }
                      }}
                      className="inline-flex items-center gap-0.5 font-bold text-[11px] text-[#0061A4] hover:underline ml-auto"
                    >
                      {language === 'ID' ? 'Lihat Tiket' : 'View Ticket'}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-[#74777F] hover:text-[#1A1C1E] p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0 -mr-1 -mt-1"
                  title="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
