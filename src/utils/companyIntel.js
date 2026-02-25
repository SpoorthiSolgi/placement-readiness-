/**
 * Company Intel Generator
 * Heuristic-based company intelligence for placement preparation
 */

// Known enterprise companies (2000+ employees)
const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook', 'netflix',
  'adobe', 'salesforce', 'oracle', 'ibm', 'intel', 'cisco', 'qualcomm',
  'infosys', 'tcs', 'wipro', 'hcl', 'tech mahindra', 'cognizant', 'accenture',
  'deloitte', 'ey', 'kpmg', 'pwc', 'capgemini', 'ibm', 'sap', 'vmware',
  'dell', 'hp', 'hewlett packard', 'intel', 'nvidia', 'broadcom', 'texas instruments',
  'samsung', 'lg', 'sony', 'panasonic', 'toshiba', 'hitachi', 'fujitsu',
  'toyota', 'honda', 'ford', 'gm', 'general motors', 'bmw', 'mercedes',
  'jpmorgan', 'goldman sachs', 'morgan stanley', 'bank of america', 'wells fargo',
  'citibank', 'hsbc', 'barclays', 'deutsche bank', 'ubs', 'credit suisse'
];

// Known mid-size companies (200-2000 employees)
const MIDSIZE_COMPANIES = [
  'zoho', 'freshworks', 'chargebee', 'postman', 'razorpay', 'zerodha',
  'swiggy', 'zomato', 'ola', 'uber india', 'ola cabs', 'byju\'s', 'unacademy',
  'vedantu', 'whitehat jr', 'phonepe', 'paytm', 'flipkart', 'myntra', 'snapdeal',
  'bigbasket', 'grofers', 'dunzo', 'rapido', 'sharechat', 'moj', 'josh',
  'dailyhunt', 'inshorts', 'lenskart', 'nykaa', 'policybazaar', 'pb fintech'
];

// Industry keywords for inference
const INDUSTRY_KEYWORDS = {
  'Technology Services': ['software', 'it services', 'consulting', 'solutions', 'tech', 'digital'],
  'E-commerce': ['e-commerce', 'online retail', 'marketplace', 'shopping', 'retail'],
  'Fintech': ['fintech', 'payments', 'banking', 'finance', 'insurance', 'lending', 'crypto'],
  'Healthcare': ['healthcare', 'medical', 'pharma', 'biotech', 'hospital', 'clinic'],
  'EdTech': ['education', 'learning', 'edtech', 'training', 'coaching', 'academy'],
  'SaaS': ['saas', 'cloud', 'platform', 'subscription', 'b2b software'],
  'Gaming': ['gaming', 'games', 'esports', 'entertainment'],
  'Automotive': ['automotive', 'car', 'vehicle', 'auto', 'mobility', 'ev'],
  'Logistics': ['logistics', 'supply chain', 'delivery', 'transport', 'shipping'],
  'Food & Beverage': ['food', 'restaurant', 'delivery', 'beverage', 'cloud kitchen']
};

/**
 * Determine company size category based on company name
 * @param {string} companyName - Name of the company
 * @returns {string} - 'Startup' | 'Mid-size' | 'Enterprise'
 */
export function getCompanySize(companyName) {
  if (!companyName || typeof companyName !== 'string') {
    return 'Startup';
  }

  const normalized = companyName.toLowerCase().trim();
  
  // Check enterprise list
  if (ENTERPRISE_COMPANIES.some(company => normalized.includes(company))) {
    return 'Enterprise';
  }
  
  // Check mid-size list
  if (MIDSIZE_COMPANIES.some(company => normalized.includes(company))) {
    return 'Mid-size';
  }
  
  // Default to Startup for unknown companies
  return 'Startup';
}

/**
 * Infer industry based on JD text and company name
 * @param {string} jdText - Job description text
 * @param {string} companyName - Company name
 * @returns {string} - Industry name
 */
export function inferIndustry(jdText, companyName) {
  const text = ((jdText || '') + ' ' + (companyName || '')).toLowerCase();
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return industry;
    }
  }
  
  return 'Technology Services';
}

/**
 * Get hiring focus based on company size
 * @param {string} size - Company size category
 * @returns {Object} - Hiring focus details
 */
export function getHiringFocus(size) {
  const focusMap = {
    'Enterprise': {
      title: 'Structured DSA + Core Fundamentals',
      description: 'Enterprise companies typically prioritize strong computer science fundamentals, data structures, and algorithms. Expect rigorous DSA rounds with emphasis on time/space complexity.',
      keyAreas: ['Data Structures & Algorithms', 'System Design', 'Core CS Fundamentals', 'Problem Solving Patterns'],
      interviewStyle: 'Structured multi-round process with standardized assessments'
    },
    'Mid-size': {
      title: 'Balanced Technical + Practical Skills',
      description: 'Mid-size companies look for a balance of DSA skills and practical implementation. Expect real-world problem solving alongside technical fundamentals.',
      keyAreas: ['DSA (Medium-Hard)', 'Practical Coding', 'System Design (Basics)', 'Project Discussion'],
      interviewStyle: 'Balanced approach with focus on both theory and application'
    },
    'Startup': {
      title: 'Practical Problem Solving + Stack Depth',
      description: 'Startups prioritize hands-on skills, quick learning ability, and depth in relevant tech stack. Expect practical coding and system discussion over theoretical DSA.',
      keyAreas: ['Practical Implementation', 'Tech Stack Depth', 'Product Thinking', 'Rapid Prototyping'],
      interviewStyle: 'Fast-paced, practical rounds with focus on immediate contribution potential'
    }
  };
  
  return focusMap[size] || focusMap['Startup'];
}

/**
 * Generate complete company intel
 * @param {string} companyName - Company name
 * @param {string} jdText - Job description text
 * @returns {Object} - Complete company intelligence
 */
export function generateCompanyIntel(companyName, jdText) {
  const size = getCompanySize(companyName);
  const industry = inferIndustry(jdText, companyName);
  const hiringFocus = getHiringFocus(size);
  
  return {
    companyName: companyName || 'Unknown Company',
    industry,
    size,
    hiringFocus,
    isDemo: true // Flag to indicate heuristic generation
  };
}

/**
 * Get company size emoji/icon indicator
 * @param {string} size - Company size
 * @returns {string} - Emoji representation
 */
export function getSizeIcon(size) {
  const icons = {
    'Startup': '🚀',
    'Mid-size': '🏢',
    'Enterprise': '🏛️'
  };
  return icons[size] || '🏢';
}

/**
 * Get size color for UI
 * @param {string} size - Company size
 * @returns {string} - Tailwind color class
 */
export function getSizeColor(size) {
  const colors = {
    'Startup': 'emerald',
    'Mid-size': 'amber',
    'Enterprise': 'violet'
  };
  return colors[size] || 'gray';
}
