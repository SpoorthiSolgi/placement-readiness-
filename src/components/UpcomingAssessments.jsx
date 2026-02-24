import { Calendar, Clock } from 'lucide-react';

const assessments = [
  {
    title: 'DSA Mock Test',
    date: 'Tomorrow',
    time: '10:00 AM',
  },
  {
    title: 'System Design Review',
    date: 'Wed',
    time: '2:00 PM',
  },
  {
    title: 'HR Interview Prep',
    date: 'Friday',
    time: '11:00 AM',
  },
];

function UpcomingAssessments() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Upcoming Assessments</h3>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div>
              <p className="font-medium text-gray-900">{assessment.title}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{assessment.time}</span>
              </div>
            </div>
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {assessment.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingAssessments;
