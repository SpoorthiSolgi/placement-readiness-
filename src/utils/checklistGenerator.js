/**
 * Generate round-wise checklist based on detected skills
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {Object} - Checklist for each round
 */
export function generateChecklist(extractedSkills) {
  const hasSkill = (category, keyword) => {
    if (extractedSkills.general) return false;
    const cat = extractedSkills[category];
    if (!cat || !cat.skills) return false;
    return cat.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
  };

  const hasAny = (categories) => {
    if (extractedSkills.general) return false;
    return categories.some(cat => extractedSkills[cat] && extractedSkills[cat].skills?.length > 0);
  };

  // Round 1: Aptitude / Basics
  const round1 = [
    'Practice quantitative aptitude problems',
    'Review logical reasoning concepts',
    'Solve verbal ability questions',
    'Complete 2 full-length mock tests',
    'Time management practice (30 min tests)',
    'Review basic grammar and comprehension',
    'Practice data interpretation',
    'Work on puzzle-solving speed'
  ];

  // Round 2: DSA + Core CS
  const round2 = [
    'Review Arrays and Strings (basic to advanced)',
    'Practice Linked List operations',
    'Master Stack and Queue implementations',
    'Study Tree and Graph traversals',
    'Understand Sorting and Searching algorithms',
    'Practice Dynamic Programming patterns',
    'Review OOP concepts and principles',
    'Study DBMS fundamentals and SQL queries'
  ];

  // Add specific items based on detected skills
  if (hasSkill('coreCS', 'OS')) {
    round2.push('Review Operating System concepts (processes, memory, scheduling)');
  }
  if (hasSkill('coreCS', 'Networks')) {
    round2.push('Study Computer Networks (OSI model, TCP/IP, HTTP)');
  }

  // Round 3: Tech interview (projects + stack)
  const round3 = [
    'Prepare project explanations (architecture, challenges, learnings)',
    'Review your strongest project in detail',
    'Practice explaining code from your GitHub',
    'Prepare answers for "Tell me about yourself"',
    'Research company tech stack alignment'
  ];

  // Add stack-specific items
  if (hasAny(['web', 'languages'])) {
    round3.push('Review framework-specific concepts and best practices');
    round3.push('Prepare for live coding session');
  }
  if (hasSkill('web', 'React')) {
    round3.push('Study React hooks, state management, and component lifecycle');
    round3.push('Practice React optimization techniques');
  }
  if (hasSkill('web', 'Node.js')) {
    round3.push('Review Node.js event loop, async programming, and Express.js');
  }
  if (hasAny(['data'])) {
    round3.push('Practice database design and query optimization');
    round3.push('Review indexing, normalization, and transactions');
  }
  if (hasSkill('data', 'SQL')) {
    round3.push('Master complex SQL queries (joins, subqueries, window functions)');
  }
  if (hasAny(['cloudDevOps'])) {
    round3.push('Understand cloud services and deployment strategies');
    round3.push('Review CI/CD pipelines and containerization');
  }
  if (hasAny(['testing'])) {
    round3.push('Study testing methodologies and write test cases');
  }

  // Round 4: Managerial / HR
  const round4 = [
    'Prepare STAR format answers for behavioral questions',
    'Research company culture, values, and recent news',
    'Prepare questions to ask the interviewer',
    'Practice salary negotiation talking points',
    'Review your resume thoroughly',
    'Prepare "Why this company?" answer',
    'Prepare "Where do you see yourself in 5 years?"',
    'Practice confidence and communication skills'
  ];

  return {
    round1: { title: 'Round 1: Aptitude / Basics', items: round1 },
    round2: { title: 'Round 2: DSA + Core CS', items: round2 },
    round3: { title: 'Round 3: Technical Interview', items: round3 },
    round4: { title: 'Round 4: Managerial / HR', items: round4 }
  };
}
