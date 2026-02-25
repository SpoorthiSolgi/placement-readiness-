import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Target, AlertCircle, Lightbulb } from 'lucide-react';
import { getRoundIcon, getDifficultyColor } from '../utils/roundMapping';

function RoundMappingTimeline({ rounds }) {
  const [expandedRound, setExpandedRound] = useState(null);

  if (!rounds || rounds.length === 0) return null;

  const toggleRound = (roundNumber) => {
    setExpandedRound(expandedRound === roundNumber ? null : roundNumber);
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Low': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
      'Medium-Hard': 'bg-orange-100 text-orange-700 border-orange-200',
      'Hard': 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Interview Process</h3>
          <p className="text-sm text-gray-500">Expected rounds based on company profile</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 via-purple-200 to-gray-200" />

        {/* Rounds */}
        <div className="space-y-4">
          {rounds.map((round, index) => {
            const isExpanded = expandedRound === round.roundNumber;
            const isLast = index === rounds.length - 1;
            const icon = getRoundIcon(round.title);

            return (
              <div key={round.roundNumber} className="relative pl-14">
                {/* Timeline Dot */}
                <div 
                  className={`absolute left-4 w-5 h-5 rounded-full border-4 transition-colors duration-200 ${
                    isExpanded 
                      ? 'bg-violet-500 border-violet-200' 
                      : 'bg-white border-violet-300'
                  }`}
                  style={{ top: '20px' }}
                />

                {/* Card */}
                <div 
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-violet-300 shadow-lg shadow-violet-100' 
                      : 'border-gray-200 hover:border-violet-200'
                  }`}
                >
                  {/* Header - Always Visible */}
                  <button
                    onClick={() => toggleRound(round.roundNumber)}
                    className="w-full p-4 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{icon}</span>
                        <h4 className="font-bold text-gray-900">{round.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyBadge(round.difficulty)}`}>
                          {round.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{round.description}</p>
                      
                      {/* Focus Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {round.focus?.slice(0, 3).map((item, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-md font-medium"
                          >
                            {item}
                          </span>
                        ))}
                        {round.focus?.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">
                            +{round.focus.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{round.duration}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-violet-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      {/* Why It Matters */}
                      <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-violet-900 mb-1">Why This Round Matters</h5>
                            <p className="text-sm text-violet-800 leading-relaxed">{round.whyItMatters}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tips */}
                      {round.tips && round.tips.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            Preparation Tips
                          </h5>
                          <ul className="space-y-2">
                            {round.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-medium text-gray-500">
                                  {idx + 1}
                                </span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoundMappingTimeline;
