import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  AlertCircle,
  Tag,
  Share2,
  Check,
  Bookmark,
  Plus,
  X,
  Send,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { PLATFORM_FEEDBACK } from '../../data/adminData';
import { useLanguage } from '../../context/LanguageContext';

const EXTENDED_FEEDBACK = [
  ...PLATFORM_FEEDBACK,
  {
    id: 'fb_04',
    rating: 5,
    user: 'Alex Johnson (Patient)',
    category: 'Urinalysis AI',
    comment: 'The computer vision strip reader calibrated my urine leukocytes and protein in under 5 seconds. My nephrologist was impressed by the trajectory graph.',
    date: '2026-11-18',
    status: 'Featured',
    device: 'Android 15 Optical Scan',
    sentiment: 'Positive',
    featured: true
  },
  {
    id: 'fb_05',
    rating: 5,
    user: 'Dr. Sarah Mitchell, MD',
    category: 'Telemedicine',
    comment: 'Receiving patient-authorized biometric trajectory data prior to video consultation cut triage time in half. Flawless WebRTC quality.',
    date: '2026-11-17',
    status: 'Featured',
    device: 'Desktop Telemed Suite',
    sentiment: 'Positive',
    featured: true
  },
  {
    id: 'fb_06',
    rating: 4,
    user: 'Marcus Vance (Patient)',
    category: 'Cardiovascular',
    comment: 'The separate charts for systolic and diastolic blood pressure with mean arterial pressure overlays are clear. Would love Bluetooth cuff auto-sync.',
    date: '2026-11-15',
    status: 'Approved',
    device: 'iOS Mobile Web',
    sentiment: 'Positive',
    featured: false
  },
  {
    id: 'fb_07',
    rating: 5,
    user: 'Elena Rostova (Patient)',
    category: 'Family Sharing',
    comment: 'Managing my mother’s biomarker alerts with one-click consent in the new Family Hub brings immense peace of mind.',
    date: '2026-11-14',
    status: 'Approved',
    device: 'Web Client',
    sentiment: 'Positive',
    featured: true
  },
  {
    id: 'fb_08',
    rating: 4,
    user: 'Community Member #319',
    category: 'QR Profile',
    comment: 'At the clinic emergency desk, the doctor scanned my encrypted QR and saw my allergies and active medications instantly without login hassle.',
    date: '2026-11-12',
    status: 'Approved',
    device: 'Mobile Browser',
    sentiment: 'Positive',
    featured: false
  },
  {
    id: 'fb_09',
    rating: 3,
    user: 'Community Member #108',
    category: 'Urinalysis AI',
    comment: 'Works great in good bathroom lighting, but asked me to retake twice under warm incandescent bulbs. The guidance tip was helpful though.',
    date: '2026-11-10',
    status: 'Under Review',
    device: 'Chrome Mobile',
    sentiment: 'Constructive',
    featured: false
  }
];

export default function AdminFeedbackPage() {
  const { isHindi } = useLanguage();
  const [feedbackList, setFeedbackList] = useState(EXTENDED_FEEDBACK);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 450));
    setFeedbackList([...EXTENDED_FEEDBACK]);
    setIsRefreshing(false);
    showToast(isHindi ? 'फीडबैक सूची रीफ्रेश हुई।' : 'Feedback list synchronized.');
  };

  const toggleFeatured = (id) => {
    setFeedbackList(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.featured;
        showToast(next 
          ? (isHindi ? 'होमपेज पर फीचर किया गया' : 'Featured on public landing page') 
          : (isHindi ? 'फीचर हटाया गया' : 'Unfeatured from public page'));
        return { ...item, featured: next };
      }
      return item;
    }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setFeedbackList(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, status: 'Reviewed', adminNote };
      }
      return item;
    }));
    showToast(isHindi ? 'प्रशासनिक नोट सहेजा गया' : 'Clinical admin note saved.');
    setReplyModalOpen(false);
    setAdminNote('');
  };

  const categories = ['ALL', 'Urinalysis AI', 'Telemedicine', 'Cardiovascular', 'Family Sharing', 'QR Profile'];

  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return feedbackList.filter(item => {
      const matchSearch = !q ||
        item.user.toLowerCase().includes(q) ||
        item.comment.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchRating = ratingFilter === 'ALL' || item.rating === Number(ratingFilter);
      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;

      return matchSearch && matchRating && matchCat;
    });
  }, [feedbackList, searchQuery, ratingFilter, categoryFilter]);

  // Derived stats
  const totalCount = feedbackList.length;
  const avgRating = (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1);
  const fiveStarsCount = feedbackList.filter(f => f.rating === 5).length;
  const fiveStarsPct = Math.round((fiveStarsCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? 'मरीज एवं चिकित्सक अनुभव' : 'Patient Experience & Clinical CSAT Intelligence'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHindi ? 'समुदाय फीडबैक एवं समीक्षाएं' : 'Community Feedback & Testimonials'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'मरीजों और चिकित्सकों के अनुभव, संतुष्टि स्कोर और नई सुविधाओं के सुझावों की लाइव समीक्षा।'
              : 'Live patient sentiment, optical scanner usability evaluations, and clinical NPS satisfaction analytics.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-50 cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
            <span>{isRefreshing ? (isHindi ? 'रीफ्रेश...' : 'Refreshing...') : (isHindi ? 'रीफ्रेश' : 'Refresh Feedback')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'औसत सीएसएटी स्कोर' : 'Average CSAT Score'}</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgRating}</span>
            <span className="text-xs text-slate-500">/ 5.0</span>
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +0.3 vs Oct
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs text-slate-500 ml-1.5 font-medium">{totalCount} reviews</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? '5-स्टार संतुष्टि अनुपात' : '5-Star Ratio'}</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{fiveStarsPct}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Excellent</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fiveStarsCount} of {totalCount} patients gave perfect score
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'नेट प्रमोटर स्कोर' : 'Net Promoter Score'}</span>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">+78</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              World Class
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Healthcare industry average: +38
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'सार्वजनिक फीचर' : 'Featured on Landing'}</span>
            <Bookmark className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {feedbackList.filter(f => f.featured).length}
            </span>
            <span className="text-xs text-slate-500">active badges</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verified patient endorsements shown to visitors
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'मरीज का नाम, टिप्पणी या कीवर्ड खोजें...' : 'Search feedback by patient name, keyword, or observation...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Rating Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['ALL', '5', '4', '3'].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  ratingFilter === r
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? (isHindi ? 'सभी रेटिंग' : 'All Ratings') : `${r} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">{isHindi ? 'श्रेणी:' : 'Category:'}</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? (isHindi ? 'सभी श्रेणियां' : 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl bg-white dark:bg-[#251A11] border transition-all space-y-4 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 hover:shadow-md ${
              item.featured
                ? 'border-purple-500/40 ring-1 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              {/* Header: Rating & Category Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  {[...Array(5 - item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  {item.featured && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1">
                      <Bookmark className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                  {item.category && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Body */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{item.comment}"
              </p>

              {/* Admin Note if present */}
              {item.adminNote && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Admin Annotation:
                  </span>
                  <p>{item.adminNote}</p>
                </div>
              )}
            </div>

            {/* Footer with Metadata and Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{item.user}</span>
                  <span className="text-[11px] text-slate-400">{item.device || 'Verified Patient'}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{item.date}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    item.featured
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 hover:bg-purple-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Feature on landing page"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                  <span>{item.featured ? 'Featured' : 'Feature'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setAdminNote(item.adminNote || '');
                    setReplyModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{item.adminNote ? 'Edit Note' : 'Add Note'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isHindi ? 'कोई फीडबैक नहीं मिला' : 'No Feedback Matches Your Filter'}
          </h3>
          <p className="text-sm text-slate-500">
            {isHindi ? 'कृपया अपने खोज शब्दों या रेटिंग फिल्टर को बदलकर देखें।' : 'Try resetting your search query or selecting a different rating/category filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setRatingFilter('ALL');
              setCategoryFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
          >
            {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* Admin Note / Review Modal */}
      {replyModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Clinical Admin Annotation
                </h3>
              </div>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">{selectedItem.user} ({selectedItem.category}):</span>
              <p className="text-slate-600 dark:text-slate-300 italic">"{selectedItem.comment}"</p>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Internal Engineering / Clinical Action Note:
                </label>
                <textarea
                  rows={4}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g., Forwarded camera auto-exposure report to Android team. Calibrated color delta for warm spectrum bulbs."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Annotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
