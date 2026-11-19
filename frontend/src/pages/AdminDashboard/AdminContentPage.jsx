import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  BookOpen,
  Eye,
  Search,
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  Tag,
  Share2,
  X,
  FileText,
  Save,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const INITIAL_ARTICLES = [
  {
    id: 'art_1',
    title: 'Interpreting Home Blood Pressure: Morning vs Evening Spikes',
    category: 'Cardiovascular Guidance',
    readTime: '4 min read',
    status: 'Published',
    views: '14,280',
    publishedDate: '2026-11-01',
    author: 'BioTrajectory Clinical Board',
    summary: 'Clinical explanation of circadian diurnal blood pressure cycles, white-coat hypertension at home, and when an isolated 138/88 reading warrants notification.',
    content: 'Morning blood pressure naturally rises prior to waking due to cortisol surges. However, sustained early morning surges exceeding 140/90 are strongly linked with vascular endothelial stress. This guide teaches patients how to log measurements at consistent 5-minute rest intervals.',
    sources: 'AHA/ACC 2026 Guidelines, ESC Clinical Recommendations'
  },
  {
    id: 'art_2',
    title: 'Why Urine Specific Gravity Matters for Kidney Tubule Health',
    category: 'Nephrology & Hydration',
    readTime: '6 min read',
    status: 'Published',
    views: '9,840',
    publishedDate: '2026-10-24',
    author: 'Nephrology Advisory Group',
    summary: 'Understanding urine density and early microalbuminuria signals before irreversible renal glomerular filtration rate decreases.',
    content: 'Urine specific gravity reflects the kidney tubule’s ability to concentrate glomerular filtrate. When values persistently stay below 1.010 or above 1.030, our computer vision colorimetric strip reader flags metabolic dehydration or osmotic diuretic load.',
    sources: 'KDIGO 2026 Clinical Practice Guideline, National Kidney Foundation'
  },
  {
    id: 'art_3',
    title: 'Aerobic Pace vs Step Volume: Tuning Cardiovascular Recovery',
    category: 'Physical Mobility',
    readTime: '5 min read',
    status: 'Published',
    views: '18,920',
    publishedDate: '2026-10-18',
    author: 'Preventive Cardiology Team',
    summary: 'Why 8,000 brisk steps provide 92% of the cardiovascular protection of 12,000 slow steps based on continuous heart rate zone telemetry.',
    content: 'Longitudinal accelerometer telemetry indicates that cadence (steps per minute) combined with peak pulse trajectory creates the strongest anti-inflammatory adaptation for vascular health.',
    sources: 'Lancet Public Health Surveillance, WHO Physical Activity Standards'
  },
  {
    id: 'art_4',
    title: 'Continuous Biomarker Trajectories: Beyond Static Annual Blood Tests',
    category: 'Metabolic Longevity',
    readTime: '7 min read',
    status: 'Published',
    views: '22,410',
    publishedDate: '2026-10-05',
    author: 'Dr. Aris Thorne & BioTrajectory R&D',
    summary: 'Why rate of change (first derivative) in fasting metrics uncovers subclinical insulin resistance years before HbA1c crosses clinical thresholds.',
    content: 'Traditional medicine relies on single snapshot lab tests taken 12 months apart. In contrast, BioTrajectory models trajectory slopes—detecting early acceleration towards pre-diabetes when lifestyle changes are 10x more impactful.',
    sources: 'ADA 2026 Standards of Care, Harvard Medical School Clinical Reviews'
  },
  {
    id: 'art_5',
    title: 'Understanding AI Health Assistant Explanations and Safety Limits',
    category: 'AI Telemetry Literacy',
    readTime: '4 min read',
    status: 'Published',
    views: '11,150',
    publishedDate: '2026-09-28',
    author: 'BioTrajectory Governance',
    summary: 'How our zero-knowledge conversational model reasons over your vitals without storing personal medical charts on unencrypted servers.',
    content: 'The BioTrajectory AI assistant operates within clinically bounded guardrails. It explains physiological mechanisms and prepares doctor agendas but never invents pharmacological prescriptions without doctor sign-off.',
    sources: 'AMA Digital Health Ethics, ISO/IEC 27001 Medical Data Guidelines'
  }
];

export default function AdminContentPage() {
  const { isHindi } = useLanguage();
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cardiovascular Guidance',
    readTime: '5 min read',
    status: 'Published',
    summary: '',
    content: '',
    sources: 'World Health Organization (WHO), CDC 2026'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    'ALL',
    'Cardiovascular Guidance',
    'Nephrology & Hydration',
    'Physical Mobility',
    'Metabolic Longevity',
    'AI Telemetry Literacy'
  ];

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return articles.filter(art => {
      const matchSearch = !q ||
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'ALL' || art.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [articles, searchQuery, categoryFilter]);

  const openAddModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Cardiovascular Guidance',
      readTime: '5 min read',
      status: 'Published',
      summary: '',
      content: '',
      sources: 'World Health Organization (WHO), CDC 2026'
    });
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      readTime: art.readTime,
      status: art.status,
      summary: art.summary,
      content: art.content,
      sources: art.sources || ''
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingArticle) {
      setArticles(articles.map(a => {
        if (a.id === editingArticle.id) {
          return {
            ...a,
            ...formData
          };
        }
        return a;
      }));
      showToast(isHindi ? 'गाइड सफलतापूर्वक अपडेट हुई।' : 'Article updated successfully.');
    } else {
      const newArt = {
        id: `art_${Date.now()}`,
        ...formData,
        views: '1',
        publishedDate: new Date().toISOString().split('T')[0],
        author: 'BioTrajectory Clinical Editorial Board'
      };
      setArticles([newArt, ...articles]);
      showToast(isHindi ? 'नई गाइड प्रकाशित की गई।' : 'New educational guide published.');
    }
    setModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      setArticles(articles.filter(a => a.id !== id));
      showToast(isHindi ? 'गाइड हटा दी गई।' : 'Article removed.');
    }
  };

  const toggleStatus = (id) => {
    setArticles(articles.map(a => {
      if (a.id === id) {
        const next = a.status === 'Published' ? 'Draft' : 'Published';
        showToast(`Article status changed to ${next}`);
        return { ...a, status: next };
      }
      return a;
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-sm shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHindi ? 'स्वास्थ्य शिक्षा सीएमएस' : 'Clinical Health Education CMS'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHindi ? 'शैक्षिक सामग्री एवं गाइड प्रबंधन' : 'Educational Content & Health Guides'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'प्रिवेंटिव हेल्थ गाइड, बायोमार्कर व्याख्या और क्लिनिकल साक्षरता लेखों का संपादन एवं प्रकाशन।'
              : 'Publish, curate, and review evidence-based preventive health guides, urinary biomarker guides, and digital health literacy articles.'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isHindi ? 'नई गाइड बनाएं' : 'Create New Guide'}</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Published Guides
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{articles.length}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Peer-Reviewed</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Patient Reads
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">76,600+</p>
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">+18.4% monthly growth</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Clinical Categories
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{categories.length - 1}</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">Cardio, Renal & Longevity</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Editorial Compliance
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">AHA / WHO</p>
          <p className="text-xs text-slate-500">2026 Clinical Standard</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'शीर्षक, सारांश या विषय खोजें...' : 'Search guides by title, category, or physiological keyword...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">{isHindi ? 'श्रेणी:' : 'Category:'}</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                categoryFilter === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? (isHindi ? 'सभी लेख' : 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                  {art.category}
                </span>
                <span
                  onClick={() => toggleStatus(art.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    art.status === 'Published'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}
                  title="Click to toggle Published/Draft"
                >
                  {art.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {art.summary}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {art.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {art.views} reads
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setPreviewArticle(art);
                  setPreviewModalOpen(true);
                }}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read Full</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(art)}
                  className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit article"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(art.id, art.title)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Guides Found</h3>
          <p className="text-sm text-slate-500">No educational articles match your current search or category filter.</p>
        </div>
      )}

      {/* Edit / Create Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingArticle ? 'Edit Educational Guide' : 'Publish New Clinical Guide'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Guide Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Interpreting Home Blood Pressure: Morning vs Evening Spikes"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Reading Duration</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Short Excerpt (Card Summary)</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief 1-2 sentence overview for patient preview..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Clinical Guidance Content</label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed physiological guidance, clinical thresholds, and actionable patient recommendations..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Evidence Sources & Clinical Citations</label>
                <input
                  type="text"
                  value={formData.sources}
                  onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                  placeholder="e.g. World Health Organization (WHO), AHA 2026 Guidelines"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticle ? 'Save Changes' : 'Publish Guide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Detail Preview Modal */}
      {previewModalOpen && previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                {previewArticle.category}
              </span>
              <button onClick={() => setPreviewModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {previewArticle.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>By {previewArticle.author}</span>
                <span>•</span>
                <span>Published {previewArticle.publishedDate}</span>
                <span>•</span>
                <span>{previewArticle.readTime}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed font-medium">
              <strong>Clinical Executive Summary:</strong> {previewArticle.summary}
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>{previewArticle.content}</p>
            </div>

            {previewArticle.sources && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <strong>Medical References:</strong> {previewArticle.sources}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
