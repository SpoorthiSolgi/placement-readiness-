import { BookOpen } from 'lucide-react';

function Resources() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Resources</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Resources</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Access study materials, tutorials, and reference guides to help you prepare.
        </p>
      </div>
    </div>
  );
}

export default Resources;
