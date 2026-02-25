import { Building2, Users, Target, Briefcase, Info } from 'lucide-react';
import { getSizeIcon, getSizeColor } from '../utils/companyIntel';

function CompanyIntelCard({ companyIntel }) {
  if (!companyIntel) return null;

  const { companyName, industry, size, hiringFocus, isDemo } = companyIntel;
  const sizeColor = getSizeColor(size);
  const sizeIcon = getSizeIcon(size);

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: 'bg-emerald-100 text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: 'bg-amber-100 text-amber-600',
      badge: 'bg-amber-100 text-amber-700'
    },
    violet: {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-700',
      icon: 'bg-violet-100 text-violet-600',
      badge: 'bg-violet-100 text-violet-700'
    }
  };

  const colors = colorClasses[sizeColor] || colorClasses.emerald;

  return (
    <div className="card-premium overflow-hidden">
      {/* Header */}
      <div className={`${colors.bg} border-b ${colors.border} p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center text-2xl`}>
              {sizeIcon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{companyName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{industry}</span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${colors.badge} border ${colors.border}`}>
            {size}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Hiring Focus */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className={`w-5 h-5 ${colors.text}`} />
            <h4 className="font-bold text-gray-900">Typical Hiring Focus</h4>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            {hiringFocus.description}
          </p>
          
          {/* Key Areas */}
          <div className="flex flex-wrap gap-2">
            {hiringFocus.keyAreas?.map((area, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Interview Style */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-700 text-sm">Interview Style</span>
          </div>
          <p className="text-gray-600 text-sm">{hiringFocus.interviewStyle}</p>
        </div>

        {/* Demo Mode Note */}
        {isDemo && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Info className="w-4 h-4" />
            <span>Demo Mode: Company intel generated heuristically</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyIntelCard;
