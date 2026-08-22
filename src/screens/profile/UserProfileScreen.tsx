import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { AvatarUploadModal } from '../../components/modals/AvatarUploadModal';
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Home,
  Briefcase,
  Bell,
  Camera,
  LogOut,
  Save,
  Globe,
  Smartphone,
  ShieldCheck,
  UserCheck,
  Moon,
  Sun
} from 'lucide-react';

export const UserProfileScreen: React.FC = () => {
  const {
    currentUserProfile,
    updateCurrentUserProfile,
    changePassword,
    userRole,
    signOut,
    language,
    toggleLanguage,
    isDarkMode,
    toggleDarkMode,
    setCurrentTab,
    t
  } = useApp();

  const [activeSection, setActiveSection] = useState<'CONTACT' | 'SECURITY' | 'PREFERENCES'>('CONTACT');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Form states for Contact Info
  const [formData, setFormData] = useState({
    name: currentUserProfile.name || '',
    email: currentUserProfile.email || '',
    phone: currentUserProfile.phone || '',
    emergencyContactName: currentUserProfile.emergencyContactName || '',
    emergencyContactPhone: currentUserProfile.emergencyContactPhone || '',
    occupation: currentUserProfile.occupation || '',
    room: currentUserProfile.room || ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status feedback states
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);
  const [contactErrorMsg, setContactErrorMsg] = useState<string | null>(null);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preferences toggles
  const [preferences, setPreferences] = useState({
    whatsappAlerts: true,
    emailReceipts: true,
    maintenanceUpdates: true,
    twoFactorAuth: false
  });

  useEffect(() => {
    setFormData({
      name: currentUserProfile.name || '',
      email: currentUserProfile.email || '',
      phone: currentUserProfile.phone || '',
      emergencyContactName: currentUserProfile.emergencyContactName || '',
      emergencyContactPhone: currentUserProfile.emergencyContactPhone || '',
      occupation: currentUserProfile.occupation || '',
      room: currentUserProfile.room || ''
    });
  }, [currentUserProfile]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactErrorMsg(null);
    setContactSuccessMsg(null);

    if (!formData.name.trim()) {
      setContactErrorMsg(language === 'ID' ? 'Nama lengkap wajib diisi.' : 'Full Name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setContactErrorMsg(language === 'ID' ? 'Alamat email valid wajib diisi.' : 'A valid Email address is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setContactErrorMsg(language === 'ID' ? 'Nomor telepon wajib diisi.' : 'Phone number is required.');
      return;
    }

    setIsSavingContact(true);
    setTimeout(() => {
      updateCurrentUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        occupation: formData.occupation.trim()
      });
      setIsSavingContact(false);
      setContactSuccessMsg(language === 'ID' ? 'Informasi kontak berhasil disimpan!' : 'Contact details updated successfully!');
      setTimeout(() => setContactSuccessMsg(null), 4000);
    }, 400);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);

    if (!passwordData.currentPassword) {
      setPasswordErrorMsg(language === 'ID' ? 'Silakan masukkan kata sandi saat ini.' : 'Please enter your current password.');
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordErrorMsg(language === 'ID' ? 'Silakan masukkan kata sandi baru.' : 'Please enter a new password.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordErrorMsg(language === 'ID' ? 'Kata sandi baru minimal 6 karakter.' : 'New password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMsg(language === 'ID' ? 'Kata sandi baru dan konfirmasi tidak cocok.' : 'New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      const result = changePassword(passwordData.currentPassword, passwordData.newPassword);
      setIsUpdatingPassword(false);
      if (result.success) {
        setPasswordSuccessMsg(language === 'ID' ? 'Kata sandi berhasil diperbarui!' : 'Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordSuccessMsg(null), 5000);
      } else {
        setPasswordErrorMsg(language === 'ID' ? 'Kata sandi saat ini salah.' : result.message);
      }
    }, 500);
  };

  const roleBadgeInfo = {
    ADMIN: { label: language === 'ID' ? 'Pengelola Kost (Admin)' : 'Property Manager (Admin)', bg: 'bg-[#0061A4]', text: 'text-white' },
    TENANT: { label: language === 'ID' ? 'Penghuni Terverifikasi' : 'Verified Resident (Tenant)', bg: 'bg-[#0061A4]', text: 'text-white' },
    DEVELOPER: { label: language === 'ID' ? 'Pengembang / Superadmin' : 'Developer / Superadmin', bg: 'bg-[#21005D]', text: 'text-white' }
  }[userRole];

  return (
    <div className="min-h-screen bg-[#FDFBFF] dark:bg-[#111318] pb-28 text-[#1A1C1E] dark:text-[#E2E2E6] transition-colors duration-200">
      <TopBar title={t.profileTitle} />

      <main className="max-w-md md:max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {/* Profile Card Header */}
        <section className="rounded-3xl bg-white dark:bg-[#191C20] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#0061A4] dark:border-[#9ECAFF] shadow-sm active:scale-95 transition-all group block"
                title={t.profilePhotoChangeBtn}
              >
                {currentUserProfile.avatarUrl ? (
                  <img
                    src={currentUserProfile.avatarUrl}
                    alt={currentUserProfile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[#D1E4FF] dark:bg-[#00497D] text-[#0061A4] dark:text-[#9ECAFF] flex items-center justify-center font-extrabold text-2xl">
                    {currentUserProfile.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>{t.profilePhotoChangeBtn}</span>
                </div>
              </button>
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0061A4] text-white rounded-full flex items-center justify-center shadow-xs hover:bg-[#004d84] transition-colors"
                title={t.profilePhotoChangeBtn}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${roleBadgeInfo.bg} ${roleBadgeInfo.text}`}>
                    {roleBadgeInfo.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1E4FF] dark:bg-[#00497D] text-[#001D36] dark:text-[#D1E4FF] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0061A4] dark:text-[#9ECAFF]" /> {language === 'ID' ? 'Akun Aktif' : 'Active Account'}
                  </span>
                </div>

                <button
                  onClick={() => setShowLogoutConfirmModal(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFDAD6] dark:bg-[#93000A]/40 text-[#BA1A1A] dark:text-[#FFB4AB] hover:bg-[#ffc6c0] dark:hover:bg-[#93000A]/60 font-bold text-xs rounded-xl transition-all active:scale-95 shadow-2xs"
                  title={t.profileLogoutBtn}
                >
                  <LogOut className="w-3.5 h-3.5" /> {t.profileLogoutBtn}
                </button>
              </div>

              <h2 className="text-xl font-black text-[#1A1C1E] dark:text-[#E2E2E6] tracking-tight">{currentUserProfile.name}</h2>
              <p className="text-xs text-[#43474E] dark:text-[#C4C6D0] font-medium">{currentUserProfile.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 pt-2.5 border-t border-[#C3C7CF]/20 dark:border-[#44474F]/30 text-[11px] text-[#43474E] dark:text-[#C4C6D0]">
                {currentUserProfile.room && (
                  <span className="flex items-center gap-1 font-semibold text-[#0061A4] dark:text-[#9ECAFF]">
                    <Home className="w-3.5 h-3.5" /> {currentUserProfile.room}
                  </span>
                )}
                {currentUserProfile.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#74777F] dark:text-[#8E9099]" /> {currentUserProfile.occupation}
                  </span>
                )}
                <span className="text-[#74777F] dark:text-[#8E9099]">
                  {language === 'ID' ? 'Anggota sejak' : 'Member since'} {currentUserProfile.memberSince || '2025'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <div className="flex rounded-2xl bg-[#F3F0F5] dark:bg-[#22262D] p-1 border border-[#C3C7CF]/30 dark:border-[#44474F]/40 shadow-xs">
          <button
            onClick={() => setActiveSection('CONTACT')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSection === 'CONTACT'
                ? 'bg-white dark:bg-[#2A2D34] text-[#0061A4] dark:text-[#9ECAFF] shadow-xs'
                : 'text-[#43474E] dark:text-[#C4C6D0] hover:text-[#1A1C1E] dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> {t.profileTabContact}
          </button>
          <button
            onClick={() => setActiveSection('SECURITY')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSection === 'SECURITY'
                ? 'bg-white dark:bg-[#2A2D34] text-[#0061A4] dark:text-[#9ECAFF] shadow-xs'
                : 'text-[#43474E] dark:text-[#C4C6D0] hover:text-[#1A1C1E] dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" /> {t.profileTabSecurity}
          </button>
          <button
            onClick={() => setActiveSection('PREFERENCES')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSection === 'PREFERENCES'
                ? 'bg-white dark:bg-[#2A2D34] text-[#0061A4] dark:text-[#9ECAFF] shadow-xs'
                : 'text-[#43474E] dark:text-[#C4C6D0] hover:text-[#1A1C1E] dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" /> {t.profileTabPreferences}
          </button>
        </div>

        {/* TAB 1: CONTACT INFORMATION */}
        {activeSection === 'CONTACT' && (
          <section className="rounded-3xl bg-white dark:bg-[#191C20] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D1E4FF] dark:bg-[#00497D] text-[#0061A4] dark:text-[#9ECAFF] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">
                    {language === 'ID' ? 'Rincian Data Pribadi' : 'Personal Details'}
                  </h3>
                  <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">
                    {language === 'ID' ? 'Perbarui informasi kontak dan data diri Anda' : 'Update your contact and personal information'}
                  </p>
                </div>
              </div>
            </div>

            {contactSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-[#D1E4FF] dark:bg-[#00497D]/50 text-[#001D36] dark:text-[#D1E4FF] flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#0061A4] dark:text-[#9ECAFF] shrink-0" />
                <span>{contactSuccessMsg}</span>
              </div>
            )}

            {contactErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#FFDAD6] dark:bg-[#93000A]/40 text-[#410002] dark:text-[#FFDAD6] flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-[#BA1A1A] dark:text-[#FFB4AB] shrink-0" />
                <span>{contactErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                  {t.profileFullName} <span className="text-[#BA1A1A]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'ID' ? 'Masukkan nama lengkap' : 'Enter your full name'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {t.profileEmail} <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="misal: nama@contoh.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {t.profilePhone} <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {t.profileOccupation}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                      placeholder={language === 'ID' ? 'misal: Software Engineer / Mahasiswa' : 'e.g. Software Engineer'}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {t.profileRoom}
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.room || (userRole === 'ADMIN' ? (language === 'ID' ? 'Kantor Pengelola' : 'Headquarters Office') : 'Room 102')}
                      disabled
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/40 dark:border-[#44474F]/30 bg-[#F3F0F5] dark:bg-[#1C1E23] text-xs font-medium text-[#74777F] dark:text-[#8E9099] cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Sub-section */}
              <div className="pt-3 border-t border-[#C3C7CF]/20 dark:border-[#44474F]/30">
                <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] mb-2.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0061A4] dark:text-[#9ECAFF]" /> {language === 'ID' ? 'Kontak Darurat' : 'Emergency Contact'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                      {t.profileEmergencyName}
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder={language === 'ID' ? 'misal: Dewi Sartika (Istri/Keluarga)' : 'e.g. Dewi Sartika (Spouse)'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                      {t.profileEmergencyPhone}
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingContact}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0061A4] hover:bg-[#004d84] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSavingContact ? t.saving : t.profileSaveContactBtn}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 2: CHANGE PASSWORD & SECURITY */}
        {activeSection === 'SECURITY' && (
          <section className="rounded-3xl bg-white dark:bg-[#191C20] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D1E4FF] dark:bg-[#00497D] text-[#0061A4] dark:text-[#9ECAFF] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">
                    {language === 'ID' ? 'Ubah Kata Sandi' : 'Change Password'}
                  </h3>
                  <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">
                    {language === 'ID' ? 'Perbarui kata sandi akun Anda secara berkala' : 'Keep your account secure with regular updates'}
                  </p>
                </div>
              </div>
            </div>

            {passwordSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-[#D1E4FF] dark:bg-[#00497D]/50 text-[#001D36] dark:text-[#D1E4FF] flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#0061A4] dark:text-[#9ECAFF] shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#FFDAD6] dark:bg-[#93000A]/40 text-[#410002] dark:text-[#FFDAD6] flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-[#BA1A1A] dark:text-[#FFB4AB] shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                  {t.profileCurrentPassword} <span className="text-[#BA1A1A]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder={language === 'ID' ? 'Masukkan kata sandi saat ini' : 'Enter current password'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777F] dark:text-[#8E9099] hover:text-[#1A1C1E] dark:hover:text-white"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {t.profileNewPassword} <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder={language === 'ID' ? 'Minimal 6 karakter' : 'Minimum 6 characters'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777F] dark:text-[#8E9099] hover:text-[#1A1C1E] dark:hover:text-white"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] mb-1">
                    {t.profileConfirmPassword} <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#74777F] dark:text-[#8E9099] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder={language === 'ID' ? 'Ulangi kata sandi baru' : 'Re-enter new password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 bg-[#FDFBFF] dark:bg-[#22262D] text-xs font-medium text-[#1A1C1E] dark:text-[#E2E2E6] focus:outline-none focus:border-[#0061A4] dark:focus:border-[#9ECAFF] focus:ring-1 focus:ring-[#0061A4]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777F] dark:text-[#8E9099] hover:text-[#1A1C1E] dark:hover:text-white"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength checklist */}
              <div className="p-3.5 rounded-2xl bg-[#F3F0F5] dark:bg-[#22262D] border border-[#C3C7CF]/20 dark:border-[#44474F]/30 space-y-1.5 text-[11px]">
                <span className="font-bold text-[#1A1C1E] dark:text-[#E2E2E6] block mb-1">{language === 'ID' ? 'Ketentuan Kata Sandi:' : 'Password Requirements:'}</span>
                <div className="flex items-center gap-2 text-[#43474E] dark:text-[#C4C6D0]">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white ${passwordData.newPassword.length >= 6 ? 'bg-green-600' : 'bg-gray-300'}`}>
                    ✓
                  </div>
                  <span>{language === 'ID' ? 'Minimal 6 karakter' : 'At least 6 characters'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#43474E] dark:text-[#C4C6D0]">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white ${passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? 'bg-green-600' : 'bg-gray-300'}`}>
                    ✓
                  </div>
                  <span>{language === 'ID' ? 'Kata sandi cocok' : 'Passwords match'}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0061A4] hover:bg-[#004d84] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  {isUpdatingPassword ? (language === 'ID' ? 'Memperbarui...' : 'Updating Password...') : t.profileUpdatePasswordBtn}
                </button>
              </div>
            </form>

            {/* 2-Factor Authentication Card */}
            <div className="mt-6 pt-4 border-t border-[#C3C7CF]/20 dark:border-[#44474F]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#D0BCFF] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{language === 'ID' ? 'Autentikasi Dua Faktor (2FA)' : 'Two-Factor Authentication (2FA)'}</h4>
                  <p className="text-[10px] text-[#43474E] dark:text-[#C4C6D0]">{language === 'ID' ? 'Konfirmasi via SMS / Authenticator saat login' : 'Require SMS / Authenticator confirmation on login'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, twoFactorAuth: !preferences.twoFactorAuth })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  preferences.twoFactorAuth ? 'bg-[#0061A4]' : 'bg-[#C3C7CF] dark:bg-[#44474F]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>
        )}

        {/* TAB 3: PREFERENCES & SETTINGS */}
        {activeSection === 'PREFERENCES' && (
          <section className="rounded-3xl bg-white dark:bg-[#191C20] border border-[#C3C7CF]/30 dark:border-[#44474F]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D1E4FF] dark:bg-[#00497D] text-[#0061A4] dark:text-[#9ECAFF] flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{t.profileTabPreferences}</h3>
                  <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">{language === 'ID' ? 'Pengaturan tema tampilan, notifikasi dan bahasa' : 'Customize visual themes, notification channels and language'}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#C3C7CF]/20 dark:divide-[#44474F]/30 space-y-3 pt-1">
              {/* Dark Mode Toggle Item */}
              <div className="flex items-center justify-between pt-2 pb-1 bg-gradient-to-r from-[#D1E4FF]/30 to-transparent dark:from-[#00497D]/30 dark:to-transparent -mx-2 px-2.5 py-3 rounded-2xl border border-[#0061A4]/20 dark:border-[#9ECAFF]/20">
                <div className="flex items-center gap-3 pr-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-xs ${
                    isDarkMode 
                      ? 'bg-[#00497D] text-[#9ECAFF]' 
                      : 'bg-[#D1E4FF] text-[#0061A4]'
                  }`}>
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{t.profileDarkMode}</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isDarkMode 
                          ? 'bg-[#00497D] text-[#9ECAFF] border border-[#9ECAFF]/30' 
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isDarkMode 
                          ? (language === 'ID' ? '🌙 Gelap Aktif' : '🌙 Dark Active') 
                          : (language === 'ID' ? '☀️ Terang Aktif' : '☀️ Light Active')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0] mt-0.5">{t.profileDarkModeDesc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  aria-label="Toggle Dark Mode"
                  className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    isDarkMode ? 'bg-[#0061A4]' : 'bg-[#C3C7CF] dark:bg-[#44474F]'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                      isDarkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {isDarkMode ? (
                      <Moon className="w-3 h-3 text-[#0061A4]" />
                    ) : (
                      <Sun className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                </button>
              </div>

              {/* Notification preferences */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{language === 'ID' ? 'Notifikasi WhatsApp Tagihan & Token' : 'WhatsApp Rent & Token Alerts'}</h4>
                  <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">{language === 'ID' ? 'Terima kode token listrik dan pengingat sewa instan via WhatsApp' : 'Receive instant token codes and payment reminders via WhatsApp'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, whatsappAlerts: !preferences.whatsappAlerts })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    preferences.whatsappAlerts ? 'bg-[#0061A4]' : 'bg-[#C3C7CF] dark:bg-[#44474F]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      preferences.whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{language === 'ID' ? 'Kirim Bukti Pembayaran ke Email' : 'Email Monthly Statements'}</h4>
                  <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">{language === 'ID' ? 'Kwitansi resmi PDF dan rincian transaksi otomatis dikirim ke email' : 'Get official PDF invoices and payment receipts sent to your email'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, emailReceipts: !preferences.emailReceipts })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    preferences.emailReceipts ? 'bg-[#0061A4]' : 'bg-[#C3C7CF] dark:bg-[#44474F]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      preferences.emailReceipts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{language === 'ID' ? 'Pembaruan Status Laporan Kerusakan' : 'Maintenance Status Updates'}</h4>
                  <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">{language === 'ID' ? 'Pemberitahuan langsung saat perbaikan sedang diproses atau selesai' : 'Real-time progress notifications on reported repair tickets'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, maintenanceUpdates: !preferences.maintenanceUpdates })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    preferences.maintenanceUpdates ? 'bg-[#0061A4]' : 'bg-[#C3C7CF] dark:bg-[#44474F]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      preferences.maintenanceUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F0F5] dark:bg-[#22262D] text-[#0061A4] dark:text-[#9ECAFF] flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6]">{t.profileLangSetting}</h4>
                    <p className="text-[11px] text-[#43474E] dark:text-[#C4C6D0]">{language === 'ID' ? 'Bahasa saat ini: Bahasa Indonesia (ID)' : 'Currently active: English (EN)'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 bg-[#D1E4FF] dark:bg-[#00497D] text-[#001D36] dark:text-[#D1E4FF] font-bold text-xs rounded-xl hover:bg-[#c2dcff] dark:hover:bg-[#005a99] transition-colors cursor-pointer"
                >
                  {language === 'ID' ? 'Ganti ke English (EN)' : 'Ganti ke Indonesia (ID)'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Prominent Session & Sign Out Card */}
        <section className="rounded-3xl bg-white dark:bg-[#191C20] border border-[#FFDAD6] dark:border-[#93000A]/40 p-5 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFDAD6] dark:bg-[#93000A]/30 text-[#BA1A1A] dark:text-[#FFB4AB] flex items-center justify-center shrink-0">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#1A1C1E] dark:text-[#E2E2E6] tracking-tight">
                  {language === 'ID' ? 'Sesi Akun Aktif' : 'Active Account Session'}
                </h4>
                <p className="text-xs text-[#43474E] dark:text-[#C4C6D0] mt-0.5">
                  {language === 'ID' 
                    ? <>Masuk sebagai <span className="font-bold text-[#1A1C1E] dark:text-white">{currentUserProfile.email}</span>. Keluar akan menghapus sesi aktif dan kembali ke halaman login.</>
                    : <>Signed in as <span className="font-bold text-[#1A1C1E] dark:text-white">{currentUserProfile.email}</span>. Logging out clears active session cache and returns to the login screen.</>
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirmModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#BA1A1A] hover:bg-[#93000A] active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.profileLogoutBtn}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#191C20] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#C3C7CF]/30 dark:border-[#44474F]/40 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-3xl bg-[#FFDAD6] dark:bg-[#93000A]/30 text-[#BA1A1A] dark:text-[#FFB4AB] flex items-center justify-center mx-auto shadow-xs">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-[#1A1C1E] dark:text-[#E2E2E6] tracking-tight">
                {t.profileLogoutConfirmTitle}
              </h3>
              <p className="text-xs text-[#43474E] dark:text-[#C4C6D0] leading-relaxed">
                {language === 'ID'
                  ? <>Anda akan keluar dari akun <strong className="text-[#1A1C1E] dark:text-white">{currentUserProfile.name}</strong> (<span className="text-[#0061A4] dark:text-[#9ECAFF]">{currentUserProfile.email}</span>). Sesi Anda akan dihapus dan Anda akan dialihkan ke layar login.</>
                  : <>You will be signed out from <strong className="text-[#1A1C1E] dark:text-white">{currentUserProfile.name}</strong> (<span className="text-[#0061A4] dark:text-[#9ECAFF]">{currentUserProfile.email}</span>). Your active session will be cleared and you will be returned to the login screen.</>
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutConfirmModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#C3C7CF]/60 dark:border-[#44474F]/60 text-xs font-bold text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#22262D] transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => {
                  setIsLoggingOut(true);
                  setTimeout(() => {
                    setShowLogoutConfirmModal(false);
                    signOut();
                  }, 300);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#BA1A1A] hover:bg-[#93000A] text-white text-xs font-extrabold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isLoggingOut ? (language === 'ID' ? 'Sedang keluar...' : 'Logging out...') : t.profileLogoutConfirmYes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </div>
  );
};
