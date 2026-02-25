import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Sparkles, History, Code2, ClipboardList, BookOpen, User, Bell, ClipboardCheck, Rocket } from 'lucide-react';
import { getChecklistSummary } from '../utils/testChecklist';
import { useState, useEffect } from 'react';

function DashboardLayout() {
  const [testSummary, setTestSummary] = useState({ checked: 0, total: 10 });

  useEffect(() => {
    setTestSummary(getChecklistSummary());
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/analyze', label: 'JD Analyzer', icon: Sparkles },
    { path: '/dashboard/history', label: 'History', icon: History },
    { path: '/dashboard/practice', label: 'Practice', icon: Code2 },
    { path: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
    { path: '/dashboard/resources', label: 'Resources', icon: BookOpen },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary-600">Placement Prep</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* QA Section */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Quality Assurance</p>
          <div className="space-y-2">
            <Link
              to="/prp/07-test"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ClipboardCheck className="w-5 h-5" />
              <span className="flex-1">Test Checklist</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                testSummary.checked === 10 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {testSummary.checked}/10
              </span>
            </Link>
            <Link
              to="/prp/08-ship"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Rocket className="w-5 h-5" />
              <span>Ship</span>
              {testSummary.checked === 10 && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">© 2026 Placement Prep</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Placement Prep</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
