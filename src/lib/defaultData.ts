import { Problem, WeekPlan, MockInterview, StarStory, KnowledgeItem } from './types';

export const DEFAULT_WEEKS: WeekPlan[] = [
  {
    week: 1, phase: 'Ninja', focus: 'Aptitude Core & Foundation',
    tasks: [
      { id: 'w1t1', label: 'Quant: Number System & Divisibility Rules (High Weight)', done: false },
      { id: 'w1t2', label: 'Quant: Percentages, Profit & Loss Basics', done: false },
      { id: 'w1t3', label: 'Logical: Blood Relations & Direction Sense', done: false },
      { id: 'w1t4', label: 'DSA: Master Basic Syntax, Loops, and If-Else patterns', done: false },
      { id: 'w1t5', label: 'Mock: TCS NQT Cognitive Section Baseline Test', done: false },
    ],
  },
  {
    week: 2, phase: 'Ninja', focus: 'Time, Speed, Work & String Basics',
    tasks: [
      { id: 'w2t1', label: 'Quant: Time & Work, Pipes & Cisterns', done: false },
      { id: 'w2t2', label: 'Quant: Time Speed Distance, Relative Speed (Trains)', done: false },
      { id: 'w2t3', label: 'Logical: Seating Arrangement (Linear & Circular)', done: false },
      { id: 'w2t4', label: 'DSA Strings: Palindrome, Vowel Count, Reverse logic', done: false },
      { id: 'w2t5', label: 'Mock: 30-Min High Intensity Aptitude Drill', done: false },
    ],
  },
  {
    week: 3, phase: 'Ninja', focus: 'Aptitude Mastery & Basic Arrays',
    tasks: [
      { id: 'w3t1', label: 'Quant: Ratio & Proportion, Mixtures & Alligations', done: false },
      { id: 'w3t2', label: 'Verbal: Reading Comprehension Techniques', done: false },
      { id: 'w3t3', label: 'Logical: Syllogisms & Venn Diagrams', done: false },
      { id: 'w3t4', label: 'DSA Arrays: Max/Min, 2nd Largest, Simple Two Pointers', done: false },
      { id: 'w3t5', label: 'Mock: NQT Format Test (Verbal + Logical + Quant)', done: false },
    ],
  },
  {
    week: 4, phase: 'Ninja', focus: 'TCS Coding Foundation',
    tasks: [
      { id: 'w4t1', label: 'DSA Math: GCD, LCM, Prime checks (CodeVita basics)', done: false },
      { id: 'w4t2', label: 'CS Core: OOPs concepts (Inheritance, Polymorphism)', done: false },
      { id: 'w4t3', label: 'Verbal: Sentence Completion & Error Spotting', done: false },
      { id: 'w4t4', label: 'HR Prep: Draft "Tell me about yourself" (1 min pitch)', done: false },
      { id: 'w4t5', label: 'Mock: Full TCS Ninja Integrated Test 1', done: false },
    ],
  },
  {
    week: 5, phase: 'Digital', focus: 'Advanced Arrays & Hashing',
    tasks: [
      { id: 'w5t1', label: 'DSA Arrays: Kadane\'s Algorithm (Max Subarray)', done: false },
      { id: 'w5t2', label: 'DSA Arrays: Merge Intervals & Sliding Window Basics', done: false },
      { id: 'w5t3', label: 'Logical: Advanced Puzzles & Number Series', done: false },
      { id: 'w5t4', label: 'CS Core: DBMS basics (ACID, Normalization, Keys)', done: false },
      { id: 'w5t5', label: 'Mock Code: 2 Medium Problems (TCS Digital focus)', done: false },
    ],
  },
  {
    week: 6, phase: 'Digital', focus: 'Hashing, Searching & SQL',
    tasks: [
      { id: 'w6t1', label: 'DSA Hashing: Two Sum, Frequency Maps, Group Anagrams', done: false },
      { id: 'w6t2', label: 'DSA Search: Binary Search & Lower/Upper Bounds', done: false },
      { id: 'w6t3', label: 'CS Core: SQL Queries (JOINs, Group By, Subqueries)', done: false },
      { id: 'w6t4', label: 'Quant: Advanced Probability & Permutations', done: false },
      { id: 'w6t5', label: 'Mock: DBMS & SQL Technical Interview simulation', done: false },
    ],
  },
  {
    week: 7, phase: 'Digital', focus: 'Stacks, Queues & Linked Lists',
    tasks: [
      { id: 'w7t1', label: 'DSA Stack: Valid Parentheses, Next Greater Element', done: false },
      { id: 'w7t2', label: 'DSA Linked List: Reverse, Detect Cycle, Middle', done: false },
      { id: 'w7t3', label: 'CS Core: Operating Systems (Threads, Deadlocks)', done: false },
      { id: 'w7t4', label: 'HR Prep: Draft 3 STAR Stories (Leadership, Conflict)', done: false },
      { id: 'w7t5', label: 'Mock Test: TCS Digital Specific Technical MCQ + Code', done: false },
    ],
  },
  {
    week: 8, phase: 'Digital', focus: 'Recursion & Advanced Algorithms',
    tasks: [
      { id: 'w8t1', label: 'DSA Recursion: Subsets, Permutations, Combinations', done: false },
      { id: 'w8t2', label: 'DSA Greedy: Activity Selection, Fractional Knapsack', done: false },
      { id: 'w8t3', label: 'CS Core: Computer Networks (OSI Model, TCP/UDP)', done: false },
      { id: 'w8t4', label: 'Resume Review: Tailor technical skills strictly for Digital', done: false },
      { id: 'w8t5', label: 'Mock: Peer Interview covering OS & CN + 1 Medium code', done: false },
    ],
  },
  {
    week: 9, phase: 'Prime', focus: 'Dynamic Programming Foundations',
    tasks: [
      { id: 'w9t1', label: 'DSA DP: Climbing Stairs, Coin Change (Memoization)', done: false },
      { id: 'w9t2', label: 'DSA DP: Longest Common Subsequence, 0/1 Knapsack', done: false },
      { id: 'w9t3', label: 'System Design: REST vs SOAP basics', done: false },
      { id: 'w9t4', label: 'Mock Code: 90 Min Hard DP Problem (TCS Prime level)', done: false },
      { id: 'w9t5', label: 'HR Prep: "Why TCS Prime?", "Future Goals" alignment', done: false },
    ],
  },
  {
    week: 10, phase: 'Prime', focus: 'Trees & Advanced Graphs',
    tasks: [
      { id: 'w10t1', label: 'DSA Trees: Traversals, LCA, Validate BST', done: false },
      { id: 'w10t2', label: 'DSA Graphs: BFS/DFS Traversals, Number of Islands', done: false },
      { id: 'w10t3', label: 'DSA Graphs: Dijkstra\'s shortest path (Crucial for Prime)', done: false },
      { id: 'w10t4', label: 'CS Core: Advanced DBMS (Indexing, B-Trees)', done: false },
      { id: 'w10t5', label: 'Mock Code: CodeVita Quality Graph Traversal Problem', done: false },
    ],
  },
  {
    week: 11, phase: 'Prime', focus: 'System Design & Revision',
    tasks: [
      { id: 'w11t1', label: 'System Architecture: Microservices, Load Balancing basics', done: false },
      { id: 'w11t2', label: 'Revision: Flush all "Revisit" marked DSA Kill List items', done: false },
      { id: 'w11t3', label: 'Revision: Re-calculate high-weight NQT Quant formulas', done: false },
      { id: 'w11t4', label: 'Mock: Technical Interview focusing on Project Architecture', done: false },
      { id: 'w11t5', label: 'Mock Test: Final TCS Prime Full-Length Pattern Test', done: false },
    ],
  },
  {
    week: 12, phase: 'Prime', focus: 'The Final Polish',
    tasks: [
      { id: 'w12t1', label: 'Review all Mock Test feedback & patch weak areas', done: false },
      { id: 'w12t2', label: 'Behavioral: Record yourself answering situational TR questions', done: false },
      { id: 'w12t3', label: 'Technical: Re-read CS core subjects flashcards/SQL queries', done: false },
      { id: 'w12t4', label: 'Final Sanity Check: Resume, ID docs, Interview environment', done: false },
      { id: 'w12t5', label: 'Mock: The Ultimate Full-Length Mock Interview (HR + TR + MR)', done: false },
    ],
  },
];



export const DEFAULT_MOCKS: MockInterview[] = [
  { id: 'm1', type: 'TCS NQT Aptitude Pattern', score: 42, maxScore: 60, date: '2026-01-20', feedback: 'Good logic, slow on quant. Memorize percentage/fraction tables.' },
];

export const DEFAULT_STARS: StarStory[] = [
  {
    id: 's1',
    tag: 'Leadership',
    situation: 'During our final year project, our team leader fell sick 2 weeks before the deadline, leaving the frontend integration unfinished.',
    task: 'As a backend developer, I needed to ensure the project was completed on time without compromising functionality.',
    action: 'I stepped up to coordinate the remaining team, learned basic React in 2 days, and led pair-programming sessions to finish the integrations.',
    result: 'We successfully deployed on time and received an "A" grade. I learned adaptability and cross-functional leadership.',
  },
];

export const DEFAULT_KNOWLEDGE: KnowledgeItem[] = [
  // --- CORE CS: OOPs ---
  { id: 'k1', category: 'Core CS', question: 'What are the 4 pillars of OOPs?', answer: '1. Encapsulation: Wrapping data and methods into a single class.\n2. Abstraction: Hiding internal details and showing only functionality.\n3. Inheritance: Adopting properties/methods from a parent class.\n4. Polymorphism: Same entity behaving differently based on context (Method Overloading/Overriding).' },
  { id: 'k2', category: 'Core CS', question: 'Difference between Abstract Class and Interface (Java)?', answer: 'Abstract Class: Can have both abstract and concrete methods. Can have instance variables. A class can extend only one abstract class.\nInterface: Only abstract methods (until Java 8). Cannot have instance variables (only static final). A class can implement multiple interfaces.' },
  
  // --- CORE CS: DBMS ---
  { id: 'k3', category: 'Core CS', question: 'What are ACID properties?', answer: 'Atomicity: Entire transaction takes place at once or doesn\'t happen at all.\nConsistency: Database must be consistent before and after transaction.\nIsolation: Multiple transactions occur independently without interference.\nDurability: Changes of a successful transaction are permanent even after system failure.' },
  { id: 'k4', category: 'Core CS', question: 'Explain SQL Joins.', answer: 'Inner Join: Returns records with matching values in both tables.\nLeft Join: Returns all records from left table, and matched records from right.\nRight Join: Returns all records from right table, and matched from left.\nFull Outer: Returns all records when there is a match in either left or right.' },
  { id: 'k5', category: 'Core CS', question: 'What is Normalization?', answer: 'Process of organizing data to minimize redundancy. 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), BCNF (stricter 3NF).' },

  // --- CORE CS: OS ---
  { id: 'k6', category: 'Core CS', question: 'Process vs Thread?', answer: 'Process: Program in execution. Heavyweight, isolated memory space, higher context switching overhead.\nThread: Segment of a process. Lightweight, shares memory with other threads in the same process, faster context switching.' },
  { id: 'k7', category: 'Core CS', question: 'What is a Deadlock? Give the 4 necessary conditions.', answer: 'A situation where a set of processes are blocked because each is holding a resource and waiting for another resource acquired by another process.\nConditions (Coffman):\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait' },

  // --- CORE CS: Computer Networks ---
  { id: 'k8', category: 'Core CS', question: 'TCP vs UDP?', answer: 'TCP (Transmission Control Protocol): Connection-oriented, reliable, guarantees delivery (acknowledgments), slower. Used in HTTP, FTP, Email.\nUDP (User Datagram Protocol): Connectionless, unreliable (no acks), faster. Used in Video streaming, Gaming, DNS.' },
  { id: 'k9', category: 'Core CS', question: 'Explain the OSI Model layers.', answer: '7. Application (HTTP/FTP)\n6. Presentation (Encryption/Data format)\n5. Session (Sync/Ports)\n4. Transport (TCP/UDP, Segments)\n3. Network (IP, Routers, Packets)\n2. Data Link (MAC, Switches, Frames)\n1. Physical (Cables, Bits)' },

  // --- APTITUDE TRICKS ---
  { id: 'k10', category: 'Aptitude', question: 'Time & Work Shortcut: Two people working together', answer: 'If A can do work in X days and B can do it in Y days:\nTogether they take: (X * Y) / (X + Y) days.' },
  { id: 'k11', category: 'Aptitude', question: 'Speed & Distance Shortcut: Average Speed', answer: 'If a person covers a distance at speed X and returns at speed Y:\nAverage speed = (2 * X * Y) / (X + Y)\nNote: Not just (X+Y)/2!' },
  { id: 'k12', category: 'Aptitude', question: 'Percentage Shortcut: A is x% more than B', answer: 'If A is x% more than B, then B is less than A by: [x / (100 + x)] * 100 %\nIf A is x% less than B, then B is more than A by: [x / (100 - x)] * 100 %' },

  // --- HR INTERVIEW ---
  { id: 'k13', category: 'HR', question: 'Tell me about yourself (Framework)', answer: '1. Present: Current status (Branch, College, CGPA).\n2. Past: Relevant projects/internships and the tech stack used.\n3. Alignment: Why your skills align with TCS (mentioning specific interests like Cloud or full-stack).\nKeep it under 90 seconds.' },
  { id: 'k14', category: 'HR', question: 'Why TCS?', answer: 'TCS offers an unmatched learning ecosystem through initial training (TCS iON/Ignite) and diverse projects across domains. I value job stability, global exposure, and a structured career progression path. (Add a reference to a recent TCS achievement to stand out).' },
  { id: 'k15', category: 'HR', question: 'Where do you see yourself in 3-5 years?', answer: 'In the short term, I want to become a fundamentally strong full-stack developer contributing to enterprise applications. Within 3-5 years, I see myself taking on architectural responsibilities and mentoring junior team members within TCS.' },
];

export const HABIT_TEMPLATES = [
  { id: 'h1', label: '🧠 Revise 1 Core CS Topic (OS/DBMS)', category: 'theory' },
  { id: 'h2', label: '💻 Solve 2 TCS specific DSA questions', category: 'coding' },
  { id: 'h3', label: '📝 Practice 1 STAR answer aloud', category: 'hr' },
  { id: 'h4', label: '📊 Solve 10 Aptitude questions (Timed)', category: 'aptitude' },
  { id: 'h5', label: '🔍 Update DSA tracker notes', category: 'review' },
];

export const QUOTES = [
  { text: "TCS tests accuracy and speed, not just complex logic. Master the basics.", author: "PlacePrep Strategy" },
  { text: "CodeVita is a marathon. Start with the easiest 2 questions quickly.", author: "Digital Target" },
  { text: "Aptitude clears the first round. DSA clears the second. HR clears the final. Don't neglect any.", author: "Placement Fact" },
  { text: "Consistency > Cramming. 2 coding problems a day beats 14 on Sunday.", author: "Developer Wisdom" },
];
