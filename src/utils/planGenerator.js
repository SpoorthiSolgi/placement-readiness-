/**
 * Generate 7-day preparation plan based on detected skills
 * @param {Object} extractedSkills - Skills extracted from JD (standardized format)
 * @returns {Array} - 7-day plan with daily tasks
 */
export function generatePlan(extractedSkills) {
  const hasSkill = (category, keyword) => {
    const skills = extractedSkills?.[category];
    if (!Array.isArray(skills)) return false;
    return skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
  };

  const hasAny = (categories) => {
    return categories.some(cat => {
      const skills = extractedSkills?.[cat];
      return Array.isArray(skills) && skills.length > 0;
    });
  };

  const plan = [
    {
      day: 1,
      focus: 'Basics + Core CS',
      tasks: [
        'Review fundamental data structures (Arrays, Linked Lists)',
        'Study OOP concepts and principles',
        'Practice 5 easy coding problems',
        'Review time and space complexity analysis'
      ]
    },
    {
      day: 2,
      focus: 'Core CS Continued',
      tasks: [
        'Study DBMS fundamentals',
        'Practice SQL queries (basic to intermediate)',
        'Review OS concepts (processes, threads, memory)',
        'Solve 3 medium difficulty problems'
      ]
    },
    {
      day: 3,
      focus: 'DSA + Coding Practice',
      tasks: [
        'Focus on Trees and Graphs',
        'Practice recursion and backtracking',
        'Solve 5 medium difficulty problems',
        'Review sorting and searching algorithms'
      ]
    },
    {
      day: 4,
      focus: 'Advanced DSA',
      tasks: [
        'Study Dynamic Programming patterns',
        'Practice greedy algorithms',
        'Solve 4 hard difficulty problems',
        'Review graph algorithms (BFS, DFS, Dijkstra)'
      ]
    },
    {
      day: 5,
      focus: 'Project + Resume Alignment',
      tasks: [
        'Review and update resume',
        'Prepare project explanations',
        'Practice explaining architecture decisions',
        'Align projects with JD requirements'
      ]
    },
    {
      day: 6,
      focus: 'Mock Interview Questions',
      tasks: [
        'Practice technical interview questions',
        'Conduct mock coding interview',
        'Review system design basics',
        'Prepare behavioral question answers'
      ]
    },
    {
      day: 7,
      focus: 'Revision + Weak Areas',
      tasks: [
        'Review all weak areas identified during the week',
        'Practice company-specific questions',
        'Final revision of core concepts',
        'Relax and prepare mentally for interview'
      ]
    }
  ];

  // Adapt plan based on detected skills
  if (hasSkill('web', 'React')) {
    plan[4].tasks.push('Review React concepts: hooks, context, performance optimization');
    plan[5].tasks.push('Practice React-specific interview questions');
  }

  if (hasSkill('web', 'Node.js')) {
    plan[4].tasks.push('Review Node.js and Express.js fundamentals');
    plan[5].tasks.push('Practice backend architecture questions');
  }

  if (hasSkill('data', 'SQL')) {
    plan[1].tasks.push('Advanced SQL: window functions, CTEs, query optimization');
    plan[4].tasks.push('Database design practice for your projects');
  }

  if (hasAny(['cloud'])) {
    plan[4].tasks.push('Review cloud services and deployment strategies');
    plan[5].tasks.push('Practice DevOps and CI/CD questions');
  }

  if (hasAny(['testing'])) {
    plan[4].tasks.push('Review testing strategies and frameworks');
    plan[5].tasks.push('Practice writing test cases for your code');
  }

  if (hasSkill('languages', 'Java')) {
    plan[2].tasks.push('Review Java-specific: Collections, Multithreading, JVM');
  }

  if (hasSkill('languages', 'Python')) {
    plan[2].tasks.push('Review Python-specific: List comprehensions, decorators, generators');
  }

  return plan;
}
