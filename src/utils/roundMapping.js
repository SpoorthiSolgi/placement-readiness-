/**
 * Round Mapping Engine
 * Generates dynamic interview round mapping based on company size and detected skills
 */

/**
 * Generate round mapping based on company size and skills
 * @param {string} companySize - 'Startup' | 'Mid-size' | 'Enterprise'
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {Array} - Array of round objects
 */
export function generateRoundMapping(companySize, extractedSkills) {
  const hasSkill = (category) => {
    const skills = extractedSkills?.[category];
    return Array.isArray(skills) && skills.length > 0;
  };
  
  const hasAnySkill = (categories) => {
    return categories.some(cat => hasSkill(cat));
  };

  // Base rounds by company size
  const roundTemplates = {
    'Enterprise': generateEnterpriseRounds(hasSkill, hasAnySkill),
    'Mid-size': generateMidSizeRounds(hasSkill, hasAnySkill),
    'Startup': generateStartupRounds(hasSkill, hasAnySkill)
  };

  return roundTemplates[companySize] || roundTemplates['Startup'];
}

function generateEnterpriseRounds(hasSkill, hasAnySkill) {
  const rounds = [
    {
      roundNumber: 1,
      title: 'Online Assessment',
      focus: ['Aptitude', 'Logical Reasoning', 'Basic Coding'],
      description: 'Standardized screening test to filter candidates',
      whyItMatters: 'Enterprise companies receive thousands of applications. This round filters candidates based on basic aptitude and problem-solving abilities before investing interviewer time.',
      duration: '60-90 mins',
      difficulty: 'Medium',
      tips: ['Practice timed aptitude questions', 'Focus on accuracy over speed', 'Review basic DSA patterns']
    },
    {
      roundNumber: 2,
      title: 'Technical Round 1: DSA',
      focus: ['Data Structures', 'Algorithms', 'Problem Solving'],
      description: 'Deep dive into DSA with 2-3 coding problems',
      whyItMatters: 'Enterprise products handle massive scale. Strong DSA skills are essential for writing efficient, scalable code that performs under load.',
      duration: '45-60 mins',
      difficulty: 'Medium-Hard',
      tips: ['Master arrays, strings, trees, graphs', 'Practice explaining your approach', 'Optimize for time and space complexity']
    }
  ];

  // Add Core CS round if relevant skills detected
  if (hasAnySkill(['coreCS', 'data'])) {
    rounds.push({
      roundNumber: 3,
      title: 'Technical Round 2: Core CS',
      focus: ['DBMS', 'Operating Systems', 'Computer Networks', 'OOP'],
      description: 'Theoretical and practical CS fundamentals',
      whyItMatters: 'Enterprise systems require deep understanding of computer science fundamentals for designing robust, maintainable systems.',
      duration: '45-60 mins',
      difficulty: 'Medium',
      tips: ['Review OS concepts (processes, memory, scheduling)', 'Practice SQL queries', 'Understand normalization and indexing']
    });
  }

  // Add System Design round for senior roles or if cloud/devops skills
  if (hasAnySkill(['cloud', 'web']) || hasSkill('coreCS')) {
    rounds.push({
      roundNumber: rounds.length + 1,
      title: 'Technical Round 3: System Design',
      focus: ['High-Level Design', 'Scalability', 'Architecture'],
      description: 'Design scalable distributed systems',
      whyItMatters: 'Enterprise engineers build systems serving millions. This round tests your ability to design scalable, reliable, and maintainable architectures.',
      duration: '60 mins',
      difficulty: 'Hard',
      tips: ['Learn design patterns', 'Understand microservices', 'Practice designing URL shortener, chat systems']
    });
  }

  // Add Project/Experience round
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'Technical Round: Projects & Experience',
    focus: ['Past Projects', 'Technical Decisions', 'Problem Solving'],
    description: 'Deep dive into your past work and technical decisions',
    whyItMatters: 'Past performance predicts future success. This round validates your practical experience and ability to apply skills in real-world scenarios.',
    duration: '45-60 mins',
    difficulty: 'Medium',
    tips: ['Prepare 2-3 strong projects', 'Explain your specific contributions', 'Discuss challenges and learnings']
  });

  // HR round
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'HR / Behavioral Round',
    focus: ['Culture Fit', 'Communication', 'Career Goals'],
    description: 'Behavioral questions and company culture alignment',
    whyItMatters: 'Enterprise companies invest heavily in employee development. They look for candidates who align with company values and show long-term potential.',
    duration: '30-45 mins',
    difficulty: 'Low',
    tips: ['Prepare STAR format answers', 'Research company values', 'Prepare thoughtful questions to ask']
  });

  return rounds;
}

function generateMidSizeRounds(hasSkill, hasAnySkill) {
  const rounds = [
    {
      roundNumber: 1,
      title: 'Online Coding Test',
      focus: ['DSA', 'Problem Solving', 'Code Quality'],
      description: '2-3 coding problems with varying difficulty',
      whyItMatters: 'Mid-size companies need engineers who can write production-ready code. This round tests both problem-solving and code quality.',
      duration: '60-90 mins',
      difficulty: 'Medium',
      tips: ['Write clean, readable code', 'Handle edge cases', 'Add comments where necessary']
    },
    {
      roundNumber: 2,
      title: 'Technical Round: DSA + Practical',
      focus: ['Data Structures', 'Algorithms', 'Implementation'],
      description: 'Live coding with discussion on approach',
      whyItMatters: 'Mid-size companies balance theory with practice. This round tests your ability to solve problems and explain your thought process clearly.',
      duration: '60 mins',
      difficulty: 'Medium',
      tips: ['Think aloud while solving', 'Discuss trade-offs', 'Test your code with examples']
    }
  ];

  // Add stack-specific round if web/dev skills detected
  if (hasAnySkill(['web', 'languages', 'cloud'])) {
    rounds.push({
      roundNumber: 3,
      title: 'Technical Round: Stack Deep Dive',
      focus: ['Framework Knowledge', 'Best Practices', 'Real-world Scenarios'],
      description: 'Questions specific to your tech stack',
      whyItMatters: 'Mid-size companies often need immediate contributors. This round validates your expertise in the specific technologies they use.',
      duration: '45-60 mins',
      difficulty: 'Medium',
      tips: ['Review framework-specific concepts', 'Know best practices', 'Be ready to discuss trade-offs']
    });
  }

  // System design basics
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'System Design (Basics)',
    focus: ['API Design', 'Database Schema', 'Basic Architecture'],
    description: 'Design a simple system or API',
    whyItMatters: 'Even mid-size companies need engineers who understand system basics. This round tests your ability to design simple, working systems.',
    duration: '45 mins',
    difficulty: 'Medium',
    tips: ['Start with requirements', 'Think about scalability', 'Discuss trade-offs']
  });

  // Project discussion
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'Project Discussion',
    focus: ['Past Work', 'Technical Decisions', 'Collaboration'],
    description: 'Deep dive into your projects and experience',
    whyItMatters: 'Your past projects demonstrate your ability to deliver. This round validates your practical experience and teamwork skills.',
    duration: '45 mins',
    difficulty: 'Medium',
    tips: ['Choose projects relevant to the role', 'Explain technical decisions', 'Highlight collaboration']
  });

  // Culture/HR round
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'Culture Fit / HR',
    focus: ['Values Alignment', 'Growth Mindset', 'Team Fit'],
    description: 'Behavioral questions and culture alignment',
    whyItMatters: 'Mid-size companies have strong cultures. They look for candidates who will thrive in their environment and grow with the company.',
    duration: '30-45 mins',
    difficulty: 'Low',
    tips: ['Understand company culture', 'Show enthusiasm', 'Ask about growth opportunities']
  });

  return rounds;
}

function generateStartupRounds(hasSkill, hasAnySkill) {
  const rounds = [
    {
      roundNumber: 1,
      title: 'Practical Coding',
      focus: ['Real-world Problems', 'Quick Implementation', 'Code Quality'],
      description: 'Solve practical problems similar to real tasks',
      whyItMatters: 'Startups need engineers who can ship code quickly. This round tests your ability to solve real problems efficiently and write production-ready code.',
      duration: '60-90 mins',
      difficulty: 'Medium',
      tips: ['Focus on working solution first', 'Then optimize if time permits', 'Write clean, maintainable code']
    }
  ];

  // Add tech stack round if specific skills detected
  if (hasAnySkill(['web', 'languages'])) {
    rounds.push({
      roundNumber: 2,
      title: 'Tech Stack Deep Dive',
      focus: ['Framework Expertise', 'Best Practices', 'Problem Solving'],
      description: 'In-depth discussion of your tech stack',
      whyItMatters: 'Startups often use specific tech stacks. This round validates your depth of knowledge and ability to contribute immediately.',
      duration: '45-60 mins',
      difficulty: 'Medium-Hard',
      tips: ['Know your framework inside out', 'Understand internals', 'Be ready to code live']
    });
  }

  // System discussion / architecture
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'System Discussion',
    focus: ['Architecture', 'Trade-offs', 'Scalability'],
      description: 'Discuss system design at a high level',
      whyItItMatters: 'Startups need engineers who can make good architectural decisions. This round tests your system thinking and understanding of trade-offs.',
      duration: '45 mins',
      difficulty: 'Medium',
      tips: ['Think about trade-offs', 'Consider MVP vs scale', 'Discuss technology choices']
    });

  // Product/Problem solving round
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'Product Thinking',
      focus: ['Problem Solving', 'User Focus', 'Business Understanding'],
      description: 'Discuss product problems and solutions',
      whyItMatters: 'Startups value product-minded engineers. This round tests your ability to think beyond code and understand user and business needs.',
      duration: '45 mins',
      difficulty: 'Medium',
      tips: ['Think from user perspective', 'Consider business constraints', 'Propose practical solutions']
    });

  // Culture fit (often with founders in startups)
  rounds.push({
    roundNumber: rounds.length + 1,
    title: 'Culture Fit / Founder Chat',
      focus: ['Values', 'Growth Mindset', 'Ownership'],
      description: 'Discussion with team/founders about fit',
      whyItMatters: 'Startups are small teams where culture fit is crucial. This round assesses if you\'ll thrive in a fast-paced, ambiguous environment.',
      duration: '30-45 mins',
      difficulty: 'Low',
      tips: ['Show passion for the problem', 'Demonstrate ownership mentality', 'Be authentic']
    });

  return rounds;
}

/**
 * Get round type icon
 * @param {string} roundTitle - Round title
 * @returns {string} - Emoji icon
 */
export function getRoundIcon(roundTitle) {
  const icons = {
    'Online Assessment': '📝',
    'Online Coding Test': '💻',
    'Technical Round': '🔧',
    'System Design': '🏗️',
    'Project': '📂',
    'HR': '👥',
    'Culture': '🤝',
    'Practical': '⚡',
    'Product': '💡'
  };
  
  for (const [key, icon] of Object.entries(icons)) {
    if (roundTitle.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return '🎯';
}

/**
 * Get difficulty color
 * @param {string} difficulty - Difficulty level
 * @returns {string} - Tailwind color
 */
export function getDifficultyColor(difficulty) {
  const colors = {
    'Low': 'emerald',
    'Medium': 'amber',
    'Medium-Hard': 'orange',
    'Hard': 'rose'
  };
  return colors[difficulty] || 'gray';
}
