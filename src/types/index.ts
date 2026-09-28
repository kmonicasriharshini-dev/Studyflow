export type SubjectId = 'dbms' | 'os' | 'cn' | 'daa' | 'se';

export interface Subject {
  id: SubjectId;
  code: string;
  name: string;
  semester: number;
  credits: number;
  instructor: string;
  totalTopics: number;
  coveredTopics: number;
  examDate: string; // ISO date
  examType: 'End-Term' | 'Mid-Term' | 'Quiz / Lab';
  room: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
  };
}

export type TopicDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Topic {
  id: string;
  subjectId: SubjectId;
  unitNumber: number;
  unitTitle: string;
  name: string;
  weightageMarks: number;
  difficulty: TopicDifficulty;
  isCovered: boolean;
  isUnlocked: boolean;
  prerequisites?: string[];
  estimatedHours: number;
  summary: string;
  highYield: boolean;
}

export interface Exam {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  code: string;
  title: string;
  date: string; // YYYY-MM-DD
  daysLeft: number;
  duration: string;
  totalMarks: number;
  criticalTopics: string[];
}

export interface Task {
  id: string;
  title: string;
  subjectId: SubjectId;
  subjectName: string;
  dueDate: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  estimatedMinutes: number;
  relatedTopicId?: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  date: string;
  focus: string;
  allocatedHours: number;
  topics: {
    id: string;
    name: string;
    difficulty: TopicDifficulty;
    completed: boolean;
    estimatedMinutes: number;
  }[];
  notes: string;
}

export interface NoteDocument {
  id: string;
  title: string;
  subjectId: SubjectId;
  fileName: string;
  uploadedAt: string;
  fileSize: string;
  pageCount: number;
  summary: string;
  tags: string[];
  chunks: {
    id: string;
    heading: string;
    page: number;
    content: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface TopicQuiz {
  topicId: string;
  topicName: string;
  subjectId: SubjectId;
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score?: number;
  requiredPassingScore: number; // e.g. 75
  questions: QuizQuestion[];
  unlockedByTopicId?: string;
  unlocksNextTopicId?: string;
}

export interface TutorExplanation {
  topic: string;
  subject: string;
  simpleIntuition: string;
  formalDefinition: string;
  stepByStepPoints: {
    step: number;
    title: string;
    detail: string;
    exampleOrCode?: string;
  }[];
  examPitfalls: string[];
  groundedNoteReference?: {
    documentTitle: string;
    page: number;
    quote: string;
  };
  practiceQuestions: {
    question: string;
    difficulty: TopicDifficulty;
    hint: string;
    solution: string;
  }[];
}

export interface AgentWorkflowStep {
  id: string;
  title: string;
  agentRole: 'Coordinator Agent' | 'Syllabus Specialist' | 'Schedule Planner' | 'RAG Tool' | 'LLM Synthesis' | 'Progress Sync';
  status: 'pending' | 'running' | 'completed' | 'failed';
  icon: string;
  durationMs?: number;
  thought: string;
  inputData?: any;
  outputData?: any;
  log?: string[];
}

export interface AgentWorkflowResult {
  query: string;
  studentGoal: string;
  identifiedSubject: string;
  identifiedTopic: string;
  daysRemaining: number;
  availableHours: number;
  studyPlan: StudyPlanDay[];
  retrievedNotes: {
    docTitle: string;
    page: number;
    snippet: string;
    relevanceScore: number;
  }[];
  explanation: TutorExplanation;
  practiceQuestions: {
    question: string;
    type: string;
    expectedAnswer: string;
  }[];
  progressDelta: {
    topicsAdded: number;
    planDaysCreated: number;
    targetMilestone: string;
  };
}
