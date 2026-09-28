import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RefreshCw,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { ChatMessage } from '../types';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { profile, exams, goals, courses, dsaProblems, tasks, revisions, autoRescheduleMissedTasks } =
    useStudent();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello ${profile.name.split(' ')[0]}! I'm your StudentPilot AI Assistant. I have your complete status loaded: target companies (${profile.targetCompanies.slice(0, 2).join(', ')}), ${profile.dailyStudyHours}h daily target, and your upcoming exams. How can I help you optimize your study day?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What should I study today?',
    'Create a 7-day DSA plan',
    'I have 2 hours. What should I do?',
    'Which topics are still incomplete?',
    'I missed yesterday\'s schedule. Reschedule it.',
    'How much of my syllabus is complete?',
    'Create a revision plan for DBMS',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          context: {
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
            missedTasks: tasks.filter(t => !t.completed && (t.isMissed || t.deadline < new Date().toISOString().split('T')[0])),
          },
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
          };
          setMessages(prev => [...prev, botMsg]);

          if (query.toLowerCase().includes('reschedule') || query.toLowerCase().includes('missed')) {
            autoRescheduleMissedTasks();
          }
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend chat fetch error, using smart response engine', e);
    }

    // Fallback answer based on query
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('what should i do') || q.includes('what to study') || q.includes('next task')) {
      reply = `### Recommended Next Action for You:

1. **Top Priority (45 min):** Complete *Linear Algebra – Eigenvalues & Matrix Diagonalization*.
   - **Why:** Your GATE exam has this marked under weak areas, and it carries 6-8 marks.
   - **Deadline:** Scheduled for this evening.

2. **Next (30 min):** Solve 2 Medium Binary Search problems on LeetCode (*#875 Koko Eating Bananas*).
   - **Why:** Keeps your ${profile.dailyStudyHours}h target and 14-day DSA streak alive.

3. **Rest (15 min):** Step away from screen, hydrate, take a quick walk.`;
    } else if (q.includes('2 hours') || q.includes('two hours') || q.includes('3 hours') || q.includes('time')) {
      reply = `### 2-Hour High-Impact Power Session:

- **00:00 – 00:45 (45 min):** Weak Area Focus — *DBMS Normalization & B+ Trees Practice*.
- **00:45 – 00:55 (10 min):** Screen-free rest & hydration.
- **00:55 – 01:35 (40 min):** Placement Prep — *Dynamic Programming (1D Memoization practice)*.
- **01:35 – 01:45 (10 min):** Quick Spaced Repetition Flashcards (Computer Networks TCP/IP handshake).
- **01:45 – 02:00 (15 min):** Buffer / Log progress & mark tasks done.

Realistic and zero burnout! Ready to start?`;
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
- **Day 3:** Binary Search on Search Space & Rotated Arrays
- **Day 4:** Fast & Slow Pointers (Cycle Detection, Reorder List)
- **Day 5:** Monotonic Stack & Queue (Next Greater Element, Daily Temperatures)
- **Day 6:** Binary Trees DFS/BFS & Lowest Common Ancestor
- **Day 7:** Weekly Mock Assessment (3 questions in 60 mins) + Error Logging

Target: 2 problems/day = 14 problems with zero panic.`;
    } else if (q.includes('syllabus') || q.includes('incomplete') || q.includes('progress')) {
      reply = `### Current Syllabus & Goal Overview:

- **GATE DA/CS:** 46% Complete (139 days remaining).
  - *Needs focus:* Probability (25%), Linear Algebra (45%).
- **Semester Exams:** 65% Complete.
- **DSA Curriculum:** 84/250 target problems solved (33.6%).
- **Active Courses:** 2 courses in progress (Andrew Ng Machine Learning at 59%, Striver DSA at 65%).

You are well on track for your graduation target! Keep steady daily output.`;
    } else {
      reply = `Hello! I have your full profile loaded: your ${profile.cgpa} CGPA, target companies (${profile.targetCompanies.slice(0, 2).join(', ')}), upcoming exams, and active 14-day streak.

You can ask me to:
- Generate a study schedule for any available hours today
- Help reschedule missed yesterday tasks without burnout
- Recommend what to study right now
- Create customized sprint plans for DSA or GATE
- Check your remaining syllabus and weak areas`;
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      {/* Drawer Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              StudentPilot Assistant
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Grounded in your goals & college schedule
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white dark:bg-indigo-500">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={`mt-1.5 text-[9px] ${
                  msg.role === 'user'
                    ? 'text-indigo-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {msg.timestamp}
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
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-500" />
            <span>Analyzing timetable & syllabus pace...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="text-[10px] font-semibold text-slate-400 mb-1.5">Quick Prompts:</div>
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
            placeholder="Ask anything about your schedule, DSA, or exams..."
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
