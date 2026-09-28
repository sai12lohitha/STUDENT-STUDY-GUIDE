import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for realistic and reliable responses
function getFallbackPlan(prompt: string, context?: any) {
  const hoursMatch = prompt.match(/(\d+)\s*(?:hours?|hrs?)/i);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 3;

  return {
    overview: `Tailored study plan optimized for ${hours} hours of high-focus study, balancing your urgent targets with fatigue management and retention breaks.`,
    allocations: [
      {
        time: '45 mins',
        topic: 'Linear Algebra: Eigenvalues & Diagonalization',
        category: 'Exam Prep',
        activity: 'Active recall & problem sets',
        priority: 'High',
        why: 'Weak area identified in profile; high-weightage topic for GATE/Semester.',
      },
      {
        time: '15 mins',
        topic: 'Cognitive Reset & Hydration Break',
        category: 'Break',
        activity: 'Step away from screen, hydrate, light stretching',
        priority: 'Low',
        why: 'Prevents mental fatigue and sustains 90%+ focus efficiency.',
      },
      {
        time: '50 mins',
        topic: 'DSA: Binary Search on Answer & 2D Matrices',
        category: 'Placement Prep',
        activity: 'Solve 2 Medium problems (LeetCode #875, #74)',
        priority: 'High',
        why: 'Core placement pattern tested frequently by tier-1 tech firms.',
      },
      {
        time: '10 mins',
        topic: 'Short Breathing & Note Review',
        category: 'Break',
        activity: 'Quick mental summary of binary search invariants',
        priority: 'Low',
        why: 'Consolidates short-term working memory.',
      },
      {
        time: '40 mins',
        topic: 'DBMS: Normalization & B+ Trees',
        category: 'Core CS',
        activity: 'Spaced Repetition review and 5 tricky interview questions',
        priority: 'Medium',
        why: 'Scheduled revision item due today; rapid confidence builder.',
      },
      {
        time: '20 mins',
        topic: 'Daily Wrap-up & Tomorrow Priority Staging',
        category: 'Review',
        activity: 'Log completed tasks, update streak, verify tomorrow college slots',
        priority: 'Medium',
        why: 'Ensures zero cognitive friction when starting tomorrow.',
      },
    ],
    practiceQuestions: [
      'Find the condition under which matrix A is diagonalizable with repeated eigenvalues.',
      'LeetCode 875: Koko Eating Bananas (identify lower and upper bounds of binary search).',
      'Explain the difference between 3NF and BCNF with a functional dependency example.',
    ],
    revisionTasks: [
      'Day 7 review: SQL Window Functions (ROW_NUMBER vs DENSE_RANK)',
      'Quick glance at Probability Bayes Theorem formulas',
    ],
    tips: [
      'Do not study continuously past 50 minutes; taking 10-minute pauses preserves deep work capacity.',
      'Prioritize concept clarity over quantity of solved questions.',
    ],
  };
}

// Endpoint: AI Study Planner
app.post(['/api/gemini/plan', '/gemini/plan'], async (req, res) => {
  const { prompt, profile, goals, exams, courses, dsa } = req.body;

  if (ai) {
    try {
      const systemInstruction = `You are StudentPilot, an intelligent, empathetic, and realistic academic and career assistant for engineering and college students.
Your job is to generate a realistic, prioritized, non-overwhelming study plan based on student input, their available hours, upcoming exams, placement targets, and weak areas.
Do NOT create exhausting 10-12 hour timetables. Consider cognitive fatigue, active breaks, spaced repetition, and realistic pacing.
Always return valid JSON adhering strictly to this schema:
{
  "overview": "Brief motivating summary of the plan",
  "allocations": [
    {
      "time": "Duration (e.g. 45 mins)",
      "topic": "Specific topic name",
      "category": "Exam Prep | Placement Prep | Core CS | Break | Review",
      "activity": "Specific action to take",
      "priority": "High | Medium | Low",
      "why": "Reason why this is prioritized now"
    }
  ],
  "practiceQuestions": ["question 1", "question 2", "question 3"],
  "revisionTasks": ["revision task 1", "revision task 2"],
  "tips": ["actionable advice 1", "actionable advice 2"]
}`;

      const contextSummary = `Student Profile: ${profile?.name || 'Student'}, Degree: ${profile?.degree || 'CS'}, CGPA: ${profile?.cgpa || '8.5'}.
Target Companies: ${(profile?.targetCompanies || ['Top Tech']).join(', ')}.
Target Exams: ${(profile?.targetExams || ['GATE', 'Semester']).join(', ')}.
Weak Subjects: ${(profile?.weakSubjects || ['Probability', 'Linear Algebra']).join(', ')}.
Strong Subjects: ${(profile?.strongSubjects || ['Data Structures']).join(', ')}.
Available Daily Study Hours: ${profile?.dailyStudyHours || 3} hours.
Upcoming Exams: ${JSON.stringify(exams || [])}.
Active Goals: ${JSON.stringify((goals || []).map((g: any) => ({ name: g.name, progress: g.progress })))}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Student Request: "${prompt}"\n\nStudent Context:\n${contextSummary}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed, source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini plan generation error, falling back to local engine:', err?.message);
    }
  }

  // Fallback
  const fallback = getFallbackPlan(prompt || '', { profile, exams, goals });
  res.json({ success: true, data: fallback, source: 'smart-engine' });
});

// Default n8n webhook endpoint for StudentPilot AI Assistant
const DEFAULT_N8N_WEBHOOK = 'https://sailohitha.app.n8n.cloud/webhook/b5baae03-8d83-4cad-a84b-2ef854747698/chat';

async function queryN8nWebhook(
  webhookUrl: string,
  chatInput: string,
  sessionId?: string,
  context?: any,
  timeoutMs = 28000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify({
        chatInput,
        message: chatInput,
        sessionId: sessionId || 'studentpilot-user',
        context,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`n8n webhook responded with HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data: any = await res.json();
      if (typeof data === 'string') return data;
      if (data.output) return data.output;
      if (data.text) return data.text;
      if (data.response) return data.response;
      if (data.message) return data.message;
      if (data.reply) return data.reply;
      if (Array.isArray(data) && data[0]?.output) return data[0].output;
      return JSON.stringify(data);
    } else {
      const text = await res.text();
      return text;
    }
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// Endpoint: n8n AI Assistant Proxy
app.post(['/api/n8n/chat', '/n8n/chat'], async (req, res) => {
  const { message, chatInput, sessionId, webhookUrl, context } = req.body;
  const input = chatInput || message || '';
  const url = webhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;

  try {
    const reply = await queryN8nWebhook(url, input, sessionId, context);
    return res.json({ success: true, reply, source: 'n8n' });
  } catch (err: any) {
    console.warn('n8n proxy error, attempting fallback:', err?.message);
    return res.status(502).json({ success: false, error: err?.message });
  }
});

// Endpoint: AI Chatbot Assistant (supports n8n & Gemini with dual fallback)
app.post(['/api/gemini/chat', '/gemini/chat'], async (req, res) => {
  const { message, history, context, preferN8n = true, sessionId, webhookUrl } = req.body;

  // Try n8n first if preferred
  if (preferN8n !== false) {
    try {
      const url = webhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;
      const n8nReply = await queryN8nWebhook(url, message, sessionId, context, 15000);
      if (n8nReply && n8nReply.trim()) {
        return res.json({ success: true, reply: n8nReply, source: 'n8n' });
      }
    } catch (n8nErr: any) {
      console.warn('n8n failed in chat endpoint, trying Gemini fallback:', n8nErr?.message);
    }
  }

  if (ai) {
    try {
      const systemInstruction = `You are StudentPilot AI, the student's personal academic and career coach.
You know the student's complete status:
- Student Name: ${context?.profile?.name || 'Student'}
- Career Goal: ${context?.profile?.careerGoal || 'Software Engineer'}
- Target Companies: ${(context?.profile?.targetCompanies || []).join(', ')}
- Target Exams: ${(context?.profile?.targetExams || []).join(', ')}
- Daily Available Study Hours: ${context?.profile?.dailyStudyHours || 3} hours
- Weak Subjects: ${(context?.profile?.weakSubjects || []).join(', ')}
- Strong Subjects: ${(context?.profile?.strongSubjects || []).join(', ')}
- DSA Solved: ${context?.dsaStats?.solved || 84} problems (Easy: ${context?.dsaStats?.easy || 42}, Med: ${context?.dsaStats?.medium || 34}, Hard: ${context?.dsaStats?.hard || 8})
- Exams: ${(context?.exams || []).map((e: any) => `${e.name} in ${e.daysRemaining} days (${e.progress}% syllabus complete)`).join('; ')}
- Overdue or Missed Tasks: ${(context?.missedTasks || []).map((t: any) => t.title).join(', ') || 'None'}
- Today's pending tasks: ${(context?.todayTasks || []).map((t: any) => t.title).join(', ')}

Guidelines:
1. Provide concise, direct, supportive, and practical answers.
2. Structure your replies using clear formatting (bullet points, short sections).
3. If they ask "What should I do now?" or "I have 2 hours", give an exact time-stamped breakdown.
4. If they missed yesterday's tasks, give them reassuring advice and prioritize moving only high-impact tasks without cramming.
5. Emphasize consistency over burnout.`;

      const contents = [
        ...(history || []).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ success: true, reply: response.text, source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini chat error, using fallback:', err?.message);
    }
  }

  // Fallback intelligent responses based on query keywords
  const q = (message || '').toLowerCase();
  let reply = '';

  if (q.includes('what should i do') || q.includes('what to study') || q.includes('next task')) {
    reply = `### Recommended Next Action for You:

1. **Top Priority (45 min):** Complete *Linear Algebra – Eigenvalues & Matrix Diagonalization*.
   - **Why:** Your GATE/Semester exam has this marked under weak areas, and it carries 6-8 marks.
   - **Deadline:** Tomorrow morning.

2. **Next (30 min):** Solve 2 Medium Binary Search problems on LeetCode (*#875 Koko Eating Bananas*).
   - **Why:** Keeps your 12-day DSA streak alive.

3. **Rest (15 min):** Step away, grab water, take a walk.

Would you like me to lock this into your schedule for today?`;
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

Missing a day is completely normal in college life. We won't pile 6 hours of backlogs onto today.

**Here's the plan:**
1. We keep **1 critical backlog item**: *Operating Systems Virtual Memory (Paging)* and move it to this evening's 6:30 PM slot.
2. We drop or defer low-priority video watching to Saturday's open buffer block.
3. Your daily target remains **3 hours** so fatigue doesn't snowball.

Click the **"Auto-Reschedule Incomplete Tasks"** button in Tasks to sync this instantly!`;
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

- **GATE DA/CS:** 45% Complete (118 days remaining). 
  - *Needs focus:* Probability (20%), Linear Algebra (45%).
- **Semester Exams:** 65% Complete.
- **DSA Curriculum:** 84/180 target problems solved (46.7%).
- **Active Courses:** 2 courses in progress (Andrew Ng Machine Learning at 58%, Striver DSA at 64%).

You are well on track for your graduation target! Keep steady daily output.`;
  } else {
    reply = `Hello! I'm your StudentPilot Assistant. I have your full profile loaded: your 8.8 CGPA, target companies (${(context?.profile?.targetCompanies || ['Google', 'Microsoft']).join(', ')}), upcoming exams, and active DSA streak.

You can ask me to:
- Generate a study schedule for any available hours today
- Help reschedule missed yesterday tasks without burnout
- Recommend what to study right now
- Create customized sprint plans for DSA or GATE
- Check your remaining syllabus and weak areas`;
  }

  res.json({ success: true, reply, source: 'smart-engine' });
});

// Endpoint: AI Daily Summary
app.post(['/api/gemini/summary', '/gemini/summary'], async (req, res) => {
  const { completedTasks, studyHours, dsaSolved, streak, missedTasks } = req.body;

  if (ai) {
    try {
      const prompt = `Generate a motivating end-of-day summary for a college student who studied ${studyHours || 2.5} hours today, solved ${dsaSolved || 3} DSA questions, maintained a ${streak || 14}-day streak, completed ${(completedTasks || []).length} tasks, and had ${(missedTasks || []).length} unfinished tasks.
Include:
1. Today's tangible achievements
2. Productivity rating with encouraging feedback
3. Tomorrow's 3 priority tasks
4. A short reflection prompt.
Keep it concise, actionable, and warm.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, summary: response.text, source: 'gemini' });
    } catch (e: any) {
      console.warn('Gemini summary error:', e?.message);
    }
  }

  const summary = `### Today's Progress Summary

* **Study Time:** ${studyHours || 2.5} hours logged (Target: 3.0h)
* **DSA Problems:** ${dsaSolved || 2} problems solved with solid test case coverage
* **Tasks Completed:** ${(completedTasks || []).length || 4} priority items cleared
* **Consistency Streak:** ${streak || 14} consecutive days active! 🔥

#### Tomorrow's Recommended Priorities:
1. **Linear Algebra:** Eigenvectors practice problem set (45 min)
2. **DSA:** Binary Search Tree validations (2 Mediums)
3. **Course Lecture:** Deep Learning Week 3 Section 2 (35 min)

> *Tip: Unfinished tasks have been gracefully buffered into tomorrow's free slots so you start with a clean mental slate.*`;

  res.json({ success: true, summary, source: 'smart-engine' });
});

// Serve frontend with Vite in dev, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudentPilot server running on http://0.0.0.0:${PORT}`);
  });
}

// In local / standard server environments, launch the server.
// In Vercel serverless environments, VERCEL is set and the app is handled via serverless functions.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
