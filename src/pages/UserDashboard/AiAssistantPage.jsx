import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  Paperclip,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  Image,
  ArrowRight,
  Info
} from 'lucide-react';
import { GeminiAssistantService } from '../../services/gemini';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello! I am your **BioTrajectory AI Health Assistant**.\n\nI am here to help you understand your blood pressure numbers, daily walking steps, and test results in simple everyday language.\n\nWhat health question can I help you with today?`,
      timestamp: 'Just now',
      warningCard: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasDocConsent, setHasDocConsent] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Is my blood pressure in a healthy range?',
    'What does urine protein mean in simple words?',
    'How many steps should I walk every day?',
    'When should I see a doctor for high blood pressure?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() && attachedFiles.length === 0) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      attachments: [...attachedFiles],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const response = await GeminiAssistantService.queryAssistant({
        query: textToSend,
        attachments: attachedFiles,
        userConsentGiven: hasDocConsent
      });

      const assistantMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        warningCard: response.warningCard || null
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Can you explain my blood pressure readings from this week?');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleAttachMock = () => {
    if (!hasDocConsent) {
      setConsentModalOpen(true);
      return;
    }
    const mockFile = {
      name: 'Recent_Health_Report.pdf',
      size: '1.2 MB'
    };
    setAttachedFiles([...attachedFiles, mockFile]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg_reset',
        sender: 'assistant',
        text: 'Conversation cleared. How can I help you understand your health today?',
        timestamp: 'Just now',
        warningCard: null
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      
      {/* Top Bar with Clear Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ask AI
            </h1>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Simple Explanations
            </span>
          </div>
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            Ask questions and understand your health results in simple everyday language.
          </p>
        </div>

        {/* Audio & Clear Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-4 py-2.5 rounded-2xl border text-[16px] font-semibold flex items-center gap-2 transition-all ${
              voiceEnabled
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                : 'bg-white dark:bg-[#101827] border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
            title="Toggle read aloud voice"
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> : <VolumeX className="w-5 h-5" />}
            <span>Voice {voiceEnabled ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={clearChat}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Sharing Consent Status Bar */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[16px] shrink-0">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>
            Permission to read reports:{' '}
            <strong className={hasDocConsent ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
              {hasDocConsent ? 'Granted (Private & Secure)' : 'Not granted (Your permission needed)'}
            </strong>
          </span>
        </div>
        <button
          onClick={() => setConsentModalOpen(true)}
          className="text-[16px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0 text-left sm:text-right"
        >
          {hasDocConsent ? 'Change Settings' : 'Give Permission'}
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            <div className="flex items-center gap-2 text-[15px] text-slate-500 dark:text-slate-400 px-1 font-medium">
              <span>{msg.sender === 'user' ? 'You' : 'BioTrajectory Assistant'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-5 rounded-3xl max-w-[90%] sm:max-w-[85%] text-[17px] leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
              }`}
            >
              {/* Message text with friendly formatting */}
              <div className="whitespace-pre-line space-y-2">
                {msg.text}
              </div>

              {/* Attachments preview if user sent any */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="pt-3 border-t border-white/20 flex flex-wrap gap-2">
                  {msg.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 text-[15px]">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* HEALTH WARNING UI STATE */}
              {msg.warningCard && (
                <div className={`p-4 rounded-2xl border mt-3 space-y-3 ${
                  msg.warningCard.level === 'critical'
                    ? 'bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-[18px]">
                    <AlertTriangle className={`w-5 h-5 ${msg.warningCard.level === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                    <span>{msg.warningCard.title}</span>
                  </div>
                  <p className="text-[16px] font-semibold">
                    Measurement: {msg.warningCard.measurement}
                  </p>
                  <p className="text-[16px] leading-relaxed">
                    {msg.warningCard.recommendation}
                  </p>
                  <div className="pt-1">
                    <a
                      href="/dashboard/consultation"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-[16px] hover:bg-amber-300 transition-all shadow-sm"
                    >
                      <span>{msg.warningCard.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-[17px] text-cyan-600 dark:text-cyan-400 p-3">
            <Bot className="w-5 h-5 animate-bounce" />
            <span>Thinking and preparing a simple explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5 pl-1">
          <Sparkles className="w-4 h-4 text-cyan-500" /> Ideas:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-4 py-2 rounded-2xl text-[15px] sm:text-[16px] font-medium bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 whitespace-nowrap transition-colors shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Attachments Pending Bar */}
      {attachedFiles.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[16px] shrink-0">
          <FileText className="w-5 h-5 text-cyan-500" />
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">{attachedFiles[0].name}</span>
          <button
            onClick={() => setAttachedFiles([])}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="relative shrink-0">
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-800 shadow-md">
          {/* File Attachment Button */}
          <button
            onClick={handleAttachMock}
            className="p-3 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Attach a report for simple explanation"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Input Button */}
          <button
            onClick={handleMicToggle}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Speak your question"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? 'Listening to your voice...' : 'Ask about your blood pressure, steps, or health questions...'}
            className="flex-1 py-2 px-3 bg-transparent text-[17px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() && attachedFiles.length === 0}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 transition-all shadow-md active:scale-95 flex items-center gap-2 text-[17px]"
          >
            <span>Send</span>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Explicit Document Consent Interface Modal */}
      {consentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Allow Assistant to Read Reports</h3>
              </div>
              <button onClick={() => setConsentModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
              To allow the AI assistant to summarize and explain your uploaded health records in simple words, please give your permission.
            </p>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[16px] text-slate-800 dark:text-slate-200 space-y-2">
              <p className="font-bold text-cyan-700 dark:text-cyan-300">How we protect your privacy:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Your uploaded reports are kept private and confidential.</li>
                <li>Your personal information is never sold or used to train general AI.</li>
                <li>You can turn this off at any time in settings.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setHasDocConsent(false);
                  setConsentModalOpen(false);
                }}
                className="px-5 py-3 rounded-2xl text-[17px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                No, Keep Private
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasDocConsent(true);
                  setConsentModalOpen(false);
                }}
                className="px-6 py-3 rounded-2xl text-[17px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all"
              >
                Yes, Give Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="shrink-0">
        <DisclaimerBanner text="Notice: The BioTrajectory Assistant is an informational tool and does not provide clinical medical diagnoses or prescriptions. If you experience severe symptoms or emergencies, call your local emergency service or see a doctor immediately." />
      </div>
    </div>
  );
}
