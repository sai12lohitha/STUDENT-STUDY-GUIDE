import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RefreshCw,
  User,
  Settings,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { ChatMessage } from '../types';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const DEFAULT_N8N_WEBHOOK =
  'https://sailohitha.app.n8n.cloud/webhook/b5baae03-8d83-4cad-a84b-2ef854747698/chat';

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    profile,
    exams,
    dsaProblems,
    tasks,
    autoRescheduleMissedTasks,
  } = useStudent();

  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('n8n_chat_webhook_url') || DEFAULT_N8N_WEBHOOK;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'checking' | 'error' | 'idle'
  >('connected');
  const [testResult, setTestResult] = useState<string | null>(null);

  // Generate or retrieve persistent session ID for n8n conversation memory
  const [sessionId] = useState(() => {
    let stored = localStorage.getItem('n8n_chat_session_id');
    if (!stored) {
      stored = `session_${profile.id}_${Date.now()}`;
      localStorage.setItem('n8n_chat_session_id', stored);
    }
    return stored;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello ${profile.name.split(' ')[0]}! 👋 I'm your StudentPilot AI Assistant, powered by your active n8n workflow.

I have your complete student context loaded:
• Target Companies: ${profile.targetCompanies.slice(0, 3).join(', ')}
• Daily Target: ${profile.dailyStudyHours} hours
• Upcoming Exams: ${exams.map(e => e.name).join(', ')}
• DSA Solved: ${dsaProblems.filter(p => p.status === 'Solved').length} problems

How can I help you navigate your study goals or placement prep today?`,
      timestamp: 'Just now',
      source: 'n8n',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What should I study today?',
    'Create a 2-hour study plan',
    'Which topics are still incomplete?',
    'I missed yesterday\'s schedule. Reschedule it.',
    'Check my GATE DA exam progress',
    'Give me a 7-day DSA sprint plan',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Test Webhook Connection
  const handleTestConnection = async () => {
    setConnectionStatus('checking');
    setTestResult(null);
    try {
      const res = await fetch('/api/n8n/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: 'ping',
          message: 'ping',
          sessionId,
          webhookUrl,
        }),
      });

      if (res.ok) {
        setConnectionStatus('connected');
        setTestResult('Successfully connected to n8n AI workflow!');
      } else {
        // Direct browser fallback test
        const directRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatInput: 'ping', sessionId }),
        });
        if (directRes.ok) {
          setConnectionStatus('connected');
          setTestResult('Connected directly via browser webhook.');
        } else {
          setConnectionStatus('error');
          setTestResult(`Webhook returned HTTP ${res.status}`);
        }
      }
    } catch (err: any) {
      setConnectionStatus('error');
      setTestResult(err.message || 'Failed to reach n8n webhook.');
    }
  };

  const handleResetSession = () => {
    const newSession = `session_${profile.id}_${Date.now()}`;
    localStorage.setItem('n8n_chat_session_id', newSession);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Session refreshed! What would you like to work on next, ${profile.name.split(' ')[0]}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'n8n',
      },
    ]);
  };

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('n8n_chat_webhook_url', url);
    setConnectionStatus('idle');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const payloadContext = {
      profile,
      exams: exams.map(e => ({
        name: e.name,
        daysRemaining: Math.max(
          0,
          Math.ceil((new Date(e.examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        ),
        progress: Math.round((e.completedTopics / Math.max(e.totalTopics, 1)) * 100),
      })),
      dsaStats: {
        solved: dsaProblems.filter(p => p.status === 'Solved').length,
        easy: dsaProblems.filter(p => p.status === 'Solved' && p.difficulty === 'Easy').length,
        medium: dsaProblems.filter(p => p.status === 'Solved' && p.difficulty === 'Medium').length,
        hard: dsaProblems.filter(p => p.status === 'Solved' && p.difficulty === 'Hard').length,
      },
      todayTasks: tasks.filter(t => !t.completed),
      missedTasks: tasks.filter(
        t => !t.completed && (t.isMissed || t.deadline < new Date().toISOString().split('T')[0])
      ),
    };

    // Layer 1: Try through n8n Server Proxy
    try {
      const res = await fetch('/api/n8n/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: query,
          message: query,
          sessionId,
          webhookUrl,
          context: payloadContext,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reply) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'n8n',
          };
          setMessages(prev => [...prev, botMsg]);
          setConnectionStatus('connected');

          if (query.toLowerCase().includes('reschedule') || query.toLowerCase().includes('missed')) {
            autoRescheduleMissedTasks();
          }
          setLoading(false);
          return;
        }
      }
    } catch (proxyErr) {
      console.warn('n8n proxy error, attempting direct webhook call:', proxyErr);
    }

    // Layer 2: Direct browser call to n8n webhook
    try {
      const directRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          chatInput: query,
          message: query,
          sessionId,
          context: payloadContext,
        }),
      });

      if (directRes.ok) {
        const directData = await directRes.json();
        const replyText =
          directData.output ||
          directData.text ||
          directData.response ||
          directData.message ||
          (typeof directData === 'string' ? directData : null);

        if (replyText) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            content: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'n8n',
          };
          setMessages(prev => [...prev, botMsg]);
          setConnectionStatus('connected');
          setLoading(false);
          return;
        }
      }
    } catch (directErr) {
      console.warn('Direct n8n fetch error, falling back to Gemini API:', directErr);
    }

    // Layer 3: Fallback to Gemini endpoint
    try {
      const geminiRes = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          preferN8n: false,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          context: payloadContext,
        }),
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        if (geminiData.success && geminiData.reply) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            content: geminiData.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'gemini',
          };
          setMessages(prev => [...prev, botMsg]);
          setLoading(false);
          return;
        }
      }
    } catch (geminiErr) {
      console.warn('Gemini chat error, using local engine fallback:', geminiErr);
    }

    // Layer 4: Local Smart Response Rule Engine
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('what should i do') || q.includes('what to study') || q.includes('next task')) {
      reply = `### Recommended Next Action for You:

1. **Top Priority (45 min):** Complete *Linear Algebra – Eigenvalues & Matrix Diagonalization*.
   - **Why:** High-weightage GATE DA topic marked under weak areas.
   - **Deadline:** Scheduled for this evening.

2. **Next (30 min):** Solve 2 Medium Binary Search problems on LeetCode (*#875 Koko Eating Bananas*).
   - **Why:** Maintains your ${profile.dailyStudyHours}h target and streak.

3. **Rest (15 min):** Step away, hydrate, take a quick break.`;
    } else if (q.includes('2 hours') || q.includes('two hours') || q.includes('3 hours') || q.includes('time')) {
      reply = `### 2-Hour High-Impact Power Session:

- **00:00 – 00:45 (45 min):** Weak Area Focus — *DBMS Normalization & B+ Trees Practice*.
- **00:45 – 00:55 (10 min):** Screen-free rest & hydration.
- **00:55 – 01:35 (40 min):** Placement Prep — *Dynamic Programming (1D Memoization practice)*.
- **01:35 – 01:45 (10 min):** Quick Spaced Repetition Flashcards (Computer Networks TCP/IP handshake).
- **01:45 – 02:00 (15 min):** Buffer / Log progress & mark tasks done.`;
    } else if (q.includes('missed') || q.includes('yesterday') || q.includes('reschedule')) {
      reply = `### No Stress! Let's Reschedule Gracefully:

Missing a study block happens when college coursework spikes. We won't pile 6 hours of backlogs onto today.

**Here's the plan:**
1. We keep **1 critical backlog item**: *Operating Systems Virtual Memory (Paging)* and move it to this evening's 6:30 PM slot.
2. We drop or defer low-priority video watching to Saturday's open buffer block.
3. Your daily target remains **3.5 hours** so fatigue doesn't snowball.

I've already re-balanced your schedule! Check your updated Tasks list.`;
      autoRescheduleMissedTasks();
    } else if (q.includes('7-day') || q.includes('dsa plan')) {
      reply = `### 7-Day High-Yield DSA Sprint:

- **Day 1:** Arrays & Two Pointers (Prefix Sums, Container With Most Water)
- **Day 2:** Sliding Window (Longest Substring Without Repeating Characters)
- **Day 3:** Binary Search on Answer (Koko Eating Bananas)
- **Day 4:** Monotonic Stack (Daily Temperatures, Next Greater Element)
- **Day 5:** Binary Tree BFS & DFS (Level Order Traversal)
- **Day 6:** Graph Cycle Detection (Topological Sort / Kahn's Algorithm)
- **Day 7:** Revision & Timed Mock Contest (2 Medium questions, 60 min)`;
    } else {
      reply = `I'm analyzing your academic cockpit:
- Target Companies: ${profile.targetCompanies.join(', ')}
- Exams: ${exams.map(e => `${e.name} (${e.completedTopics}/${e.totalTopics} topics)`).join('; ')}
- Available daily hours: ${profile.dailyStudyHours}h

Would you like me to generate a tailored timetable for your next study block, or help you review one of your weak topics (${profile.weakSubjects.join(', ')})?`;
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'system',
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl transition-all sm:w-[480px] dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
            <Bot className="h-5 w-5" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
              title={`n8n Status: ${connectionStatus}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                StudentPilot AI
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Zap className="h-2.5 w-2.5 fill-current" />
                n8n Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              sailohitha.app.n8n.cloud
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-lg p-2 transition ${
              showSettings
                ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'
            }`}
            title="n8n Webhook Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetSession}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Reset Conversation Session"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Optional Settings Panel */}
      {showSettings && (
        <div className="border-b border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              n8n AI Workflow Webhook Integration
            </span>
            <span className="text-[10px] text-slate-500">Session: {sessionId.slice(0, 16)}...</span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={e => handleSaveWebhook(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleTestConnection}
                disabled={connectionStatus === 'checking'}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500"
              >
                {connectionStatus === 'checking' ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
                <span>Test Webhook</span>
              </button>

              <button
                onClick={() => handleSaveWebhook(DEFAULT_N8N_WEBHOOK)}
                className="text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Reset to default
              </button>
            </div>

            {testResult && (
              <div
                className={`mt-2 flex items-center gap-1.5 rounded-md p-2 text-xs ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                {connectionStatus === 'connected' ? (
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                )}
                <span>{testResult}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
              <div className="mt-2 flex items-center justify-between text-[9px]">
                <span
                  className={
                    msg.role === 'user'
                      ? 'text-indigo-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }
                >
                  {msg.timestamp}
                </span>

                {msg.role === 'assistant' && (
                  <span
                    className={`ml-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 font-semibold ${
                      msg.source === 'n8n'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : msg.source === 'gemini'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {msg.source === 'n8n' ? (
                      <>
                        <Zap className="h-2 w-2" /> n8n Agent
                      </>
                    ) : msg.source === 'gemini' ? (
                      <>
                        <Sparkles className="h-2 w-2" /> Gemini AI
                      </>
                    ) : (
                      'Smart Engine'
                    )}
                  </span>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white dark:bg-slate-700">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-700 dark:border-indigo-950 dark:bg-indigo-950/30 dark:text-indigo-300">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-500" />
            <span>n8n AI Workflow is processing your request...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-1.5 text-[10px] font-semibold text-slate-400">Quick Prompts:</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="flex-shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask your n8n AI Assistant anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
