import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, Calendar, HelpCircle, Target } from 'lucide-react';
import { getHistoryEntry } from '../utils/historyStorage';
import CircularProgress from '../components/CircularProgress';

function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) {
      navigate('/dashboard/analyze');
      return;
    }

    const entry = getHistoryEntry(id);
    if (entry) {
      setAnalysis(entry);
    } else {
      navigate('/dashboard/history');
    }
    setLoading(false);
  }, [id, navigate]);

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

  const { company, role, extractedSkills, readinessScore, plan, checklist, questions } = analysis;

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
          <CircularProgress score={readinessScore} size={180} strokeWidth={10} />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Readiness Assessment</h3>
            <p className="text-gray-600 mb-4">
              Based on the job description analysis, here's how prepared you are for this role.
            </p>
            <div className="flex flex-wrap gap-2">
              {readinessScore >= 80 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Well Prepared
                </span>
              )}
              {readinessScore >= 60 && readinessScore < 80 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Good Progress
                </span>
              )}
              {readinessScore < 60 && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  Needs Preparation
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-600" />
          Key Skills Extracted
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
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
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
            <div key={day.day} className="p-4 bg-gray-50 rounded-lg">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
    </div>
  );
}

export default Results;
