import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Building2, Briefcase, Trash2, ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { getHistory, deleteHistoryEntry, formatDate } from '../utils/historyStorage';
import { getAllSkillsFromStructure } from '../utils/schema';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [corruptedWarning, setCorruptedWarning] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const entries = getHistory();
    setHistory(entries);
    
    // Check if any entries were corrupted (would have been filtered out)
    // We can detect this by checking localStorage directly
    try {
      const rawData = localStorage.getItem('placement_readiness_history');
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed) && parsed.length !== entries.length) {
          setCorruptedWarning(true);
        }
      }
    } catch (e) {
      // Ignore errors
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteHistoryEntry(id);
      loadHistory();
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/results?id=${id}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h2>
        <p className="text-gray-600">
          View your previous job description analyses and preparation plans.
        </p>
      </div>

      {/* Corrupted Entry Warning */}
      {corruptedWarning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            One saved entry couldn't be loaded. Create a new analysis.
          </p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses yet</h3>
          <p className="text-gray-500 mb-6">
            Start by analyzing a job description to see your history here.
          </p>
          <button
            onClick={() => navigate('/dashboard/analyze')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Analyze a Job Description
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              onClick={() => handleView(entry.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {entry.company && (
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Building2 className="w-4 h-4" />
                        {entry.company}
                      </span>
                    )}
                    {entry.role && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          {entry.role}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    {formatDate(entry.createdAt)}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(entry.finalScore ?? entry.baseScore)}`}>
                      Score: {entry.finalScore ?? entry.baseScore}/100
                    </span>
                    
                    {entry.extractedSkills && (
                      <span className="text-sm text-gray-500">
                        {getAllSkillsFromStructure(entry.extractedSkills).length} skills detected
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => handleView(entry.id)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Analysis"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
