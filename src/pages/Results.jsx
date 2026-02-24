import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, Calendar, HelpCircle, Target, Copy, Download, Play, Lightbulb } from 'lucide-react';
import { getHistoryEntry, updateHistoryEntry } from '../utils/historyStorage';
import { getAllSkills } from '../utils/skillExtractor';
import { copyToClipboard, formatPlanAsText, formatChecklistAsText, formatQuestionsAsText, generateFullReport, downloadAsFile } from '../utils/exportUtils';
import CircularProgress from '../components/CircularProgress';

function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({});
  const [adjustedScore, setAdjustedScore] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState('');

  const id = searchParams.get('id');

  // Load analysis data
  useEffect(() => {
    if (!id) {
      navigate('/dashboard/analyze');
      return;
    }

    const entry = getHistoryEntry(id);
    if (entry) {
      setAnalysis(entry);
      // Initialize skill confidence map from saved data or default to 'practice'
      const savedMap = entry.skillConfidenceMap || {};
      setSkillConfidenceMap(savedMap);
      setAdjustedScore(entry.readinessScore);
    } else {
      navigate('/dashboard/history');
    }
    setLoading(false);
  }, [id, navigate]);

  // Calculate adjusted score based on skill confidence
  useEffect(() => {
    if (!analysis) return;
    
    const allSkills = getAllSkills(analysis.extractedSkills);
    let scoreAdjustment = 0;
    
    allSkills.forEach(skill => {
      const confidence = skillConfidenceMap[skill];
      if (confidence === 'know') {
        scoreAdjustment += 2;
      } else if (confidence === 'practice') {
        scoreAdjustment -= 2;
      }
    });
    
    const newScore = Math.max(0, Math.min(100, analysis.readinessScore + scoreAdjustment));
    setAdjustedScore(newScore);
    
    // Save to localStorage
    if (id) {
      updateHistoryEntry(id, {
        skillConfidenceMap,
        adjustedScore: newScore
      });
    }
  }, [skillConfidenceMap, analysis, id]);

  // Toggle skill confidence
  const toggleSkillConfidence = useCallback((skill) => {
    setSkillConfidenceMap(prev => ({
      ...prev,
      [skill]: prev[skill] === 'know' ? 'practice' : 'know'
    }));
  }, []);

  // Get weak skills (marked as 'practice' or not set)
  const weakSkills = useMemo(() => {
    if (!analysis) return [];
    const allSkills = getAllSkills(analysis.extractedSkills);
    return allSkills.filter(skill => skillConfidenceMap[skill] !== 'know').slice(0, 3);
  }, [analysis, skillConfidenceMap]);

  // Export handlers
  const handleCopyPlan = async () => {
    const text = formatPlanAsText(analysis.plan);
    const success = await copyToClipboard(text);
    setCopyFeedback(success ? 'Plan copied!' : 'Failed to copy');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleCopyChecklist = async () => {
    const text = formatChecklistAsText(analysis.checklist);
    const success = await copyToClipboard(text);
    setCopyFeedback(success ? 'Checklist copied!' : 'Failed to copy');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleCopyQuestions = async () => {
    const text = formatQuestionsAsText(analysis.questions);
    const success = await copyToClipboard(text);
    setCopyFeedback(success ? 'Questions copied!' : 'Failed to copy');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleDownloadReport = () => {
    const report = generateFullReport({
      ...analysis,
      readinessScore: adjustedScore,
      skillConfidenceMap
    });
    const filename = `placement-analysis-${analysis.company || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`;
    downloadAsFile(report, filename);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { company, role, extractedSkills, plan, checklist, questions } = analysis;

  // Check if it's a general stack
  const isGeneralStack = extractedSkills.general !== undefined;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analyzer
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Analysis Results
        </h2>
        {company && role && (
          <p className="text-gray-600">
            {company} — {role}
          </p>
        )}
      </div>

      {/* Readiness Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CircularProgress score={adjustedScore} size={180} strokeWidth={10} />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Readiness Assessment</h3>
            <p className="text-gray-600 mb-4">
              Based on the job description analysis, here's how prepared you are for this role.
              Toggle your skill confidence below to update your score in real-time.
            </p>
            <div className="flex flex-wrap gap-2">
              {adjustedScore >= 80 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Well Prepared
                </span>
              )}
              {adjustedScore >= 60 && adjustedScore < 80 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Good Progress
                </span>
              )}
              {adjustedScore < 60 && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  Needs Preparation
                </span>
              )}
            </div>
            {copyFeedback && (
              <p className="mt-2 text-sm text-green-600 font-medium">{copyFeedback}</p>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-600" />
          Key Skills Extracted
          <span className="text-sm font-normal text-gray-500 ml-2">(Click to toggle confidence)</span>
        </h3>
        
        {isGeneralStack ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 font-medium">{extractedSkills.general[0]}</p>
            <p className="text-sm text-gray-500 mt-1">
              No specific technical skills detected. Consider adding more details to the JD.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(extractedSkills).map(([key, category]) => (
              <div key={key}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{category.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    const isKnown = confidence === 'know';
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSkillConfidence(skill)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                          isKnown
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title={isKnown ? 'I know this' : 'Need practice'}
                      >
                        <span className={`w-2 h-2 rounded-full ${isKnown ? 'bg-green-500' : 'bg-amber-500'}`} />
                        {skill}
                        <span className="text-xs opacity-75 ml-1">
                          {isKnown ? '✓' : '○'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7-Day Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          7-Day Preparation Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plan.map((day) => (
            <div key={day.day} id={`day-${day.day}`} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Day {day.day}: {day.title}
              </h4>
              <ul className="space-y-1">
                {day.tasks.slice(0, 3).map((task, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <span className="line-clamp-2">{task}</span>
                  </li>
                ))}
                {day.tasks.length > 3 && (
                  <li className="text-sm text-gray-400">+{day.tasks.length - 3} more tasks</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Round-wise Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary-600" />
          Round-wise Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(checklist).map(([key, round]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">{round.title}</h4>
              <ul className="space-y-2">
                {round.items.slice(0, 5).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <input type="checkbox" className="mt-1 rounded text-primary-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Questions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          Likely Interview Questions
        </h3>
        <div className="space-y-3">
          {questions.map((question, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                {idx + 1}
              </span>
              <p className="text-gray-700">{question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-600" />
          Export Tools
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyPlan}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy 7-Day Plan
          </button>
          <button
            onClick={handleCopyChecklist}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Checklist
          </button>
          <button
            onClick={handleCopyQuestions}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy 10 Questions
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download as TXT
          </button>
        </div>
      </div>

      {/* Action Next Box */}
      {!isGeneralStack && weakSkills.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Action Next</h3>
              <p className="text-gray-600 mb-3">
                Focus on these top {weakSkills.length} skills marked for practice:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                onClick={() => document.getElementById('day-1')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Day 1 plan now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
