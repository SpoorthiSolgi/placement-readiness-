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

/**
 * Extract skills from JD text using keyword matching
 * @param {string} jdText - Job description text
 * @returns {Object} - Extracted skills grouped by category
 */
export function extractSkills(jdText) {
  if (!jdText || jdText.trim().length === 0) {
    return { general: ['General fresher stack'] };
  }

  const text = jdText.toLowerCase();
  const extractedSkills = {};
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

    if (foundSkills.length > 0) {
      extractedSkills[category] = {
        label: data.label,
        skills: [...new Set(foundSkills)] // Remove duplicates
      };
    }
  });

  // If no skills detected, return general stack
  if (!hasAnySkill) {
    return { general: ['General fresher stack'] };
  }

  return extractedSkills;
}

/**
 * Get flat list of all detected skills
 * @param {Object} extractedSkills - Output from extractSkills
 * @returns {string[]} - Flat array of skill names
 */
export function getAllSkills(extractedSkills) {
  if (extractedSkills.general) {
    return extractedSkills.general;
  }

  const allSkills = [];
  Object.values(extractedSkills).forEach(category => {
    if (category.skills) {
      allSkills.push(...category.skills);
    }
  });
  return allSkills;
}

/**
 * Get categories present in the extracted skills
 * @param {Object} extractedSkills - Output from extractSkills
 * @returns {string[]} - Array of category keys
 */
export function getPresentCategories(extractedSkills) {
  if (extractedSkills.general) {
    return [];
  }
  return Object.keys(extractedSkills);
}
