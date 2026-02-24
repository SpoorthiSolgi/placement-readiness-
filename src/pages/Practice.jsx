import { Code2 } from 'lucide-react';

function Practice() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Practice</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Code2 className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Problems</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Coding challenges and algorithm problems will be available here. Start practicing to improve your skills.
        </p>
      </div>
    </div>
  );
}

export default Practice;
