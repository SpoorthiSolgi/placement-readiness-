// Skill categories with keywords for heuristic extraction
const SKILL_CATEGORIES = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Object Oriented', 'Database', 'Operating System', 'Computer Networks']
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin']
  },
  web: {
    label: 'Web Development',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'HTML', 'CSS', 'Angular', 'Vue', 'Svelte', 'Django', 'Flask', 'Spring Boot', 'ASP.NET']
  },
  data: {
    label: 'Data & Databases',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Firebase', 'SQLite', 'Oracle', 'NoSQL']
  },
  cloudDevOps: {
    label: 'Cloud & DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS', 'Nginx', 'Apache']
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Chai', 'Testing Library', 'Postman', 'JMeter', 'Load Testing']
  }
};

// Default skills when none detected
const DEFAULT_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];

/**
 * Extract skills from JD text using keyword matching
 * Returns standardized format for schema compliance
 * @param {string} jdText - Job description text
 * @returns {Object} - Extracted skills in standardized format
 */
export function extractSkills(jdText) {
  const text = (jdText || '').toLowerCase();
  const extractedSkills = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  };
  
  let hasAnySkill = false;

  Object.entries(SKILL_CATEGORIES).forEach(([category, data]) => {
    const foundSkills = [];
    
    data.keywords.forEach(keyword => {
      // Create regex for whole word matching (case-insensitive)
      const regex = new RegExp(`\\b${keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        foundSkills.push(keyword);
        hasAnySkill = true;
      }
    });

    // Map category names to standardized schema
    const categoryMap = {
      coreCS: 'coreCS',
      languages: 'languages',
      web: 'web',
      data: 'data',
      cloudDevOps: 'cloud',
      testing: 'testing'
    };

    const mappedCategory = categoryMap[category];
    if (mappedCategory && foundSkills.length > 0) {
      extractedSkills[mappedCategory] = [...new Set(foundSkills)]; // Remove duplicates
    }
  });

  // If no skills detected, populate 'other' with defaults
  if (!hasAnySkill) {
    extractedSkills.other = [...DEFAULT_SKILLS];
  }

  return extractedSkills;
}

/**
 * Check if JD is too short for meaningful analysis
 * @param {string} jdText - Job description text
 * @returns {boolean}
 */
export function isJDTooShort(jdText) {
  if (!jdText) return true;
  return jdText.trim().length < 200;
}

/**
 * Get flat list of all detected skills
 * @param {Object} extractedSkills - Output from extractSkills (standardized format)
 * @returns {string[]} - Flat array of skill names
 */
export function getAllSkills(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') {
    return [];
  }

  return [
    ...(extractedSkills.coreCS || []),
    ...(extractedSkills.languages || []),
    ...(extractedSkills.web || []),
    ...(extractedSkills.data || []),
    ...(extractedSkills.cloud || []),
    ...(extractedSkills.testing || []),
    ...(extractedSkills.other || [])
  ];
}

/**
 * Get categories present in the extracted skills
 * @param {Object} extractedSkills - Output from extractSkills (standardized format)
 * @returns {string[]} - Array of category keys with non-empty skills
 */
export function getPresentCategories(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') {
    return [];
  }

  return Object.entries(extractedSkills)
    .filter(([_, skills]) => Array.isArray(skills) && skills.length > 0)
    .map(([category]) => category);
}
