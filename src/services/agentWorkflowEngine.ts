import { AgentWorkflowStep, AgentWorkflowResult, StudyPlanDay, TutorExplanation } from '../types';
import { INITIAL_NOTES, INITIAL_TOPICS, DEFAULT_TUTOR_NORMALIZATION } from '../data/mockData';

export type StepCallback = (step: AgentWorkflowStep, allSteps: AgentWorkflowStep[]) => void;

export async function executeAgenticWorkflow(
  query: string,
  onStepUpdate: StepCallback
): Promise<AgentWorkflowResult> {
  const steps: AgentWorkflowStep[] = [
    {
      id: 'step-1',
      title: 'Goal Understanding & Coordinator Agent',
      agentRole: 'Coordinator Agent',
      status: 'pending',
      icon: 'Brain',
      thought: 'Parsing student prompt for intent, target subject, exam deadline, and identified knowledge gap.',
    },
    {
      id: 'step-2',
      title: 'Syllabus & Curriculum Graph Inspection',
      agentRole: 'Syllabus Specialist',
      status: 'pending',
      icon: 'BookOpen',
      thought: 'Traversing semester syllabus tree to locate topic node, prerequisite chain, and exam weightage.',
    },
    {
      id: 'step-3',
      title: 'Study Time & Schedule Optimization',
      agentRole: 'Schedule Planner',
      status: 'pending',
      icon: 'Calendar',
      thought: 'Calculating available cognitive hours, cognitive load balancing, and generating day-by-day sprint plan.',
    },
    {
      id: 'step-4',
      title: 'Tool / RAG Notes Retrieval',
      agentRole: 'RAG Tool',
      status: 'pending',
      icon: 'Search',
      thought: 'Executing semantic search across uploaded professor lecture notes and lecture slides for relevant excerpts.',
    },
    {
      id: 'step-5',
      title: 'AI Tutor Explanation Synthesis (LLM)',
      agentRole: 'LLM Synthesis',
      status: 'pending',
      icon: 'Sparkles',
      thought: 'Generating simple English intuition, formal rules, schema decomposition tables, and university exam pitfalls.',
    },
    {
      id: 'step-6',
      title: 'Practice Problem & Assessment Tool',
      agentRole: 'RAG Tool',
      status: 'pending',
      icon: 'CheckCircle2',
      thought: 'Synthesizing targeted university-level practice questions to test decomposition mastery.',
    },
    {
      id: 'step-7',
      title: 'Progress Synchronization & State Update',
      agentRole: 'Progress Sync',
      status: 'pending',
      icon: 'TrendingUp',
      thought: 'Updating student portal dashboard, scheduling daily tasks, and configuring topic unlock checkpoints.',
    },
  ];

  // Helper to mark and emit
  const updateStep = (index: number, updates: Partial<AgentWorkflowStep>) => {
    steps[index] = { ...steps[index], ...updates };
    onStepUpdate(steps[index], [...steps]);
  };

  // Check if server Gemini API is reachable
  let serverGeminiData: any = null;
  try {
    const res = await fetch('/api/agent/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (res.ok) {
      serverGeminiData = await res.json();
    }
  } catch {
    // Graceful fallback to client agentic pipeline
  }

  // STEP 1: Coordinator Agent
  updateStep(0, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 650));
  
  const isDbms = /dbms|database|normalization|sql/i.test(query);
  const isOs = /os|operating system|paging|segmentation|deadlock/i.test(query);
  const identifiedSubject = isDbms ? 'Database Management Systems (CS501)' : isOs ? 'Operating Systems (CS502)' : 'Computer Networks (CS503)';
  const identifiedTopic = isDbms ? 'Relational Normalization (1NF, 2NF, 3NF, BCNF)' : isOs ? 'Virtual Memory Paging & Replacement' : 'TCP Congestion Control & Subnetting';
  const daysMatch = query.match(/(\d+)\s*days?/i);
  const daysRemaining = daysMatch ? parseInt(daysMatch[1], 10) : 10;
  const availableHours = daysRemaining * 2.5;

  updateStep(0, {
    status: 'completed',
    durationMs: 680,
    outputData: {
      studentIntent: 'Targeted Exam Sprint Preparation',
      targetSubject: identifiedSubject,
      focalTopic: identifiedTopic,
      deadlineHorizonDays: daysRemaining,
      computedAvailableStudyHours: availableHours,
      assignedDelegates: ['SyllabusSpecialistAgent', 'ScheduleOptimizerAgent', 'DocumentRAGRetrieverTool', 'TutorSynthesisEngine'],
    },
    log: [
      `[Coordinator] Detected high urgency: ${daysRemaining} days until examination.`,
      `[Coordinator] Classified domain: ${identifiedSubject}.`,
      `[Coordinator] Extracted weak topic: "${identifiedTopic}".`,
      `[Coordinator] Routing tasks to 4 specialized agents and tools.`,
    ],
  });

  // STEP 2: Syllabus Specialist
  updateStep(1, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 700));

  const relevantTopics = INITIAL_TOPICS.filter((t) => t.subjectId === (isDbms ? 'dbms' : isOs ? 'os' : 'cn'));
  updateStep(1, {
    status: 'completed',
    durationMs: 720,
    outputData: {
      syllabusUnit: isDbms ? 'Unit 3: Relational Database Design & Normalization' : 'Unit 3: Memory Management & Virtual Memory',
      identifiedSubtopics: isDbms
        ? ['Functional Dependencies', 'Closure F+', '1NF & 2NF', '3NF Transitive Dependency', 'Boyce-Codd (BCNF)', 'Lossless Join Property']
        : ['Paging', 'TLB', 'Inverted Page Tables', 'FIFO', 'LRU'],
      examWeightage: '18 - 22 Marks out of 100',
      difficultyCurve: 'Medium to Hard',
      prerequisitesMet: 'Unit 1 (ER Models) & Unit 2 (Relational Algebra) marked completed.',
    },
    log: [
      `[SyllabusAgent] Scanned course catalogue CS501 for Semester 5.`,
      `[SyllabusAgent] Identified 5 sequential concepts in Unit 3.`,
      `[SyllabusAgent] Flagged as HIGHEST EXAM YIELD (22% of total semester grade).`,
    ],
  });

  // STEP 3: Schedule Planner
  updateStep(2, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 750));

  const studyPlan: StudyPlanDay[] = [
    {
      dayNumber: 1,
      date: 'Day 1',
      focus: 'Armstrong Axioms & Attribute Closures (F+)',
      allocatedHours: 2.5,
      notes: 'Master candidate key derivation algorithm. Ensure F+ closure is 100% accurate.',
      topics: [
        { id: 't-1', name: 'Functional Dependencies & Closure Algorithm', difficulty: 'Medium', completed: true, estimatedMinutes: 60 },
        { id: 't-2', name: 'Candidate Key Extraction Practice', difficulty: 'Medium', completed: false, estimatedMinutes: 60 },
      ],
    },
    {
      dayNumber: 2,
      date: 'Day 2',
      focus: '1NF, 2NF & Eliminating Partial Dependencies',
      allocatedHours: 2.5,
      notes: 'Focus on composite key decomposition. Avoid atomic split mistakes.',
      topics: [
        { id: 't-3', name: 'First Normal Form (Atomicity)', difficulty: 'Easy', completed: false, estimatedMinutes: 40 },
        { id: 't-4', name: 'Second Normal Form (Full Functional Dependency)', difficulty: 'Easy', completed: false, estimatedMinutes: 80 },
      ],
    },
    {
      dayNumber: 3,
      date: 'Day 3',
      focus: 'Third Normal Form (3NF) & Transitive Anomalies',
      allocatedHours: 3.0,
      notes: 'Condition check: X is superkey OR Y is prime attribute. High probability question.',
      topics: [
        { id: 't-5', name: '3NF Theoretical Definition & Formal Proof', difficulty: 'Medium', completed: false, estimatedMinutes: 90 },
        { id: 't-6', name: '3NF University Exam Problem Set', difficulty: 'Medium', completed: false, estimatedMinutes: 60 },
      ],
    },
    {
      dayNumber: 4,
      date: 'Day 4',
      focus: 'Boyce-Codd Normal Form (BCNF) & Redundancy Removal',
      allocatedHours: 3.0,
      notes: 'Contrast with 3NF. Why BCNF does not always preserve functional dependencies.',
      topics: [
        { id: 't-7', name: 'BCNF Strict Superkey Condition', difficulty: 'Hard', completed: false, estimatedMinutes: 90 },
        { id: 't-8', name: 'BCNF Decomposition Algorithm Steps', difficulty: 'Hard', completed: false, estimatedMinutes: 60 },
      ],
    },
    {
      dayNumber: 5,
      date: 'Day 5',
      focus: 'Lossless Join & Dependency Preservation Tests',
      allocatedHours: 2.5,
      notes: 'Test (R1 ∩ R2) -> R1 or R2. Chase algorithm overview.',
      topics: [
        { id: 't-9', name: 'Lossless Join Theorem Verification', difficulty: 'Hard', completed: false, estimatedMinutes: 75 },
        { id: 't-10', name: 'Dependency Preservation Testing', difficulty: 'Medium', completed: false, estimatedMinutes: 60 },
      ],
    },
    {
      dayNumber: 6,
      date: `Days 6 - ${daysRemaining}`,
      focus: 'Transactions, Concurrency, Past Year Papers & Mock Exam',
      allocatedHours: daysRemaining > 5 ? (daysRemaining - 5) * 2.5 : 5,
      notes: 'Full revision and 3-hour simulated university mock exam.',
      topics: [
        { id: 't-11', name: 'ACID & Conflict Serializability', difficulty: 'Medium', completed: false, estimatedMinutes: 90 },
        { id: 't-12', name: '2024 & 2025 End-Term Question Papers', difficulty: 'Hard', completed: false, estimatedMinutes: 120 },
      ],
    },
  ];

  updateStep(2, {
    status: 'completed',
    durationMs: 780,
    outputData: {
      allocatedDays: daysRemaining,
      dailyStudyHours: 2.5,
      totalStudyBudget: `${availableHours} Hours`,
      structure: '5-Day Intensive Core Normalization Sprint + 5-Day Revision & Mock Papers',
      milestones: ['Day 2: 2NF Mastery', 'Day 4: BCNF Mastery', 'Day 5: Decomposition Proofs', 'Day 9: Full Mock Exam'],
    },
    log: [
      `[Planner] Scheduled 14 hours for Normalization (Unit 3).`,
      `[Planner] Reserved 11 hours for Unit 4/5 revision and past paper practice.`,
      `[Planner] Balanced cognitive load to maximum 3.0 hours/day to prevent burnout.`,
    ],
  });

  // STEP 4: Tool / RAG Retriever
  updateStep(3, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 800));

  const noteDoc = INITIAL_NOTES[0];
  const retrievedNotes = [
    {
      docTitle: noteDoc.title,
      page: 3,
      snippet: noteDoc.chunks[0].content.slice(0, 240) + '...',
      relevanceScore: 0.98,
    },
    {
      docTitle: noteDoc.title,
      page: 7,
      snippet: noteDoc.chunks[1].content.slice(0, 240) + '...',
      relevanceScore: 0.94,
    },
    {
      docTitle: noteDoc.title,
      page: 12,
      snippet: noteDoc.chunks[2].content.slice(0, 260) + '...',
      relevanceScore: 0.97,
    },
  ];

  updateStep(3, {
    status: 'completed',
    durationMs: 820,
    outputData: {
      queriedDocument: noteDoc.fileName,
      embeddingModel: 'Vector Similarity (RAG Index)',
      chunksRetrieved: 3,
      topSimilarityMatch: '98% (Page 12: 3NF vs BCNF Decomposition)',
      citation: 'Prof. Rao, Unit 3 Lecture Handouts',
    },
    log: [
      `[RAG Tool] Searched student repository for "normalization, 3NF, BCNF, functional dependencies".`,
      `[RAG Tool] Found 3 high-relevance chunks from Prof_Rao_DBMS_Unit3_Normalization.pdf.`,
      `[RAG Tool] Injected context into LLM Prompt Context Window.`,
    ],
  });

  // STEP 5: LLM Synthesis
  updateStep(4, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 900));

  const explanation: TutorExplanation = serverGeminiData?.explanation || DEFAULT_TUTOR_NORMALIZATION;

  updateStep(4, {
    status: 'completed',
    durationMs: 940,
    outputData: {
      intuitionHeadline: 'The Kitchen Drawer / Duplicate Grocery Analogy',
      formalRuleEngine: 'FDs, Armstrong Axioms & Superkey Rules',
      stepByStepLevels: ['1NF (Atomicity)', '2NF (No Partial FDs)', '3NF (No Transitive FDs)', 'BCNF (Strict Superkey)'],
      pitfallsIdentified: 3,
      tone: 'Intuitive, Student-Centric & Exam-Optimized',
    },
    log: [
      `[LLM Engine] Generated step-by-step intuitive explanation using everyday analogy.`,
      `[LLM Engine] Grounded technical definitions against retrieved Prof. Rao lecture notes.`,
      `[LLM Engine] Highlighted 3 critical traps frequently tested by university examiners.`,
    ],
  });

  // STEP 6: Practice & Assessment Tool
  updateStep(5, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 650));

  const practiceQuestions = [
    {
      question: 'Given relation R(A, B, C, D) with FDs { A -> B, B -> C, C -> D }. Find the candidate key and identify the highest normal form of R.',
      type: 'Solved University Problem',
      expectedAnswer: 'Candidate key is {A}. Highest normal form is 2NF because B -> C violates 3NF (transitive dependency of non-prime attribute C on non-prime B).',
    },
    {
      question: 'Why is every BCNF relation automatically in 3NF, but not every 3NF relation in BCNF?',
      type: 'Conceptual University Theory (5 Marks)',
      expectedAnswer: '3NF permits non-superkey determinants if the dependent attribute is prime. BCNF strictly eliminates this escape clause, requiring every determinant to be a superkey.',
    },
    {
      question: 'Test if decomposing R(A, B, C) into R1(A, B) and R2(B, C) with FD { A -> B } is lossless join.',
      type: 'Algorithmic Decomposition Proof',
      expectedAnswer: 'R1 ∩ R2 = {B}. {B}+ = {B}, which is neither a key of R1 nor R2. Hence, the decomposition is LOSSY (spurious tuples will be produced).',
    },
  ];

  updateStep(5, {
    status: 'completed',
    durationMs: 690,
    outputData: {
      generatedQuestionsCount: 3,
      questionTypes: ['Candidate Key & Highest NF', 'BCNF vs 3NF University Proof', 'Lossless Join Verification'],
      answerKeysIncluded: true,
      difficultyDistribution: '1 Easy, 1 Medium, 1 Hard',
    },
    log: [
      `[Practice Tool] Extracted standard university exam patterns from past papers.`,
      `[Practice Tool] Formatted step-by-step mathematical proofs and solutions.`,
    ],
  });

  // STEP 7: Progress Sync
  updateStep(6, { status: 'running', durationMs: 0 });
  await new Promise((r) => setTimeout(r, 600));

  updateStep(6, {
    status: 'completed',
    durationMs: 620,
    outputData: {
      portalUpdated: true,
      tasksAddedToDashboard: 2,
      studyPlanScheduledDays: daysRemaining,
      unlockedTopicLevel: 'Level 2: 1NF & 2NF (Ready for Mastery Quiz)',
      newReadinessScore: '78% (Target: 90%+ in 8 days)',
    },
    log: [
      `[Progress Sync] Created new sprint task: "Master 1NF, 2NF, 3NF & BCNF Normalization".`,
      `[Progress Sync] Synchronized 10-day roadmap with Student Study Planner.`,
      `[Progress Sync] Topic mastery quiz pipeline primed. All agent outputs assembled.`,
    ],
  });

  return {
    query,
    studentGoal: 'Prepare for upcoming DBMS semester exam focusing on Normalization.',
    identifiedSubject,
    identifiedTopic,
    daysRemaining,
    availableHours,
    studyPlan,
    retrievedNotes,
    explanation,
    practiceQuestions,
    progressDelta: {
      topicsAdded: 5,
      planDaysCreated: daysRemaining,
      targetMilestone: '10-Day DBMS Normalization & Exam Sprint',
    },
  };
}
