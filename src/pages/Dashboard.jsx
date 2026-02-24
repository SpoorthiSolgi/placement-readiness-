import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Target, Calendar, ArrowRight } from 'lucide-react';
import CircularProgress from '../components/CircularProgress';
import SkillRadarChart from '../components/SkillRadarChart';
import ContinuePractice from '../components/ContinuePractice';
import WeeklyGoals from '../components/WeeklyGoals';
import UpcomingAssessments from '../components/UpcomingAssessments';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-gray-500">Track your progress and prepare for success</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Analyze New JD
        </button>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Readiness Score</p>
            <p className="text-2xl font-bold text-gray-900">72/100</p>
          </div>
        </div>
        
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Problems Solved</p>
            <p className="text-2xl font-bold text-gray-900">128</p>
          </div>
        </div>
        
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Streak</p>
            <p className="text-2xl font-bold text-gray-900">12 days</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Readiness - Large Circular Progress */}
        <div className="lg:col-span-1 card-premium p-8 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Overall Readiness</h3>
          <p className="text-sm text-gray-500 mb-6 text-center">Based on your recent assessments</p>
          <CircularProgress score={72} size={200} strokeWidth={12} />
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-medium">
            <TrendingUp className="w-5 h-5" />
            <span>+5% from last week</span>
          </div>
        </div>

        {/* Skill Breakdown - Radar Chart */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Skill Breakdown</h3>
              <p className="text-sm text-gray-500">Your proficiency across key areas</p>
            </div>
            <button className="text-violet-600 font-medium text-sm hover:text-violet-700 flex items-center gap-1">
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <SkillRadarChart />
        </div>

        {/* Continue Practice */}
        <ContinuePractice topic="Dynamic Programming" completed={3} total={10} />

        {/* Weekly Goals */}
        <WeeklyGoals solved={12} goal={20} activeDays={[true, true, false, true, true, false, false]} />

        {/* Quick Actions */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/dashboard/analyze')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Analyze JD</p>
                <p className="text-sm text-gray-500">Get personalized plan</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/history')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">View History</p>
                <p className="text-sm text-gray-500">Past analyses</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Upcoming Assessments - Full Width */}
        <div className="lg:col-span-3">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
