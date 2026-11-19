import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ReportModal({ isOpen, onClose }) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30' : 'bg-[#FAF6EE] border-[#E5DACB]'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/20' : 'bg-white border-[#E5DACB]'}`}>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#A9D6F5]" />
            <span className="text-xs font-mono uppercase font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
              Clinical summary unavailable
            </span>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl transition-colors text-[#846752] hover:text-[#3D291A] dark:hover:text-[#FAF6EE] hover:bg-[#E5DACB]/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-6 sm:p-8 text-xs font-sans ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A] bg-[#FAF6EE]'}`}>
          <h2 className="text-2xl font-bold">No patient report is available yet.</h2>
          <p className="mt-4 leading-6 text-sm text-[#846752] dark:text-[#FAF6EE]/80">
            This report view is intentionally blank until a verified Firestore-backed clinical workflow and authorized doctor record are available.
          </p>
        </div>
      </div>
    </div>
  );
}
