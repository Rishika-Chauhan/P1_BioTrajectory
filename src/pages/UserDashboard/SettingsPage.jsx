import React, { useState } from 'react';
import {
  User,
  Lock,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Bot,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function SettingsPage() {
  const { currentUser, updateProfile, logout } = useAuth();
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Profile Form
  const [name, setName] = useState(currentUser?.name || 'Pranjal Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'pranjal@biotrajectory.health');
  const [bloodType, setBloodType] = useState(currentUser?.bloodType || 'O+');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.emergencyContact?.phone || '+1 (555) 349-2910');

  // Notifications
  const [notifications, setNotifications] = useState({
    abnormalAlerts: true,
    weeklyReportEmail: true,
    appointmentReminders: true
  });

  // AI & Data Sharing
  const [aiSettings, setAiSettings] = useState({
    analyzeDocuments: true,
    continuousModeling: true,
    shareAnonymousResearch: false
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      bloodType,
      emergencyContact: {
        ...currentUser?.emergencyContact,
        phone: emergencyPhone
      }
    });
    showToast('Your profile was updated successfully!');
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    logout();
    alert('Your account and saved data have been completely deleted.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-[16px] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-2">
          Manage your personal profile, privacy, alerts, and website appearance.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-[16px] font-semibold overflow-x-auto shadow-sm">
        {[
          { id: 'profile', label: 'Personal Profile', icon: User },
          { id: 'security', label: 'Privacy & Security', icon: ShieldCheck },
          { id: 'ai', label: 'AI Assistant', icon: Bot },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'theme', label: 'Appearance', icon: Sun }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PERSONAL PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 text-3xl font-extrabold flex items-center justify-center">
              {name[0] || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
              <p className="text-[15px] text-slate-500 dark:text-slate-400">Account ID: {currentUser?.id || 'usr_pat_88291'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[16px]">
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Blood Type</label>
              <select
                value={bloodType}
                onChange={e => setBloodType(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Emergency Phone Number</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-[17px] font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md active:scale-95"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. PRIVACY & SECURITY */}
      {activeTab === 'security' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-[16px]">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Privacy & Protection</h3>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-[17px]">
              <ShieldCheck className="w-5 h-5" />
              <span>Safe and Secure Encryption Active</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px]">
              Your health records are encrypted and protected so only you and your authorized doctors can see them.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[17px]">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                placeholder="New Password (at least 8 characters)"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              onClick={() => showToast('Password updated successfully!')}
              className="px-6 py-3 rounded-2xl text-[16px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              Update Password
            </button>
          </div>

          {/* Account Deletion */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-red-600 dark:text-red-400 text-[18px]">Delete Account</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[16px]">
              Permanently erase all your health records, uploaded documents, and profile data from BioTrajectory.
            </p>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-[16px] font-bold bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Delete My BioTrajectory Account
            </button>
          </div>
        </div>
      )}

      {/* 3. AI ASSISTANT PERMISSIONS */}
      {activeTab === 'ai' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-[16px]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Assistant Settings</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Control how the AI assistant helps you understand your health information.</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: 'analyzeDocuments',
                title: 'Allow Assistant to Read Reports',
                desc: 'Permits the assistant to read and explain uploaded lab tests when you ask questions.'
              },
              {
                key: 'continuousModeling',
                title: 'Track Health Trends',
                desc: 'Allows the system to show you 7-day and 30-day health summaries in simple charts.'
              },
              {
                key: 'shareAnonymousResearch',
                title: 'Share Anonymous Health Data',
                desc: 'Help medical research by sharing anonymous, unlinked numbers that cannot be traced to you.'
              }
            ].map(item => (
              <label key={item.key} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-400/50 transition-colors">
                <input
                  type="checkbox"
                  checked={aiSettings[item.key]}
                  onChange={e => {
                    setAiSettings({ ...aiSettings, [item.key]: e.target.checked });
                    showToast('AI permissions updated.');
                  }}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-[17px]">{item.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 4. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-[16px]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Choose how and when BioTrajectory sends you updates.</p>
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'abnormalAlerts', title: 'Unusual Reading Alerts', desc: 'Get an instant alert if your blood pressure or test results are outside normal limits.' },
              { key: 'weeklyReportEmail', title: 'Weekly Health Summary', desc: 'Receive a simple weekly summary email of your numbers every Monday morning.' },
              { key: 'appointmentReminders', title: 'Doctor Visit Reminders', desc: 'Get a helpful reminder 15 minutes before your scheduled doctor visit.' }
            ].map(item => (
              <label key={item.key} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-400/50 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={e => {
                    setNotifications({ ...notifications, [item.key]: e.target.checked });
                    showToast('Notification preference updated.');
                  }}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-[17px]">{item.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 5. THEME & APPEARANCE */}
      {activeTab === 'theme' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-[16px]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Your Theme</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Pick the look that is most comfortable for your eyes.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setThemeMode('light');
                showToast('Switched to Clean Light Theme');
              }}
              className={`p-6 rounded-3xl border text-left space-y-2 transition-all cursor-pointer ${
                !isDark ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-400'
              }`}
            >
              <Sun className="w-8 h-8 text-amber-500" />
              <p className="font-bold text-slate-900 dark:text-white text-lg">Clean Light Theme</p>
              <p className="text-slate-600 dark:text-slate-400 text-[15px]">Bright background with clear white cards, perfect for daytime.</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setThemeMode('dark');
                showToast('Switched to Gentle Dark Theme');
              }}
              className={`p-6 rounded-3xl border text-left space-y-2 transition-all cursor-pointer ${
                isDark ? 'border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/40' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-400'
              }`}
            >
              <Moon className="w-8 h-8 text-cyan-400" />
              <p className="font-bold text-slate-900 dark:text-white text-lg">Gentle Dark Theme</p>
              <p className="text-slate-600 dark:text-slate-400 text-[15px]">Dark background with calming cyan accents, easy on the eyes.</p>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-red-500/40 shadow-2xl space-y-5 text-[16px]">
            <div className="flex items-center gap-3 text-red-500 font-bold text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Confirm Account Deletion</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px]">
              Are you sure? This cannot be undone. All your health records, uploaded documents, and saved data will be deleted permanently.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-[17px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-md text-[17px]"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <DisclaimerBanner />
    </div>
  );
}
