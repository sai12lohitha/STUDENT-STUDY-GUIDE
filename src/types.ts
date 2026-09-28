export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  degree: string;
  branch: string;
  college: string;
  currentYearSemester: string;
  cgpa: number;
  graduationYear: number;
  careerGoal: string;
  targetCompanies: string[];
  targetExams: string[];
  dailyStudyHours: number;
  preferredStudyTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  strongSubjects: string[];
  weakSubjects: string[];
  collegeStartTime: string;
  collegeEndTime: string;
  travelHoursDaily: number;
  sleepHours: number;
}

export interface Goal {
  id: string;
  name: string;
  category: 'Placement' | 'Exam' | 'Project' | 'Skill';
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number; // 0-100
  requiredTopics: string[];
  completedTopics: string[];
  dailyWeeklyTarget: string;
  description?: string;
}

export interface ExamTopic {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  knowledgeLevel: 'Beginner' | 'Intermediate' | 'Proficient';
  weightagePercent: number;
  completed: boolean;
  completionDate?: string;
}

export interface Exam {
  id: string;
  name: string;
  examDate: string;
  targetScore: string;
  totalTopics: number;
  completedTopics: number;
  subjects: {
    subjectName: string;
    progress: number; // 0-100
    topics: ExamTopic[];
  }[];
}

export type DSATopicName =
  | 'Arrays'
  | 'Strings'
  | 'Linked Lists'
  | 'Stack'
  | 'Queue'
  | 'Binary Search'
  | 'Trees'
  | 'Graphs'
  | 'Recursion'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Bit Manipulation';

export interface DSAProblem {
  id: string;
  title: string;
  topic: DSATopicName;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: 'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'CodeChef' | 'Codeforces' | 'Other';
  url: string;
  status: 'To Do' | 'In Progress' | 'Solved' | 'Revisiting';
  accuracyRate?: number;
  solvedAt?: string;
  notes?: string;
}

export interface AptitudeTopic {
  id: string;
  category: 'Quantitative' | 'Logical' | 'Data Interpretation' | 'Verbal';
  name: string;
  problemsPracticed: number;
  accuracy: number;
  masteryLevel: 'Needs Practice' | 'Good' | 'Mastered';
}

export interface CSFundamentalTopic {
  id: string;
  subject: 'DBMS' | 'SQL' | 'Operating Systems' | 'Computer Networks' | 'OOP' | 'Software Engineering';
  topic: string;
  status: 'Not Started' | 'In Progress' | 'Revised' | 'Interview Ready';
  notes?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'Resume' | 'Mock';
  question: string;
  sampleAnswer?: string;
  prepared: boolean;
}

export interface Course {
  id: string;
  name: string;
  platform: 'YouTube' | 'Coursera' | 'Udemy' | 'NPTEL' | 'edX' | 'Great Learning' | 'GeeksforGeeks' | 'GO Classes' | 'Other';
  instructor: string;
  courseUrl: string;
  totalLectures: number;
  completedLectures: number;
  estimatedTotalHours: number;
  completedHours: number;
  startDate: string;
  targetCompletionDate: string;
  priority: 'High' | 'Medium' | 'Low';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string; // YYYY-MM-DD
  timeSlot?: string; // e.g. "06:30 - 07:30"
  estimatedDurationMins: number;
  category: 'DSA' | 'Exam' | 'Placement' | 'Course' | 'Revision' | 'College' | 'Project' | 'Personal';
  isRecurring: boolean;
  completed: boolean;
  completedAt?: string;
  isMissed?: boolean;
}

export interface RevisionItem {
  id: string;
  topicName: string;
  subject: string;
  sourceType: 'DSA' | 'Exam' | 'Course' | 'CS Fundamentals';
  learnedDate: string;
  stage: 0 | 1 | 2 | 3 | 4; // Day 0, Day 1, Day 7, Day 21, Day 45
  nextRevisionDate: string; // YYYY-MM-DD
  status: 'Due Today' | 'Upcoming' | 'Completed';
  lastRevisedDate?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: 'College' | 'Exam' | 'Placement' | 'DSA' | 'Course' | 'Revision' | 'Assignment' | 'Personal';
  description?: string;
  completed?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Website' | 'Book' | 'Notes' | 'Coding Problem';
  subject: string;
  platform: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  completed: boolean;
  notes?: string;
}

export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'OA Scheduled'
  | 'OA Completed'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  applicationDate: string;
  deadline?: string;
  status: ApplicationStatus;
  testDate?: string;
  interviewDate?: string;
  result?: string;
  jobLink?: string;
  notes?: string;
  salaryPackage?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'exam' | 'course' | 'task' | 'revision' | 'placement' | 'streak';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}

export interface DailyScheduleSlot {
  timeRange: string;
  activity: string;
  category: 'College' | 'DSA' | 'Exam' | 'Course' | 'Revision' | 'Break' | 'Personal';
  notes?: string;
  completed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'n8n' | 'gemini' | 'system';
}
