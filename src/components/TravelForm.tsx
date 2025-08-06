import React, { useState } from 'react';
import { Send, MapPin, Users, Calendar, Sparkles, Plus, Minus } from 'lucide-react';
import { TravelQuery } from '../types/travel';

interface TravelFormProps {
  onSubmit: (query: TravelQuery) => void;
  disabled?: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, disabled = false }) => {
  const [destination, setDestination] = useState('');
  const [theme, setTheme] = useState<TravelQuery['theme']>('budget');
  const [days, setDays] = useState(2);
  const [groupSize, setGroupSize] = useState(2);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    const query: TravelQuery = {
      destination: destination.trim(),
      theme,
      days: days as TravelQuery['days'],
      groupSize,
      additionalInfo: additionalInfo.trim() || undefined,
    };

    onSubmit(query);
  };

  const incrementDays = () => {
    setDays(prev => Math.min(prev + 1, 7)); // Max 7 days
  };

  const decrementDays = () => {
    setDays(prev => Math.max(prev - 1, 1)); // Min 1 day
  };

  const themes = [
    { value: 'budget', label: '💰 Budget', color: 'from-green-500 to-emerald-600' },
    { value: 'food', label: '🍜 Food & Dining', color: 'from-orange-500 to-red-600' },
    { value: 'culture', label: '🏛️ Culture & History', color: 'from-purple-500 to-indigo-600' },
    { value: 'nature', label: '🌿 Nature & Outdoors', color: 'from-green-500 to-teal-600' },
    { value: 'luxury', label: '💎 Luxury', color: 'from-yellow-500 to-amber-600' },
    { value: 'adventure', label: '⚡ Adventure', color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4" />
            Where do you want to go?
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Paris, Tokyo, New York..."
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Sparkles className="w-4 h-4" />
            What's your travel vibe?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                type="button"
                onClick={() => setTheme(themeOption.value as TravelQuery['theme'])}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                  theme === themeOption.value
                    ? `bg-gradient-to-r ${themeOption.color} text-white border-transparent shadow-lg transform scale-105`
                    : 'bg-white/50 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-white/70'
                }`}
                disabled={disabled}
              >
                {themeOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Days and Group Size */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              Trip Duration
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrementDays}
                disabled={disabled || days <= 1}
                className="p-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center py-3 px-4 bg-blue-500 text-white rounded-xl border-2 border-blue-500 shadow-lg font-medium">
                {days} Day{days > 1 ? 's' : ''}
              </div>
              <button
                type="button"
                onClick={incrementDays}
                disabled={disabled || days >= 7}
                className="p-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              Group Size
            </label>
            <div className="relative">
              <input
                type="number"
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="20"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Any specific preferences? (Optional)
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="e.g., vegetarian restaurants, wheelchair accessible, avoid crowds..."
            rows={3}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
            disabled={disabled}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || !destination.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {disabled ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Your Perfect Trip...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate My Travel Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TravelForm;