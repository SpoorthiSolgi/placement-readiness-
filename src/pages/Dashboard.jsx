import CircularProgress from '../components/CircularProgress';
import SkillRadarChart from '../components/SkillRadarChart';
import ContinuePractice from '../components/ContinuePractice';
import WeeklyGoals from '../components/WeeklyGoals';
import UpcomingAssessments from '../components/UpcomingAssessments';

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Readiness - Large Circular Progress */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Readiness</h3>
          <CircularProgress score={72} />
        </div>

        {/* Skill Breakdown - Radar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Skill Breakdown</h3>
          <SkillRadarChart />
        </div>

        {/* Continue Practice */}
        <ContinuePractice topic="Dynamic Programming" completed={3} total={10} />

        {/* Weekly Goals */}
        <WeeklyGoals solved={12} goal={20} activeDays={[true, true, false, true, true, false, false]} />

        {/* Upcoming Assessments - Full Width on Mobile, Span 2 cols on large */}
        <div className="lg:col-span-2">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
