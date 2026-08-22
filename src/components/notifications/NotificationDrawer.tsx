import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastNotification } from '../../types';
import { Bell, CheckCircle2, Clock, Wrench, AlertOctagon, Trash2, X, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notificationHistory,
    clearAllNotifications,
    simulateMaintenanceUpdate,
    setCurrentTab,
    setIsNewRequestOpen,
    language,
    t
  } = useApp();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FDFBFF] shadow-2xl z-50 flex flex-col border-l border-[#C3C7CF]/30"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-[#C3C7CF]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#1A1C1E]">{t.toastNotificationsTitle}</h2>
                  <p className="text-[11px] text-[#43474E]">
                    {notificationHistory.length} {language === 'ID' ? 'notifikasi update tiket' : 'ticket update alerts'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {notificationHistory.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="p-2 text-[#BA1A1A] hover:bg-[#FFDAD6]/50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                    title={t.toastClearAll}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.toastClearAll}</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-[#43474E] hover:bg-black/5 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Test / Action Bar */}
            <div className="px-4 py-2.5 bg-[#EFF4FA] border-b border-[#C3C7CF]/20 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#0061A4] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {language === 'ID' ? 'Uji Notifikasi Real-Time' : 'Test Real-Time Alert'}
              </span>
              <button
                onClick={() => simulateMaintenanceUpdate()}
                className="px-2.5 py-1 bg-[#0061A4] hover:bg-[#004d84] text-white text-[11px] font-bold rounded-lg transition-all active:scale-95 shadow-2xs"
              >
                + {language === 'ID' ? 'Simulasi Update' : 'Simulate Update'}
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notificationHistory.length === 0 ? (
                <div className="text-center py-16 text-[#74777F] space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#F3F0F5] mx-auto flex items-center justify-center text-[#74777F]">
                    <Bell className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="text-xs font-medium">{t.toastNoNotifications}</p>
                  <button
                    onClick={() => simulateMaintenanceUpdate()}
                    className="mt-2 text-xs font-bold text-[#0061A4] underline"
                  >
                    {language === 'ID' ? 'Klik di sini untuk mencoba notifikasi update' : 'Click here to test status update toast'}
                  </button>
                </div>
              ) : (
                notificationHistory.map((notif) => {
                  const isResolved = notif.status === 'Resolved';
                  const isInProgress = notif.status === 'In Progress';

                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setIsNewRequestOpen(false);
                        setCurrentTab('MAINTENANCE');
                        onClose();
                      }}
                      className="p-3.5 bg-white rounded-2xl border border-[#C3C7CF]/30 shadow-xs hover:border-[#0061A4]/50 cursor-pointer transition-all active:scale-[0.99] group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isResolved
                              ? 'bg-[#D1E4FF] text-[#0061A4]'
                              : isInProgress
                              ? 'bg-[#FFDDAE] text-[#9C4300]'
                              : 'bg-[#F3F0F5] text-[#535F70]'
                          }`}
                        >
                          {isResolved ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isInProgress ? (
                            <Wrench className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-[#1A1C1E]">{notif.title}</span>
                              {notif.unit && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#D1E4FF] text-[#001D36]">
                                  {notif.unit}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#74777F]">{notif.timestamp}</span>
                          </div>

                          <p className="text-xs text-[#43474E] leading-snug mt-1">{notif.message}</p>

                          <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[#C3C7CF]/20 text-[11px]">
                            {notif.status && (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  isResolved
                                    ? 'bg-[#D1E4FF] text-[#003258]'
                                    : isInProgress
                                    ? 'bg-[#FFDDAE] text-[#4A2800]'
                                    : 'bg-[#F3F0F5] text-[#43474E]'
                                }`}
                              >
                                {notif.status === 'Resolved'
                                  ? (language === 'ID' ? 'Selesai' : 'Resolved')
                                  : notif.status === 'In Progress'
                                  ? (language === 'ID' ? 'Sedang Dikerjakan' : 'In Progress')
                                  : (language === 'ID' ? 'Menunggu' : 'Pending')}
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-[#0061A4] group-hover:underline flex items-center gap-0.5 ml-auto">
                              {language === 'ID' ? 'Buka' : 'Open'} <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
