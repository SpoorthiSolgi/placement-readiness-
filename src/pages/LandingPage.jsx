import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3, Sparkles, Target, TrendingUp, ArrowRight } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Code,
      title: 'Smart Practice',
      description: 'AI-powered coding challenges tailored to your skill level and target companies.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Target,
      title: 'JD Analysis',
      description: 'Upload job descriptions and get personalized preparation plans with skill gap analysis.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visual analytics dashboard showing your readiness score and improvement over time.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Students Placed' },
    { value: '500+', label: 'Company Partners' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Placement Preparation</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Land Your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-300">
                Dream Job
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Intelligent preparation platform that analyzes job descriptions, 
              identifies skill gaps, and creates personalized 7-day study plans.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/dashboard/analyze')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Target className="w-5 h-5" />
                Analyze a JD
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to take you from preparation to placement
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-violet-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-12 md:p-16 text-center">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Preparation?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have landed their dream jobs using our platform.
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">PlacementReady</span>
            </div>
            <p>&copy; 2026 Placement Readiness Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
