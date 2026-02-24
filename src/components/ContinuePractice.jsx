import { BookOpen } from 'lucide-react';

function ContinuePractice({ topic = 'Dynamic Programming', completed = 3, total = 10 }) {
  const progress = (completed / total) * 100;
  const isComplete = completed >= total;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Continue Practice</h3>
      </div>

      {isComplete ? (
        <div className="text-center py-4">
          <p className="text-green-600 font-semibold">All topics complete!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-700 font-medium mb-2">{topic}</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{completed}/{total} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
            Continue
          </button>
        </>
      )}
    </div>
  );
}

export default ContinuePractice;
