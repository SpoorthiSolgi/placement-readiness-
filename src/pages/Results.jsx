import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, Calendar, HelpCircle, Target, Copy, Download, Play, Lightbulb } from 'lucide-react';
import { getHistoryEntry, updateHistoryEntry } from '../utils/historyStorage';
import { getAllSkills } from '../utils/skillExtractor';
import { copyToClipboard, formatPlanAsText, formatChecklistAsText, formatQuestionsAsText, generateFullReport, downloadAsFile } from '../utils/exportUtils';
import { calculateFinalScore, getAllSkillsFromStructure } from '../utils/schema';
import CircularProgress from '../components/CircularProgress';
import CompanyIntelCard from '../components/CompanyIntelCard';
import RoundMappingTimeline from '../components/RoundMappingTimeline';

function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({});
  const [finalScore, setFinalScore] = useState(0);
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
      // Use finalScore if available, otherwise use baseScore
      setFinalScore(entry.finalScore ?? entry.baseScore ?? 0);
    } else {
      navigate('/dashboard/history');
    }
    setLoading(false);
  }, [id, navigate]);

  // Calculate final score based on skill confidence (only changes from toggles)
  useEffect(() => {
    if (!analysis) return;
    
    // Calculate new final score based on baseScore and confidence map
    const newFinalScore = calculateFinalScore(analysis.baseScore, skillConfidenceMap);
    setFinalScore(newFinalScore);
    
    // Persist to localStorage with updatedAt timestamp
    if (id) {
      updateHistoryEntry(id, {
        skillConfidenceMap,
        finalScore: newFinalScore,
        updatedAt: new Date().toISOString()
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
    const allSkills = getAllSkillsFromStructure(analysis.extractedSkills);
    return allSkills.filter(skill => skillConfidenceMap[skill] !== 'know').slice(0, 3);
  }, [analysis, skillConfidenceMap]);

  // Export handlers
  const handleCopyPlan = async () => {
    const text = formatPlanAsText(analysis.plan7Days);
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
      finalScore,
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

  const { company, role, extractedSkills, companyIntel, roundMapping, plan7Days, checklist, questions } = analysis;

  // Check if using default skills (other category has defaults)
  const hasDefaultSkills = extractedSkills?.other?.some(skill => 
    ['Communication', 'Problem solving', 'Basic coding', 'Projects'].includes(skill)
  );

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

      {/* Company Intel Card - Only show if company name provided */}
      {companyIntel && company && (
        <div className="mb-6">
          <CompanyIntelCard companyIntel={companyIntel} />
        </div>
      )}

      {/* Readiness Score */}
      <div className="card-premium p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CircularProgress score={finalScore} size={180} strokeWidth={12} />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Readiness Assessment</h3>
            <p className="text-gray-600 mb-4">
              Based on the job description analysis, here's how prepared you are for this role.
              Toggle your skill confidence below to update your score in real-time.
            </p>
            <div className="flex flex-wrap gap-2">
              {finalScore >= 80 && (
                <span className="badge-success">
                  Well Prepared
                </span>
              )}
              {finalScore >= 60 && finalScore < 80 && (
                <span className="badge-info">
                  Good Progress
                </span>
              )}
              {finalScore < 60 && (
                <span className="badge-warning">
                  Needs Preparation
                </span>
              )}
            </div>
            {copyFeedback && (
              <p className="mt-2 text-sm text-emerald-600 font-medium">{copyFeedback}</p>
            )}
          </div>
        </div>
      </div>

      {/* Round Mapping Timeline */}
      {roundMapping && roundMapping.length > 0 && (
        <div className="mb-6">
          <RoundMappingTimeline rounds={roundMapping} />
        </div>
      )}

      {/* Extracted Skills */}
      <div className="card-premium p-6 mb-6">
        <h3 className="section-title mb-4">
          <Target className="w-6 h-6 text-violet-500" />
          Key Skills Extracted
          <span className="text-sm font-normal text-gray-500 ml-2">(Click to toggle confidence)</span>
        </h3>
        
        {hasDefaultSkills ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 font-medium">Default skills applied</p>
            <p className="text-sm text-amber-700 mt-1">
              No specific technical skills detected in the JD. Using general preparation skills.
              Consider pasting a more detailed job description for better analysis.
            </p>
          </div>
        ) : null}
        
        <div className="space-y-4 mt-4">
          {Object.entries(extractedSkills).map(([key, skills]) => {
            if (!Array.isArray(skills) || skills.length === 0) return null;
            
            const categoryLabels = {
              coreCS: 'Core Computer Science',
              languages: 'Programming Languages',
              web: 'Web Development',
              data: 'Data & Databases',
              cloud: 'Cloud & DevOps',
              testing: 'Testing',
              other: 'Other Skills'
            };
            
            return (
              <div key={key}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{categoryLabels[key] || key}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    const isKnown = confidence === 'know';
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSkillConfidence(skill)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                          isKnown
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        }`}
                        title={isKnown ? 'I know this' : 'Need practice'}
                      >
                        <span className={`w-2 h-2 rounded-full ${isKnown ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {skill}
                        <span className="text-xs opacity-75">
                          {isKnown ? '✓' : '○'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Plan */}
      <div className="card-premium p-6 mb-6">
        <h3 className="section-title mb-4">
          <Calendar className="w-6 h-6 text-violet-500" />
          7-Day Preparation Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plan7Days?.map((day) => (
            <div key={day.day} id={`day-${day.day}`} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
                  {day.day}
                </span>
                <h4 className="font-semibold text-gray-900">{day.focus}</h4>
              </div>
              <ul className="space-y-2">
                {day.tasks?.slice(0, 3).map((task, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                    <span className="line-clamp-2">{task}</span>
                  </li>
                ))}
                {day.tasks?.length > 3 && (
                  <li className="text-sm text-violet-600 font-medium">+{day.tasks.length - 3} more tasks</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Round-wise Checklist */}
      <div className="card-premium p-6 mb-6">
        <h3 className="section-title mb-4">
          <CheckCircle className="w-6 h-6 text-violet-500" />
          Round-wise Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(checklist) && checklist.map((round, idx) => (
            <div key={idx} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                {round.roundTitle}
              </h4>
              <ul className="space-y-3">
                {round.items?.slice(0, 5).map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm text-gray-600 flex items-start gap-3">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Questions */}
      <div className="card-premium p-6 mb-6">
        <h3 className="section-title mb-4">
          <HelpCircle className="w-6 h-6 text-violet-500" />
          Likely Interview Questions
        </h3>
        <div className="space-y-3">
          {questions.map((question, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-100 flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Tools */}
      <div className="card-premium p-6 mb-6">
        <h3 className="section-title mb-4">
          <Download className="w-6 h-6 text-violet-500" />
          Export Tools
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyPlan}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy 7-Day Plan
          </button>
          <button
            onClick={handleCopyChecklist}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Checklist
          </button>
          <button
            onClick={handleCopyQuestions}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy 10 Questions
          </button>
          <button
            onClick={handleDownloadReport}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Full Report
          </button>
        </div>
      </div>

      {/* Action Next Box */}
      {weakSkills.length > 0 && (
        <div className="card-premium bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-violet-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Action Next</h3>
              <p className="text-gray-600 mb-4">
                Focus on these top {weakSkills.length} skills marked for practice:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                onClick={() => document.getElementById('day-1')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
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
