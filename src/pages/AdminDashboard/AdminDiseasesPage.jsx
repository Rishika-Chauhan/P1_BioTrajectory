import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Calendar,
  Database,
  Image as ImageIcon
} from 'lucide-react';
import { DISEASES_DATABASE, PRIMARY_CATEGORIES } from '../../data/diseasesData';

export default function AdminDiseasesPage() {
  const [diseases, setDiseases] = useState(DISEASES_DATABASE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [medicalName, setMedicalName] = useState('');
  const [categoryGroup, setCategoryGroup] = useState('Common Illnesses');
  const [shortDescription, setShortDescription] = useState('');
  const [whatIsIt, setWhatIsIt] = useState('');
  const [illustrationIcon, setIllustrationIcon] = useState('Activity');
  const [datasetKey, setDatasetKey] = useState('');
  const [reliableSourcesInput, setReliableSourcesInput] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [lastReviewedDate, setLastReviewedDate] = useState(new Date().toISOString().split('T')[0]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingDisease(null);
    setName('');
    setMedicalName('');
    setCategoryGroup('Common Illnesses');
    setShortDescription('');
    setWhatIsIt('');
    setIllustrationIcon('Activity');
    setDatasetKey('');
    setReliableSourcesInput('World Health Organization (WHO), CDC');
    setIsVerified(true);
    setIsPublished(true);
    setLastReviewedDate(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const openEditModal = (disease) => {
    setEditingDisease(disease);
    setName(disease.name);
    setMedicalName(disease.medicalName || '');
    setCategoryGroup(disease.categoryGroup || 'Common Illnesses');
    setShortDescription(disease.shortDescription || '');
    setWhatIsIt(disease.whatIsIt || '');
    setIllustrationIcon(disease.illustrationIcon || 'Activity');
    setDatasetKey(disease.datasetKey || disease.id);
    setReliableSourcesInput(disease.reliableSources ? disease.reliableSources.join(', ') : 'WHO');
    setIsVerified(disease.isVerified ?? true);
    setIsPublished(disease.isPublished ?? true);
    setLastReviewedDate(disease.lastReviewedDate || new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const sourcesArray = reliableSourcesInput.split(',').map(s => s.trim()).filter(Boolean);

    if (editingDisease) {
      // Update existing
      setDiseases(diseases.map(d => {
        if (d.id === editingDisease.id) {
          return {
            ...d,
            name,
            medicalName,
            categoryGroup,
            shortDescription,
            whatIsIt,
            illustrationIcon,
            datasetKey: datasetKey || d.id,
            reliableSources: sourcesArray,
            isVerified,
            isPublished,
            lastReviewedDate
          };
        }
        return d;
      }));
      showToast(`"${name}" updated successfully.`);
    } else {
      // Create new
      const newEntry = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        medicalName,
        categoryGroup,
        subCategory: 'General Health',
        illustrationIcon,
        shortDescription,
        whatIsIt: whatIsIt || shortDescription,
        whyDoesItHappen: ['Underlying biological and environmental factors'],
        signsYouMayNotice: ['Early subtle warning signs', 'General tiredness'],
        howDoesItSpread: 'Consult doctor for individual guidance.',
        whoIsAtRisk: ['General population'],
        howToReduceRisk: ['Healthy nutrition', 'Active movement'],
        whenToSeeDoctor: ['If symptoms persist beyond several days'],
        howCommonIsIt: 'Reported in regional surveillance.',
        reliableSources: sourcesArray,
        datasetKey: datasetKey || name.toLowerCase().replace(/\s+/g, '-'),
        isVerified,
        isPublished,
        lastReviewedDate
      };
      setDiseases([newEntry, ...diseases]);
      showToast(`"${name}" added to the public health guide.`);
    }

    setModalOpen(false);
  };

  const togglePublish = (id) => {
    setDiseases(diseases.map(d => {
      if (d.id === id) {
        const nextState = !d.isPublished;
        showToast(`"${d.name}" ${nextState ? 'published' : 'unpublished'}.`);
        return { ...d, isPublished: nextState };
      }
      return d;
    }));
  };

  const toggleVerify = (id) => {
    setDiseases(diseases.map(d => {
      if (d.id === id) {
        const nextState = !d.isVerified;
        showToast(`"${d.name}" marked as ${nextState ? 'verified' : 'unverified'}.`);
        return { ...d, isVerified: nextState };
      }
      return d;
    }));
  };

  const handleDelete = (id) => {
    setDiseases(diseases.filter(d => d.id !== id));
    showToast('Health condition removed from catalog.');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-purple-600 text-white font-bold text-[16px] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Privacy Barrier Notice */}
      <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-4 text-[16px] text-slate-700 dark:text-slate-300">
        <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-purple-700 dark:text-purple-300 font-bold">Admin Medical Privacy Boundary:</strong>{' '}
          Administrators can manage public educational guides and dataset connections. Administrators <strong>cannot</strong> view private patient medical readings, personal reports, or doctor consultations.
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Disease Information & Dataset Management
          </h1>
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-2">
            Curate public educational health guides, update verified sources, and manage dataset linkages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[17px] font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Disease</span>
        </button>
      </div>

      {/* Disease Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diseases.map(disease => (
          <div
            key={disease.id}
            className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border transition-all space-y-4 flex flex-col justify-between shadow-sm ${
              disease.isPublished !== false
                ? 'border-slate-200 dark:border-slate-800'
                : 'border-dashed border-slate-300 dark:border-slate-700 opacity-75'
            }`}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {disease.categoryGroup}
                  </span>
                  {disease.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Reviewed: {disease.lastReviewedDate || 'Recent'}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {disease.name}
              </h3>

              {disease.medicalName && (
                <p className="text-[14px] text-slate-500 dark:text-slate-400 italic">
                  Medical term: {disease.medicalName}
                </p>
              )}

              <p className="text-[16px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {disease.shortDescription}
              </p>

              {/* Dataset linkage */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Dataset Key: <code className="text-purple-600 dark:text-purple-300 font-mono">{disease.datasetKey || disease.id}</code></span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Publish Toggle */}
                <button
                  onClick={() => togglePublish(disease.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    disease.isPublished !== false
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                  title="Toggle publication status"
                >
                  {disease.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{disease.isPublished !== false ? 'Published' : 'Draft'}</span>
                </button>

                {/* Verification Toggle */}
                <button
                  onClick={() => toggleVerify(disease.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer"
                >
                  {disease.isVerified ? 'Unverify' : 'Mark Verified'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(disease)}
                  className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Disease Details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(disease.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Disease Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {editingDisease ? `Edit: ${editingDisease.name}` : 'Add New Health Condition'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-[16px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Simple Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dengue"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Medical Term (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dengue Virus (DENV)"
                    value={medicalName}
                    onChange={e => setMedicalName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category Group</label>
                  <select
                    value={categoryGroup}
                    onChange={e => setCategoryGroup(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value="Common Illnesses">Common Illnesses</option>
                    <option value="Other Health Problems">Other Health Problems</option>
                    <option value="Cancer Types">Cancer Types</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Dataset Source Key</label>
                  <input
                    type="text"
                    placeholder="e.g. dengue or tb"
                    value={datasetKey}
                    onChange={e => setDatasetKey(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Short Summary</label>
                <input
                  type="text"
                  required
                  placeholder="One sentence plain explanation of what this illness is..."
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Detailed Description (What is it?)</label>
                <textarea
                  rows={3}
                  placeholder="Explain in simple, everyday words that anyone can understand..."
                  value={whatIsIt}
                  onChange={e => setWhatIsIt(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Verified Medical References (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. World Health Organization (WHO), CDC, ICMR"
                  value={reliableSourcesInput}
                  onChange={e => setReliableSourcesInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Last-Reviewed Date</label>
                  <input
                    type="date"
                    value={lastReviewedDate}
                    onChange={e => setLastReviewedDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isVerifiedCheckbox"
                    checked={isVerified}
                    onChange={e => setIsVerified(e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="isVerifiedCheckbox" className="font-semibold text-slate-700 dark:text-slate-300 text-sm cursor-pointer">
                    Mark as Verified
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isPublishedCheckbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="isPublishedCheckbox" className="font-semibold text-slate-700 dark:text-slate-300 text-sm cursor-pointer">
                    Publish Online
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-2xl text-[16px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-[16px] font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md cursor-pointer transition-all"
                >
                  {editingDisease ? 'Save Changes' : 'Create Condition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
