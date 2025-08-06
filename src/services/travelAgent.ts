import { TravelQuery, Itinerary, ItineraryDay, ItineraryItem } from '../types/travel';
import { tavilySearch, createTravelSearchQuery, extractTravelInfo, TavilyResponse } from './tavilyApi';

// Currency conversion rate (approximate)
const USD_TO_INR = 83.5;

// Helper function to convert USD to INR
const convertToINR = (usdAmount: string): string => {
  // Extract numbers from USD string (e.g., "$15-25" -> [15, 25])
  const matches = usdAmount.match(/\$(\d+)(?:-(\d+))?/);
  if (!matches) return usdAmount;
  
  const min = parseInt(matches[1]);
  const max = matches[2] ? parseInt(matches[2]) : min;
  
  const minINR = Math.round(min * USD_TO_INR);
  const maxINR = Math.round(max * USD_TO_INR);
  
  if (min === max) {
    return `₹${minINR}`;
  }
  return `₹${minINR}-${maxINR}`;
};

// Travel agent that processes Tavily results and creates itineraries
export const generateItinerary = async (query: TravelQuery): Promise<Itinerary> => {
  let tavilyResponse: TavilyResponse | null = null;

  try {
    // Create search query for Tavily API
    const searchQuery = createTravelSearchQuery(
      query.destination,
      query.theme,
      query.days,
      query.groupSize,
      query.additionalInfo
    );
    
    // Get travel information from Tavily API
    tavilyResponse = await tavilySearch({
      query: searchQuery,
      search_depth: 'advanced',
      include_answer: true,
      include_images: false,
      max_results: 15,
      include_domains: ['tripadvisor.com', 'lonelyplanet.com', 'timeout.com', 'fodors.com', 'frommers.com']
    });
  } catch (error) {
    console.warn('Tavily API unavailable, using fallback data generation:', error);
    // Continue with null tavilyResponse to use fallback data
  }
  
  // Process results and create itinerary (with fallback if API fails)
  const itinerary = processItinerary(query, tavilyResponse);
  
  return itinerary;
};

const processItinerary = (query: TravelQuery, tavilyResponse: TavilyResponse | null): Itinerary => {
  const { destination, theme, days } = query;
  
  // Generate unique ID
  const id = `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create title and description
  const title = createItineraryTitle(query);
  const description = createItineraryDescription(query);
  
  // Generate days
  const itineraryDays = generateItineraryDays(query, tavilyResponse);
  
  // Generate tips
  const tips = generateTipsFromTavily(query, tavilyResponse);
  
  // Calculate budget estimate
  const totalBudget = calculateBudgetEstimate(query);
  
  return {
    id,
    query,
    title,
    description,
    days: itineraryDays,
    totalBudget,
    tips,
    createdAt: new Date()
  };
};

const createItineraryTitle = (query: TravelQuery): string => {
  const { destination, theme, days } = query;
  
  const themeMap = {
    budget: 'Budget-Friendly',
    food: 'Foodie',
    culture: 'Cultural',
    nature: 'Nature',
    luxury: 'Luxury',
    adventure: 'Adventure'
  };
  
  return `${days}-Day ${themeMap[theme]} ${destination} Adventure`;
};

const createItineraryDescription = (query: TravelQuery): string => {
  const { destination, theme, days, groupSize } = query;
  
  return `Perfect ${days}-day ${theme} itinerary for ${groupSize} ${groupSize === 1 ? 'person' : 'people'} exploring the best of ${destination}. Carefully curated recommendations for an unforgettable experience.`;
};

const generateItineraryDays = (query: TravelQuery, tavilyResponse: TavilyResponse | null): ItineraryDay[] => {
  const { days, destination, theme } = query;
  const results = tavilyResponse?.results || [];
  
  const itineraryDays: ItineraryDay[] = [];
  
  for (let dayNum = 1; dayNum <= days; dayNum++) {
    const dayTitle = `Day ${dayNum}: ${getDayTheme(dayNum, theme, destination)}`;
    const dayItems = generateDayItems(dayNum, query, results);
    
    itineraryDays.push({
      day: dayNum,
      title: dayTitle,
      items: dayItems
    });
  }
  
  return itineraryDays;
};

const getDayTheme = (dayNum: number, theme: string, destination: string): string => {
  if (dayNum === 1) {
    return `Essential ${destination}`;
  } else {
    const themeMap = {
      budget: 'Hidden Gems',
      food: 'Culinary Journey',
      culture: 'Cultural Deep Dive',
      nature: 'Natural Wonders',
      luxury: 'Premium Experiences',
      adventure: 'Thrilling Activities'
    };
    return themeMap[theme] || 'Local Exploration';
  }
};

const generateDayItems = (dayNum: number, query: TravelQuery, results: any[]): ItineraryItem[] => {
  const { theme, destination } = query;
  
  // Extract structured information from Tavily results
  const travelInfo = extractTravelInfo(results);
  
  const items: ItineraryItem[] = [];
  
  if (dayNum === 1) {
    // First day: iconic spots using real Tavily data
    items.push(
      {
        time: '9:00 AM',
        activity: travelInfo.attractions[0] || getMainAttraction(destination),
        location: getMainAttractionLocation(destination),
        description: getDescriptionFromResults(results, 0) || 'Start your adventure at the most iconic landmark. Perfect for photos and getting oriented.',
        type: 'attraction',
        cost: theme === 'budget' ? 'Free' : convertToINR('$15-25')
      },
      {
        time: '12:00 PM',
        activity: travelInfo.restaurants[0] || cleanTitle(results[1]?.title) || 'Local Lunch Spot',
        location: getNeighborhood(destination, 1),
        description: getDescriptionFromResults(results, 1) || 'Authentic local cuisine experience.',
        type: 'food',
        cost: convertToINR(getBudgetRange(theme, 'meal'))
      },
      {
        time: '2:30 PM',
        activity: travelInfo.attractions[1] || cleanTitle(results[2]?.title) || 'Cultural Experience',
        location: getNeighborhood(destination, 2),
        description: getDescriptionFromResults(results, 2) || 'Immerse yourself in local culture and history.',
        type: 'attraction',
        cost: convertToINR(getBudgetRange(theme, 'attraction'))
      },
      {
        time: '6:00 PM',
        activity: 'Sunset Viewing & Dinner',
        location: getBestViewpoint(destination),
        description: 'End your first day watching the sunset from the best viewpoint, followed by dinner.',
        type: 'activity',
        cost: convertToINR(getBudgetRange(theme, 'dinner'))
      }
    );
  } else {
    // Second day: deeper exploration
    items.push(
      {
        time: '10:00 AM',
        activity: travelInfo.activities[0] || cleanTitle(results[3]?.title) || 'Local Market Visit',
        location: getNeighborhood(destination, 3),
        description: getDescriptionFromResults(results, 3) || 'Explore local markets and interact with vendors.',
        type: 'activity',
        cost: convertToINR(getBudgetRange(theme, 'activity'))
      },
      {
        time: '1:00 PM',
        activity: travelInfo.restaurants[1] || 'Neighborhood Food Tour',
        location: getNeighborhood(destination, 4),
        description: getDescriptionFromResults(results, 4) || 'Discover hidden culinary gems in a charming local neighborhood.',
        type: 'food',
        cost: convertToINR(getBudgetRange(theme, 'tour'))
      },
      {
        time: '4:00 PM',
        activity: travelInfo.activities[1] || getThemeActivity(theme, destination),
        location: getNeighborhood(destination, 5),
        description: getDescriptionFromResults(results, 5) || getThemeActivityDescription(theme),
        type: getActivityType(theme),
        cost: convertToINR(getBudgetRange(theme, 'special'))
      },
      {
        time: '7:30 PM',
        activity: travelInfo.attractions[2] || 'Farewell Experience',
        location: 'City Center',
        description: getDescriptionFromResults(results, 6) || 'Perfect ending to your trip with a memorable local experience.',
        type: 'activity',
        cost: convertToINR(getBudgetRange(theme, 'special'))
      }
    );
  }
  
  return items;
};

// Helper function to clean and format titles from Tavily results
const cleanTitle = (title?: string): string => {
  if (!title) return '';
  return title
    .replace(/^(Best|Top|The Best|The Top)\s+/i, '')
    .replace(/\s+in\s+[^,]+$/i, '')
    .replace(/\s*-\s*.*$/, '')
    .trim();
};

// Helper function to extract meaningful descriptions from Tavily results
const getDescriptionFromResults = (results: any[], index: number): string => {
  if (!results[index]?.content) return '';
  
  const content = results[index].content;
  const sentences = content.split(/[.!?]+/);
  
  // Find the first meaningful sentence (not too short, not too long)
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length > 30 && trimmed.length < 150) {
      return trimmed + '.';
    }
  }
  
  // Fallback to first 120 characters
  return content.slice(0, 120).trim() + '...';
};

// Helper functions for generating realistic location-specific content
const getMainAttraction = (destination: string): string => {
  const attractions = {
    'paris': 'Eiffel Tower & Trocadéro Gardens',
    'tokyo': 'Sensoji Temple & Asakusa District',
    'rome': 'Colosseum & Roman Forum',
    'london': 'Tower Bridge & Borough Market',
    'barcelona': 'Sagrada Familia & Park Güell',
    'amsterdam': 'Anne Frank House & Canal Walk',
  };
  return attractions[destination.toLowerCase()] || `${destination} Main Square`;
};

const getMainAttractionLocation = (destination: string): string => {
  const locations = {
    'paris': 'Champ de Mars, 7th Arrondissement',
    'tokyo': 'Asakusa, Taito City',
    'rome': 'Palatine Hill, Historic Center',
    'london': 'Tower Hamlets, South Bank',
    'barcelona': 'Eixample & Park Güell',
    'amsterdam': 'Jordaan District',
  };
  return locations[destination.toLowerCase()] || 'City Center';
};

const getNeighborhood = (destination: string, index: number): string => {
  const neighborhoods = {
    'paris': ['Montmartre', 'Le Marais', 'Latin Quarter', 'Saint-Germain', 'Belleville'],
    'tokyo': ['Shibuya', 'Harajuku', 'Shinjuku', 'Ginza', 'Akihabara'],
    'rome': ['Trastevere', 'Testaccio', 'Monti', 'Campo de\' Fiori', 'Vatican Area'],
  };
  const cityNeighborhoods = neighborhoods[destination.toLowerCase()] || ['Downtown', 'Old Town', 'Arts District', 'Market Area', 'Historic Quarter'];
  return cityNeighborhoods[index % cityNeighborhoods.length];
};

const getBestViewpoint = (destination: string): string => {
  const viewpoints = {
    'paris': 'Sacré-Cœur, Montmartre',
    'tokyo': 'Tokyo Skytree Observation Deck',
    'rome': 'Janiculum Hill',
    'london': 'Primrose Hill',
    'barcelona': 'Bunkers del Carmel',
  };
  return viewpoints[destination.toLowerCase()] || 'City Overlook';
};

const getThemeActivity = (theme: string, destination: string): string => {
  const activities = {
    budget: 'Free Museum Day',
    food: 'Cooking Class Experience',
    culture: 'Local Art Gallery Tour',
    nature: 'City Park & Gardens Walk',
    luxury: 'Premium Spa Experience',
    adventure: 'City Adventure Challenge'
  };
  return activities[theme] || 'Special Interest Activity';
};

const getThemeActivityDescription = (theme: string): string => {
  const descriptions = {
    budget: 'Take advantage of free admission days and discover amazing collections without spending extra.',
    food: 'Learn to prepare traditional dishes with local ingredients from a skilled chef.',
    culture: 'Discover contemporary and traditional art in galleries frequented by locals.',
    nature: 'Relax in beautiful green spaces and gardens away from the city bustle.',
    luxury: 'Indulge in premium treatments and services for the ultimate relaxation.',
    adventure: 'Challenge yourself with exciting activities that get your adrenaline pumping.'
  };
  return descriptions[theme] || 'Unique experience tailored to your interests.';
};

const getActivityType = (theme: string): 'attraction' | 'food' | 'activity' | 'transport' => {
  if (theme === 'food') return 'food';
  if (theme === 'culture') return 'attraction';
  return 'activity';
};

const getBudgetRange = (theme: string, type: string): string => {
  const budgetRanges = {
    budget: {
      meal: '$8-15',
      dinner: '$15-25',
      attraction: 'Free-$10',
      activity: '$5-15',
      tour: '$20-30',
      special: '$10-20'
    },
    luxury: {
      meal: '$35-50',
      dinner: '$80-120',
      attraction: '$25-40',
      activity: '$50-80',
      tour: '$100-150',
      special: '$150-250'
    },
    default: {
      meal: '$15-25',
      dinner: '$30-45',
      attraction: '$15-25',
      activity: '$20-35',
      tour: '$40-60',
      special: '$50-75'
    }
  };
  
  const ranges = budgetRanges[theme] || budgetRanges.default;
  return ranges[type] || '$20-30';
};

const calculateBudgetEstimate = (query: TravelQuery): string => {
  const { theme, days, groupSize } = query;
  
  const dailyEstimates = {
    budget: 35,
    food: 55,
    culture: 45,
    nature: 40,
    luxury: 150,
    adventure: 65
  };
  
  const dailyBudget = dailyEstimates[theme] || 50;
  const totalPerPerson = dailyBudget * days;
  const totalForGroup = totalPerPerson * groupSize;
  
  return `₹${Math.round(totalPerPerson * USD_TO_INR)}/person (₹${Math.round(totalForGroup * USD_TO_INR)} total)`;
};

const generateTipsFromTavily = (query: TravelQuery, tavilyResponse: TavilyResponse | null): string[] => {
  const { theme, destination, days, groupSize } = query;
  
  // Extract tips from Tavily results
  const travelInfo = tavilyResponse ? extractTravelInfo(tavilyResponse.results) : { tips: [] };
  const tavilyTips = travelInfo.tips.slice(0, 3);
  
  const tips = [
    `Download offline maps for ${destination} to navigate without data charges.`,
    `Book popular attractions in advance to skip long queues, especially during peak season.`,
    ...tavilyTips
  ];
  
  if (theme === 'budget') {
    tips.push(
      'Look for lunch specials and happy hours to save money on meals.',
      'Many museums offer free admission on certain days - check their websites!'
    );
  } else if (theme === 'food') {
    tips.push(
      'Ask locals for restaurant recommendations - they know the best hidden gems.',
      'Try street food for authentic flavors at great prices.'
    );
  } else if (theme === 'culture') {
    tips.push(
      'Learn a few basic phrases in the local language to enhance cultural interactions.',
      'Visit cultural sites early in the morning or late afternoon for better lighting and fewer crowds.'
    );
  }
  
  if (groupSize > 3) {
    tips.push('Consider group discounts for tours and attractions - ask when booking.');
  }
  
  if (days === 1) {
    tips.push('Pack light and wear comfortable shoes - you\'ll be doing a lot of walking!');
  } else {
    tips.push('Leave some flexibility in your schedule for spontaneous discoveries.');
  }
  
  // Remove duplicates and limit to 6 tips
  return [...new Set(tips)].slice(0, 6);
};