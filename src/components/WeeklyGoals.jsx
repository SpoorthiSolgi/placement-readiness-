import { Target } from 'lucide-react';

function WeeklyGoals({ solved = 12, goal = 20, activeDays = [true, true, false, true, true, false, false] }) {
  const progress = (solved / goal) * 100;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Weekly Goals</h3>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Problems Solved</span>
          <span className="font-medium">{solved}/{goal} this week</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {days.map((day, index) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200 ${
                activeDays[index]
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {day[0]}
            </div>
            <span className="text-xs text-gray-500">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyGoals;
