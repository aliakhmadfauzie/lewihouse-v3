import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Wrench, UserPlus, Receipt, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RadialSpeedDialFABProps {
  onOpenAddTenant: () => void;
  onOpenNewTicket: () => void;
  onViewBills: () => void;
}

export const RadialSpeedDialFAB: React.FC<RadialSpeedDialFABProps> = ({
  onOpenAddTenant,
  onOpenNewTicket,
  onViewBills
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useApp();

  // Close when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    {
      id: 'ticket',
      label: language === 'ID' ? 'Lapor Kerusakan' : 'New Maintenance Ticket',
      sublabel: language === 'ID' ? 'Buat tiket perbaikan kos' : 'Submit repair ticket',
      icon: Wrench,
      action: () => {
        closeMenu();
        onOpenNewTicket();
      },
      // Radial offset (angle ~ 160 deg)
      x: -78,
      y: -24,
      bgColor: 'bg-[#FFDDAE] dark:bg-[#783800]',
      textColor: 'text-[#2A1800] dark:text-[#FFDCC2]',
      iconColor: 'text-[#825500] dark:text-[#FFB951]',
      badgeColor: 'bg-[#825500] text-white'
    },
    {
      id: 'tenant',
      label: language === 'ID' ? 'Tambah Penghuni' : 'Add New Tenant',
      sublabel: language === 'ID' ? 'Registrasi data penyewa' : 'Register resident record',
      icon: UserPlus,
      action: () => {
        closeMenu();
        onOpenAddTenant();
      },
      // Radial offset (angle ~ 125 deg)
      x: -64,
      y: -82,
      bgColor: 'bg-[#D4F7DC] dark:bg-[#005221]',
      textColor: 'text-[#005221] dark:text-[#D4F7DC]',
      iconColor: 'text-[#008938] dark:text-[#67DC8B]',
      badgeColor: 'bg-[#008938] text-white'
    },
    {
      id: 'bills',
      label: language === 'ID' ? 'Lihat Tagihan' : 'View Bills & Ledger',
      sublabel: language === 'ID' ? 'Cek pembayaran & tunggakan' : 'Inspect rent & invoices',
      icon: Receipt,
      action: () => {
        closeMenu();
        onViewBills();
      },
      // Radial offset (angle ~ 90 deg / upward)
      x: -12,
      y: -108,
      bgColor: 'bg-[#D1E4FF] dark:bg-[#00497D]',
      textColor: 'text-[#001D36] dark:text-[#D1E4FF]',
      iconColor: 'text-[#0061A4] dark:text-[#9ECAFF]',
      badgeColor: 'bg-[#0061A4] text-white'
    }
  ];

  return (
    <>
      {/* Backdrop overlay when radial menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Container */}
      <div className="fixed bottom-20 sm:bottom-24 right-5 sm:right-8 z-50 flex items-center justify-center">
        {/* Radial Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: item.x,
                      y: item.y
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.2,
                      x: 0,
                      y: 0
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 24,
                      delay: index * 0.04
                    }}
                    className="absolute flex items-center justify-end pointer-events-auto group"
                    style={{ originX: 0.5, originY: 0.5 }}
                  >
                    {/* Tooltip / Label Pill on Left */}
                    <motion.button
                      type="button"
                      onClick={item.action}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.05 + 0.05 }}
                      className="absolute right-14 whitespace-nowrap px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E2024] border border-[#C3C7CF]/40 dark:border-[#44474F]/50 shadow-md hover:shadow-lg transition-all text-left active:scale-95 cursor-pointer flex flex-col items-end"
                    >
                      <span className="text-xs font-black text-[#1A1C1E] dark:text-[#E2E2E6] block">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#43474E] dark:text-[#8E9099] font-medium hidden sm:block">
                        {item.sublabel}
                      </span>
                    </motion.button>

                    {/* Circular Action Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={item.action}
                      className={`w-12 h-12 rounded-full ${item.bgColor} ${item.textColor} shadow-lg border-2 border-white dark:border-[#2D3139] flex items-center justify-center transition-transform cursor-pointer relative`}
                      title={item.label}
                    >
                      <IconComponent className={`w-5 h-5 ${item.iconColor} stroke-[2.4px]`} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <motion.button
          type="button"
          onClick={toggleMenu}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-colors cursor-pointer relative z-50 ${
            isOpen
              ? 'bg-[#BA1A1A] hover:bg-[#93000A] shadow-[#BA1A1A]/30'
              : 'bg-gradient-to-tr from-[#0061A4] to-[#0081D6] hover:from-[#00518a] hover:to-[#006fb8] shadow-[#0061A4]/40'
          }`}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close quick action menu' : 'Open quick action menu'}
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            {isOpen ? <X className="w-6 h-6 stroke-[2.5px]" /> : <Plus className="w-7 h-7 stroke-[2.5px]" />}
          </motion.div>

          {/* Subtle pulse ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#0061A4]/25 animate-ping pointer-events-none -z-10" />
          )}
        </motion.button>
      </div>
    </>
  );
};
