import React, { useState } from 'react';
import { MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import TravelForm from './components/TravelForm';
import ItineraryCard from './components/ItineraryCard';
import LoadingState from './components/LoadingState';
import { generateItinerary } from './services/travelAgent';
import { TravelQuery, Itinerary } from './types/travel';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateItinerary = async (query: TravelQuery) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const result = await generateItinerary(query);
      setItinerary(result);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(
        err instanceof Error 
          ? `Failed to generate itinerary: ${err.message}` 
          : 'Failed to generate itinerary. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgain = () => {
    if (itinerary?.query) {
      handleGenerateItinerary(itinerary.query);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travel Trip Agent
              </h1>
              <p className="text-sm text-gray-600">AI-powered travel planning for your next adventure</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Powered by AI Travel Intelligence</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plan Your Perfect Trip
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get personalized travel recommendations and mini-itineraries tailored to your budget, 
              interests, and group size. Just tell us where you want to go!
            </p>
          </div>

          {/* Travel Form */}
          <div className="mb-8">
            <TravelForm onSubmit={handleGenerateItinerary} disabled={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mb-8">
              <LoadingState />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-600 font-medium mb-2">Oops! Something went wrong</div>
                <div className="text-red-500 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Itinerary Results */}
          {itinerary && !isLoading && (
            <div className="space-y-6">
              <ItineraryCard itinerary={itinerary} onGenerateAgain={handleGenerateAgain} />
              
              {/* Features Info */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Smart Planning</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    AI-powered itineraries that optimize your time and budget for the best travel experience.
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-8 h-8 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Group Friendly</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Perfect for group trips with recommendations that work for everyone's interests and budget.
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-8 h-8 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Local Insights</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Discover hidden gems and local favorites that you won't find in typical travel guides.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;