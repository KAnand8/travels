import React from 'react';
import { Plane, MapPin, Calendar, Users } from 'lucide-react';

const LoadingState: React.FC = () => {
  const steps = [
    { icon: MapPin, text: "Analyzing destination", delay: 0 },
    { icon: Calendar, text: "Planning your days", delay: 800 },
    { icon: Users, text: "Optimizing for your group", delay: 1600 },
    { icon: Plane, text: "Finalizing your perfect trip", delay: 2400 }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Plane className="w-8 h-8 text-white animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Creating Your Perfect Trip</h3>
        <p className="text-gray-600">Our AI is analyzing travel data to craft your ideal itinerary...</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
              index === 0 ? 'bg-blue-50/80 border border-blue-200' : 'bg-gray-50/50'
            }`}
            style={{
              animationDelay: `${step.delay}ms`,
              animation: `fadeInScale 0.5s ease-out forwards ${step.delay}ms`
            }}
          >
            <div className={`p-2 rounded-lg ${
              index === 0 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-gray-500'
            } transition-all duration-300`}>
              <step.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className={`text-sm font-medium ${
                index === 0 ? 'text-blue-900' : 'text-gray-500'
              }`}>
                {step.text}
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              index === 0
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 bg-white'
            }`}>
              {index === 0 && (
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <span>This usually takes a moment...</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;