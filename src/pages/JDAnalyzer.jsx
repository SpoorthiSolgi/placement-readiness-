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
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Analysis
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Job Description <span className="text-gradient">Analyzer</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Paste any job description and our AI will extract key skills, generate a personalized 
          7-day preparation plan, and calculate your readiness score.
        </p>
      </div>

      <div className="card-premium p-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Company & Role Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2 text-violet-500" />
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Google, Microsoft"
                className="input-premium"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2 text-violet-500" />
                Job Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer"
                className="input-premium"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="jdText" className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2 text-violet-500" />
              Job Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="jdText"
                name="jdText"
                value={formData.jdText}
                onChange={handleInputChange}
                rows={10}
                placeholder="Paste the full job description here. Include requirements, skills, responsibilities, and qualifications..."
                className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 resize-none ${
                  showShortWarning 
                    ? 'border-amber-300 bg-amber-50/50 focus:border-amber-400 focus:bg-white' 
                    : 'border-gray-200 bg-gray-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10'
                }`}
              />
              {/* Character Counter */}
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-400 border border-gray-100">
                {formData.jdText.length} chars
              </div>
            </div>
            
            {/* Short JD Warning */}
            {showShortWarning && (
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Job description is too short
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    For best results, paste the complete job description (200+ characters).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing with AI...
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
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            Tips for best results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-600 font-bold text-sm">1</span>
              </div>
              <p className="text-sm text-gray-600">Include the full job description for accurate skill detection</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-600 font-bold text-sm">2</span>
              </div>
              <p className="text-sm text-gray-600">Mention specific technologies (React, Node.js, SQL, AWS)</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-600 font-bold text-sm">3</span>
              </div>
              <p className="text-sm text-gray-600">Add company name and role for better readiness scoring</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-600 font-bold text-sm">4</span>
              </div>
              <p className="text-sm text-gray-600">Longer descriptions (&gt;800 chars) improve analysis accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JDAnalyzer;
