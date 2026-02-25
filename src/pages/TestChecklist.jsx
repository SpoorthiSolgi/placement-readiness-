import { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertTriangle, RotateCcw, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { getChecklist, toggleChecklistItem, resetChecklist, getChecklistSummary } from '../utils/testChecklist';

function TestChecklist() {
  const [checklist, setChecklist] = useState([]);
  const [summary, setSummary] = useState({ checked: 0, total: 10, ready: false });
  const [expandedHints, setExpandedHints] = useState({});

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
    const items = getChecklist();
    setChecklist(items);
    setSummary(getChecklistSummary());
  };

  const handleToggle = (itemId) => {
    const updated = toggleChecklistItem(itemId);
    setChecklist(updated);
    setSummary(getChecklistSummary());
  };

  const handleReset = () => {
    if (window.confirm('Reset all checklist items to unchecked?')) {
      const reset = resetChecklist();
      setChecklist(reset);
      setSummary(getChecklistSummary());
    }
  };

  const toggleHint = (itemId) => {
    setExpandedHints(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
          <ClipboardCheck className="w-4 h-4" />
          Quality Assurance
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pre-Ship Test Checklist
        </h1>
        <p className="text-gray-600">
          Verify all critical functionality before shipping. All tests must pass.
        </p>
      </div>

      {/* Summary Card */}
      <div className={`card-premium p-6 mb-6 ${summary.ready ? 'border-emerald-200' : 'border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              summary.ready 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-amber-100 text-amber-600'
            }`}>
              {summary.ready ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tests Passed: {summary.checked} / {summary.total}
              </h2>
              <p className="text-gray-600">
                {summary.checked === 10 
                  ? 'All tests passed! Ready to ship.' 
                  : `${10 - summary.checked} tests remaining`}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Checklist
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                summary.ready ? 'bg-emerald-500' : 'bg-violet-500'
              }`}
              style={{ width: `${(summary.checked / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Warning Message */}
        {!summary.ready && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 font-medium">
              Fix issues before shipping. All 10 tests must pass.
            </p>
          </div>
        )}

        {/* Success Message */}
        {summary.ready && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-emerald-800 font-medium">
              All tests passed! The platform is ready to ship.
            </p>
          </div>
        )}
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item, index) => (
          <div 
            key={item.id}
            className={`card-premium p-4 transition-all ${
              item.checked ? 'border-emerald-200 bg-emerald-50/30' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  item.checked 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-gray-300 hover:border-violet-400'
                }`}
              >
                {item.checked && <CheckCircle className="w-4 h-4" />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-medium ${
                    item.checked ? 'text-emerald-900 line-through' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                </div>

                {/* Hint Toggle */}
                <button
                  onClick={() => toggleHint(item.id)}
                  className="mt-2 flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
                >
                  {expandedHints[item.id] ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide hint
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      How to test
                    </>
                  )}
                </button>

                {/* Hint Content */}
                {expandedHints[item.id] && (
                  <div className="mt-2 p-3 bg-violet-50 rounded-lg text-sm text-violet-800">
                    {item.hint}
                  </div>
                )}
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {item.checked ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4" />
          Checklist state is saved to localStorage and persists across sessions.
        </p>
      </div>
    </div>
  );
}

export default TestChecklist;
