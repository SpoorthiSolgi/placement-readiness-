/**
 * Generate 10 likely interview questions based on detected skills
 * @param {Object} extractedSkills - Skills extracted from JD (standardized format)
 * @returns {string[]} - Array of interview questions
 */
export function generateQuestions(extractedSkills) {
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

  const questions = [];

  // Core CS questions
  if (hasSkill('coreCS', 'DSA')) {
    questions.push('How would you optimize search in a sorted array? Compare linear vs binary search.');
    questions.push('Explain the difference between Array and Linked List. When would you use each?');
  }

  if (hasSkill('coreCS', 'OOP')) {
    questions.push('Explain the four pillars of OOP with real-world examples.');
    questions.push('What is the difference between abstraction and encapsulation?');
  }

  // Database questions
  if (hasSkill('data', 'SQL')) {
    questions.push('Explain indexing in databases. When does it help and when can it hurt performance?');
    questions.push('What is the difference between INNER JOIN and LEFT JOIN?');
    questions.push('Explain database normalization. What are the normal forms?');
  }

  if (hasSkill('data', 'MongoDB')) {
    questions.push('Compare SQL vs NoSQL databases. When would you choose MongoDB over PostgreSQL?');
  }

  // Web development questions
  if (hasSkill('web', 'React')) {
    questions.push('Explain state management options in React. Compare useState, useReducer, Context API, and Redux.');
    questions.push('What are React hooks? Explain useEffect and its dependency array.');
    questions.push('How does React Virtual DOM work? Why is it beneficial?');
  }

  if (hasSkill('web', 'Node.js')) {
    questions.push('Explain the Node.js event loop. How does it handle asynchronous operations?');
    questions.push('What is the difference between CommonJS and ES modules in Node.js?');
  }

  if (hasAny(['web'])) {
    questions.push('Explain REST API principles. What makes an API RESTful?');
    questions.push('What is CORS and how do you handle it in web applications?');
  }

  // Cloud/DevOps questions
  if (hasAny(['cloud'])) {
    questions.push('Explain the difference between Docker and Kubernetes. When would you use each?');
    questions.push('What is CI/CD? Describe a typical pipeline you would set up.');
  }

  if (hasSkill('cloud', 'AWS')) {
    questions.push('Name some AWS services you have used. Explain EC2, S3, and Lambda.');
  }

  // Testing questions
  if (hasAny(['testing'])) {
    questions.push('What is the difference between unit testing and integration testing?');
    questions.push('Explain TDD (Test Driven Development). What are its benefits?');
  }

  // Language-specific questions
  if (hasSkill('languages', 'Java')) {
    questions.push('Explain Java Collections Framework. Compare ArrayList vs LinkedList, HashMap vs TreeMap.');
    questions.push('What is the difference between == and .equals() in Java?');
  }

  if (hasSkill('languages', 'Python')) {
    questions.push('Explain Python decorators. Can you write a simple decorator example?');
    questions.push('What are Python generators? How do they differ from regular functions?');
  }

  if (hasSkill('languages', 'JavaScript') || hasSkill('languages', 'TypeScript')) {
    questions.push('Explain closures in JavaScript. Provide a practical example.');
    questions.push('What is the difference between var, let, and const?');
    questions.push('Explain promises and async/await in JavaScript.');
  }

  // System Design (if senior role indicators)
  if (hasAny(['cloud', 'data']) && questions.length < 8) {
    questions.push('How would you design a URL shortener service?');
    questions.push('Design a rate limiter for an API. What approaches would you consider?');
  }

  // Behavioral/General questions
  questions.push('Tell me about a challenging bug you faced and how you solved it.');
  questions.push('Describe a project you are most proud of. What was your role?');
  questions.push('How do you keep up with new technologies and continue learning?');

  // Ensure we have exactly 10 questions
  const defaultQuestions = [
    'What is your approach to debugging a complex issue?',
    'How do you handle tight deadlines and pressure?',
    'Tell me about a time you had to learn a new technology quickly.',
    'What are your strengths and areas for improvement?',
    'Why do you want to work at our company?',
    'Where do you see yourself in 5 years?',
    'Describe a situation where you had a conflict with a team member.',
    'What motivates you in your work?'
  ];

  while (questions.length < 10) {
    questions.push(defaultQuestions[questions.length - 10 + defaultQuestions.length] || 'Tell me about yourself.');
  }

  return questions.slice(0, 10);
}
