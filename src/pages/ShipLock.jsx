import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Lock, Unlock, CheckCircle, AlertTriangle, ArrowLeft, Rocket, Shield } from 'lucide-react';
import { isShippingReady, getChecklistSummary } from '../utils/testChecklist';

function ShipLock() {
  const [ready, setReady] = useState(false);
  const [summary, setSummary] = useState({ checked: 0, total: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check shipping readiness
    const shippingReady = isShippingReady();
    const checklistSummary = getChecklistSummary();
    setReady(shippingReady);
    setSummary(checklistSummary);
    setLoading(false);
  }, []);

  // Show loading state while checking
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card-premium p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Checking shipping readiness...</p>
        </div>
      </div>
    );
  }

  // If not ready, show locked state (no bypass allowed)
  if (!ready) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
            <Lock className="w-4 h-4" />
            Shipping Locked
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ship to Production
          </h1>
          <p className="text-gray-600">
            Complete all tests before shipping.
          </p>
        </div>

        {/* Locked Card */}
        <div className="card-premium p-8 border-red-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Shipping is Locked
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              All 10 tests must pass before the platform can be shipped. 
              Complete the checklist to unlock.
            </p>

            {/* Progress */}
            <div className="max-w-sm mx-auto mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  {summary.checked} / {summary.total}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${(summary.checked / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 max-w-md mx-auto mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm text-left">
                <strong>Cannot ship:</strong> {10 - summary.checked} tests remaining. 
                Go to the test checklist and verify all functionality.
              </p>
            </div>

            {/* Action Button */}
            <Link
              to="/prp/07-test"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Go to Test Checklist
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Ready to ship - show success state
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
          <Unlock className="w-4 h-4" />
          Shipping Unlocked
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ready to Ship
        </h1>
        <p className="text-gray-600">
          All tests passed. The platform is production-ready.
        </p>
      </div>

      {/* Success Card */}
      <div className="card-premium p-8 border-emerald-200">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All Systems Go
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Congratulations! All 10 quality assurance tests have passed. 
            The Placement Readiness Platform is ready for production deployment.
          </p>

          {/* Progress */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tests Passed</span>
              <span className="font-medium text-emerald-600">
                10 / 10
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Success Message */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 text-sm text-left">
                <strong>Ready to ship:</strong> All validation, extraction, scoring, 
                persistence, and export features verified.
              </p>
            </div>
          </div>

          {/* Ship Button */}
          <button
            onClick={() => alert('🚀 Platform shipped to production!')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-lg"
          >
            <Rocket className="w-5 h-5" />
            Ship to Production
          </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        {[
          { label: 'Validation', status: 'Pass' },
          { label: 'Extraction', status: 'Pass' },
          { label: 'Scoring', status: 'Pass' },
          { label: 'Persistence', status: 'Pass' },
          { label: 'Exports', status: 'Pass' }
        ].map((item, idx) => (
          <div key={idx} className="card-premium p-4 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{item.label}</p>
            <p className="text-xs text-emerald-600">{item.status}</p>
          </div>
        ))}
      </div>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <Link 
          to="/prp/07-test" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Test Checklist
        </Link>
      </div>
    </div>
  );
}

export default ShipLock;
