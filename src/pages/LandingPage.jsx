import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3 } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Code,
      title: 'Practice Problems',
      description: 'Solve coding challenges across various difficulty levels and topics.',
    },
    {
      icon: Video,
      title: 'Mock Interviews',
      description: 'Simulate real interview scenarios with AI-powered feedback.',
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and insights.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ace Your Placement
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-10">
            Practice, assess, and prepare for your dream job
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg text-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 Placement Readiness Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
