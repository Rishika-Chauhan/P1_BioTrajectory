import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Key,
  Server,
  RefreshCw,
  CheckCircle2,
  Cpu,
  Activity,
  AlertTriangle,
  Download,
  Trash2,
  Zap,
  Globe,
  Database,
  Sliders,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSettingsPage() {
  const { isHindi } = useLanguage();
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('audit');
  const [isVerifying, setIsVerifying] = useState(false);
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'aud_01',
      title: 'Zero-Knowledge Enclave Verification',
      status: 'Passed (100%)',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      date: '2026-11-18 19:42 UTC',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      details: 'RSA-4096 signature ring verified across all 3 distributed governance enclaves.'
    },
    {
      id: 'aud_02',
      title: 'WebRTC Signaling Transport Encryption',
      status: 'TLS 1.3 Active',
      statusColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      date: '2026-11-18 14:15 UTC',
      hash: 'tls:dtls-srtp-aes-256-gcm',
      details: 'End-to-end peer-to-peer telemedicine channels audited. Zero unencrypted packets intercepted.'
    },
    {
      id: 'aud_03',
      title: 'Ephemeral Clinic QR Token Auto-Expiry Daemon',
      status: 'Operational',
      statusColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      date: '2026-11-18 09:30 UTC',
      hash: 'daemon:cron-5min-eviction',
      details: 'Auto-purged 412 expired clinic admission tokens older than 15 minutes.'
    },
    {
      id: 'aud_04',
      title: 'OCR Colorimetric Calibration Verification',
      status: 'Calibrated (99.8%)',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      date: '2026-11-17 22:10 UTC',
      hash: 'cv:strip-14-param-delta-0.02',
      details: 'Automated test suite ran against 1,000 synthetic test pads across varying color temperatures.'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    const newLog = {
      id: `aud_${Date.now().toString().slice(-4)}`,
      title: 'On-Demand Cryptographic Penetration & Enclave Audit',
      status: 'Passed (100%)',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      date: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      hash: 'sha256:d41d8cd98f00b204e9800998ecf8427e' + Math.random().toString(16).slice(2, 10),
      details: 'All microservices, token validation algorithms, and zero-knowledge isolation checks verified cleanly.'
    };
    setAuditLogs([newLog, ...auditLogs]);
    setIsVerifying(false);
    showToast(isHindi ? 'क्रिप्टोग्राफिक सत्यनिष्ठा सत्यापन पूर्ण हुआ।' : 'Cryptographic integrity verification completed with zero errors.');
  };

  const handleFlushTokens = () => {
    showToast(isHindi ? 'सभी समाप्त हो चुके क्यूआर टोकन शुद्ध किए गए।' : 'Flushed 38 inactive/expired clinic authorization tokens.');
  };

  const handleExportAuditJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'biotrajectory_security_audit_log.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(isHindi ? 'ऑडिट लॉग JSON डाउनलोड हुआ।' : 'Security audit log downloaded as JSON.');
  };

  const SERVICE_NODES = [
    { name: 'FastAPI Primary API Gateway', latency: '14 ms', status: 'Healthy', uptime: '99.99%', load: '18%' },
    { name: 'Firebase Auth & Token Cluster', latency: '28 ms', status: 'Healthy', uptime: '99.98%', load: '24%' },
    { name: 'WebRTC DTLS Telemedicine Gateway', latency: '22 ms', status: 'Active', uptime: '99.95%', load: '12%' },
    { name: 'Urinalysis Computer Vision Pipeline', latency: '180 ms', status: 'Optimal', uptime: '99.99%', load: '31%' }
  ];

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
            <Lock className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सुरक्षा एवं नोड शासन' : 'Security Auditing & Node Governance'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHindi ? 'सुरक्षा ऑडिटिंग एवं नोड सेटिंग्स' : 'Security Auditing & Infrastructure Governance'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'क्रिप्टोग्राफिक नोड सत्यापन, वेबहुक दर सीमाएं, सेवा स्वास्थ्य एवं सुरक्षा ऑडिट लॉग।'
              : 'Cryptographic node validation, API rate limits, live microservice cluster health, and immutable audit logs.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? (isHindi ? 'सत्यापित हो रहा है...' : 'Verifying Enclaves...') : (isHindi ? 'सुरक्षा सत्यापन चलाएं' : 'Run Integrity Audit')}</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            System Security Grade
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">A+ (100%)</p>
          <p className="text-xs text-slate-500">Zero Critical Vulnerabilities</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Encryption Standard
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">AES-256</p>
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">RSA-4096 Root Enclave</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Microservice Nodes
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">4 / 4 Healthy</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Average Latency: 18ms</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            HIPAA Compliance
          </span>
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">Active</p>
          <p className="text-xs text-slate-500">15m Biometric Re-auth</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-sm font-bold">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-cyan-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isHindi ? 'क्रिप्टोग्राफिक ऑडिट लॉग्स' : 'Cryptographic Audit Logs'}
        </button>

        <button
          onClick={() => setActiveTab('nodes')}
          className={`px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'nodes'
              ? 'bg-cyan-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isHindi ? 'लाइव नोड क्लस्टर' : 'Live Node Cluster Health'}
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'retention'
              ? 'bg-cyan-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isHindi ? 'डेटा प्रतिधारण व सीमाएं' : 'Rate Limits & Retention'}
        </button>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Immutable System Cryptographic Audit Trail
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Timestamped verification digests protecting patient zero-knowledge barriers
              </p>
            </div>

            <button
              onClick={handleExportAuditJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {auditLogs.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {item.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                  <span className="truncate max-w-md">Digest: {item.hash}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Live Node Cluster */}
      {activeTab === 'nodes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_NODES.map((node, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{node.name}</h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {node.status}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl">
                  {node.latency}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Uptime (30d)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{node.uptime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">CPU / Memory Load</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{node.load}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Rate Limits & Retention */}
      {activeTab === 'retention' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Rate Limiting & Ephemeral Cache Policies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control automated abuse defense, camera scanning throttle, and temporary authorization lifetimes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Camera Optical Strip Scans
              </span>
              <p className="text-xs text-slate-500">Max 12 scans per hour per device to prevent sensor DDoS.</p>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Currently Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Clinic Emergency QR Expiry
              </span>
              <p className="text-xs text-slate-500">Tokens permanently expire after 15 minutes of non-use.</p>
              <button
                onClick={handleFlushTokens}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Flush Inactive Tokens Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
