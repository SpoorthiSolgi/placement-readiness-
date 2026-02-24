import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Building2, Briefcase, Sparkles, AlertTriangle } from 'lucide-react';
import { extractSkills, getPresentCategories, isJDTooShort } from '../utils/skillExtractor';
import { calculateReadinessScore } from '../utils/readinessScore';
import { generateChecklist } from '../utils/checklistGenerator';
import { generatePlan } from '../utils/planGenerator';
import { generateQuestions } from '../utils/questionGenerator';
import { saveToHistory } from '../utils/historyStorage';
import { createAnalysisEntry, calculateFinalScore } from '../utils/schema';

function JDAnalyzer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jdText: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    // Validation: JD is required
    if (!formData.jdText.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Extract skills
      const extractedSkills = extractSkills(formData.jdText);
      const categories = getPresentCategories(extractedSkills);

      // Calculate base readiness score (computed only once on analyze)
      const baseScore = calculateReadinessScore({
        company: formData.company,
        role: formData.role,
        jdText: formData.jdText,
        categories
      });

      // Generate outputs
      const checklist = generateChecklist(extractedSkills);
      const plan = generatePlan(extractedSkills);
      const questions = generateQuestions(extractedSkills);

      // Create standardized entry with finalScore = baseScore initially
      const entry = createAnalysisEntry({
        company: formData.company,
        role: formData.role,
        jdText: formData.jdText,
        extractedSkills,
        checklist,
        plan7Days: plan,
        questions,
        baseScore,
        finalScore: baseScore
      });

      // Save to history
      const savedEntry = saveToHistory(entry);

      // Navigate to results with the saved entry ID
      navigate(`/dashboard/results?id=${savedEntry.id}`);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check if JD is too short for meaningful analysis
  const showShortWarning = formData.jdText.length > 0 && formData.jdText.length < 200;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">JD Analyzer</h2>
        <p className="text-gray-600">
          Paste a job description to get a personalized preparation plan, skill analysis, and readiness score.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="e.g., Google, Microsoft, StartupXYZ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer, Full Stack Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="jdText" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Job Description *
            </label>
            <textarea
              id="jdText"
              name="jdText"
              value={formData.jdText}
              onChange={handleInputChange}
              rows={12}
              placeholder="Paste the full job description here. Include requirements, skills, and responsibilities..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-vertical ${
                showShortWarning ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
              }`}
            />
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>{formData.jdText.length} characters</span>
              <span>Minimum 200 characters recommended</span>
            </div>
            
            {/* Short JD Warning */}
            {showShortWarning && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Job Description
              </>
            )}
          </button>
        </form>

        {/* Tips Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips for best results:</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Include the full job description for accurate skill detection</li>
            <li>Mention specific technologies (React, Node.js, SQL, AWS, etc.)</li>
            <li>Add company name and role for a better readiness score</li>
            <li>Longer descriptions (&gt;800 chars) improve analysis accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JDAnalyzer;
