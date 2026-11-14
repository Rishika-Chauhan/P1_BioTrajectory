import React, { useState } from 'react';
import {
  FolderHeart,
  Upload,
  FileText,
  Search,
  Eye,
  Download,
  Trash2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { SAMPLE_MEDICAL_DOCUMENTS } from '../../data/vitalsData';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function MedicalHistoryPage() {
  const [documents, setDocuments] = useState(SAMPLE_MEDICAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New doc upload form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Lab Report');
  const [newProvider, setNewProvider] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
    showToast('Report removed from your records.');
  };

  const handleDownload = (doc) => {
    showToast(`Downloading "${doc.title}.pdf"...`);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const doc = {
      id: `doc_${Date.now()}`,
      title: newTitle,
      type: newType,
      date: new Date().toISOString().split('T')[0],
      provider: newProvider || 'Self-Uploaded Report',
      size: '1.2 MB',
      fileType: 'PDF',
      status: 'Saved',
      summary: newSummary || 'Report securely encrypted and saved in your account.'
    };

    setDocuments([doc, ...documents]);
    setUploadModalOpen(false);
    setNewTitle('');
    setNewProvider('');
    setNewSummary('');
    showToast('Your health report was saved successfully!');
  };

  const filteredDocs = documents.filter(doc => {
    const matchesType =
      selectedType === 'All' ||
      (selectedType === 'Lab Reports' && doc.type.includes('Laboratory')) ||
      (selectedType === 'Prescriptions' && doc.type.includes('Prescription')) ||
      (selectedType === 'Past Checkups' && (doc.type.includes('Previous') || doc.type.includes('Checkup')));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.provider.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-[16px] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Records
          </h1>
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            Keep your lab tests, doctor notes, and prescriptions organized in one safe place
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Your Reports</span>
        </button>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
        <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          <strong>Your privacy is protected:</strong> All reports are safely encrypted on your device. Only you can view or choose to share them with your doctors.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by report name or clinic..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-[16px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Lab Reports', 'Prescriptions', 'Past Checkups'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2.5 rounded-2xl text-[16px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{doc.title}</h3>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400">{doc.provider}</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                  {doc.type}
                </span>
              </div>

              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#070B14] p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {doc.summary}
              </p>

              <div className="flex items-center justify-between text-[15px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date: {doc.date}
                </span>
                <span>{doc.size}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="inline-flex items-center gap-2 text-[16px] font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                <Eye className="w-5 h-5" />
                <span>View Details</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Download copy"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Remove record"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{previewDoc.title}</h3>
                  <p className="text-[15px] text-slate-500">{previewDoc.provider} • {previewDoc.date}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-3 text-[17px]">
              <p className="font-bold text-cyan-500">Summary Findings:</p>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{previewDoc.summary}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-6 py-3 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal with Friendly Labels */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-xl p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Your Health Report</h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5 text-[16px]">
              <div className="p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2 hover:border-cyan-400 transition-colors cursor-pointer bg-slate-50 dark:bg-[#070B14]">
                <Upload className="w-10 h-10 text-cyan-400 mx-auto" />
                <p className="font-bold text-slate-900 dark:text-white text-[18px]">Tap to choose a file or drag it here</p>
                <p className="text-slate-500 dark:text-slate-400 text-[15px]">Supports PDF or clear photos from your phone</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Name of the Report</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Annual Blood Checkup"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Clinic or Doctor Name</label>
                <input
                  type="text"
                  value={newProvider}
                  onChange={e => setNewProvider(e.target.value)}
                  placeholder="e.g. City Family Health Clinic"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Short Note or Doctor's Advice (optional)</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="e.g. Doctor said cholesterol is good, recommended walking more"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-[16px] font-semibold text-slate-600 dark:text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md cursor-pointer"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <DisclaimerBanner text="Notice: Your reports are securely stored in your personal account. BioTrajectory does not share your private records with anyone without your explicit permission." />
    </div>
  );
}
