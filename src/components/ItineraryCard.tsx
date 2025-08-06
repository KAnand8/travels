import React from 'react';
import { RefreshCw, MapPin, Clock, DollarSign, Star, Share2 } from 'lucide-react';
import { Itinerary } from '../types/travel';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onGenerateAgain: () => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary, onGenerateAgain }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'food':
        return '🍜';
      case 'attraction':
        return '🏛️';
      case 'activity':
        return '🎯';
      case 'transport':
        return '🚗';
      default:
        return '📍';
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'budget':
        return 'from-green-500 to-emerald-600';
      case 'food':
        return 'from-orange-500 to-red-600';
      case 'culture':
        return 'from-purple-500 to-indigo-600';
      case 'nature':
        return 'from-green-500 to-teal-600';
      case 'luxury':
        return 'from-yellow-500 to-amber-600';
      case 'adventure':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getThemeColor(itinerary.query.theme)} p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{itinerary.title}</h2>
            <p className="text-white/90 text-sm leading-relaxed">{itinerary.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onGenerateAgain}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              title="Generate Again"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200" title="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trip Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{itinerary.query.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{itinerary.query.days} Day{itinerary.query.days > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span>{itinerary.query.groupSize} People</span>
          </div>
          {itinerary.totalBudget && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>{itinerary.totalBudget}</span>
            </div>
          )}
        </div>
      </div>

      {/* Itinerary Days */}
      <div className="p-6 space-y-8">
        {itinerary.days.map((day) => (
          <div key={day.day} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${getThemeColor(itinerary.query.theme)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {day.day}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
            </div>

            <div className="space-y-3">
              {day.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg">
                      {getActivityIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 leading-tight">{item.activity}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    {item.cost && (
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600 mt-2">
                        <DollarSign className="w-3 h-3" />
                        <span>{item.cost}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      {itinerary.tips.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-blue-50/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Pro Tips</h4>
            </div>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;