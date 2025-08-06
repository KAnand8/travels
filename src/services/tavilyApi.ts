// Real Tavily API service for fetching travel information
export interface TavilySearchResult {
  title: string;
  content: string;
  url: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
  images?: string[];
  search_depth?: string;
  include_domains?: string[];
  exclude_domains?: string[];
}

export interface TavilySearchRequest {
  query: string;
  search_depth?: 'basic' | 'advanced';
  include_images?: boolean;
  include_answer?: boolean;
  include_raw_content?: boolean;
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
}

const TAVILY_API_URL = 'https://api.tavily.com/search';
const API_KEY = import.meta.env.VITE_TAVILY_API_KEY;

export const tavilySearch = async (searchRequest: TavilySearchRequest): Promise<TavilyResponse> => {
  if (!API_KEY) {
    throw new Error('Tavily API key not found. Please check your environment variables.');
  }

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: API_KEY,
        query: searchRequest.query,
        search_depth: searchRequest.search_depth || 'basic',
        include_images: searchRequest.include_images || false,
        include_answer: searchRequest.include_answer || true,
        include_raw_content: searchRequest.include_raw_content || false,
        max_results: searchRequest.max_results || 10,
        include_domains: searchRequest.include_domains,
        exclude_domains: searchRequest.exclude_domains,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavily API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data: TavilyResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Tavily API request failed:', error);
    throw error;
  }
};

// Helper function to create optimized search queries for travel
export const createTravelSearchQuery = (
  destination: string,
  theme: string,
  days: number,
  groupSize: number,
  additionalInfo?: string
): string => {
  const baseQuery = `best ${theme} places to visit in ${destination}`;
  
  let queryParts = [baseQuery];
  
  // Add theme-specific terms
  switch (theme) {
    case 'budget':
      queryParts.push('cheap', 'free', 'budget-friendly', 'affordable');
      break;
    case 'food':
      queryParts.push('restaurants', 'local cuisine', 'food markets', 'dining');
      break;
    case 'culture':
      queryParts.push('museums', 'historical sites', 'cultural attractions', 'art galleries');
      break;
    case 'nature':
      queryParts.push('parks', 'gardens', 'outdoor activities', 'nature spots');
      break;
    case 'luxury':
      queryParts.push('premium', 'upscale', 'luxury experiences', 'high-end');
      break;
    case 'adventure':
      queryParts.push('activities', 'adventure sports', 'exciting experiences', 'thrills');
      break;
  }
  
  // Add duration context
  if (days === 1) {
    queryParts.push('one day itinerary', 'day trip');
  } else {
    queryParts.push(`${days} days itinerary`, 'weekend trip');
  }
  
  // Add group context
  if (groupSize > 4) {
    queryParts.push('group activities', 'group-friendly');
  }
  
  // Add additional preferences
  if (additionalInfo) {
    queryParts.push(additionalInfo);
  }
  
  // Add current year for fresh results
  queryParts.push('2025', 'current', 'updated');
  
  return queryParts.join(' ');
};

// Helper function to extract key information from Tavily results
export const extractTravelInfo = (results: TavilySearchResult[]) => {
  const attractions: string[] = [];
  const restaurants: string[] = [];
  const activities: string[] = [];
  const tips: string[] = [];
  
  results.forEach(result => {
    const content = result.content.toLowerCase();
    const title = result.title.toLowerCase();
    
    // Categorize based on content
    if (content.includes('restaurant') || content.includes('food') || content.includes('eat') || title.includes('restaurant')) {
      restaurants.push(result.title);
    } else if (content.includes('museum') || content.includes('attraction') || content.includes('visit') || title.includes('museum')) {
      attractions.push(result.title);
    } else if (content.includes('activity') || content.includes('experience') || content.includes('tour')) {
      activities.push(result.title);
    }
    
    // Extract tips from content
    const sentences = result.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      if (sentence.length > 20 && sentence.length < 150) {
        if (sentence.includes('tip') || sentence.includes('recommend') || sentence.includes('best') || sentence.includes('should')) {
          tips.push(sentence.trim());
        }
      }
    });
  });
  
  return {
    attractions: [...new Set(attractions)].slice(0, 5),
    restaurants: [...new Set(restaurants)].slice(0, 5),
    activities: [...new Set(activities)].slice(0, 5),
    tips: [...new Set(tips)].slice(0, 8)
  };
};