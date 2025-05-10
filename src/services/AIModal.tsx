import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import * as fs from "node:fs";
import * as mime from "mime-types";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!); // Assuming apiKey is defined

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "application/json",
};

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

interface TextPart {
  text: string;
}

type ContentPart = InlineDataPart | TextPart;

interface Candidate {
  content: {
    parts: ContentPart[];
  };
}

interface GenerateContentResponse {
  candidates?: Candidate[];
  text?: string;
}

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate a detailed travel itinerary for a trip based on the following inputs:
  
  From: {from}
  
  To: {to}
  
  Start Date: {start_date}
  
  End Date: {end_date}
  
  Budget: {budget} (e.g., cheap, mid-range, luxury)
  
  The response should include:
  
  Hotels List
  
  Hotel Name
  Hotel Address
  Price per Night
  Hotel Image URL
  Geo Coordinates (Latitude, Longitude)
  Rating
  Description
  
  Day-wise Itinerary
  
  Day {X} Plan
  Place Name
  Place Details
  Place Image URL
  Geo Coordinates (Latitude, Longitude)
  Ticket Pricing
  Rating
  Best Time to Visit
  Time Travel (Estimated time taken between locations)
  
  The itinerary should be optimized for travel efficiency and include budget-friendly recommendations if the budget is marked as "cheap". The response should be formatted in JSON.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
  {
    "tripDetails": {
      "from": "{from}",
      "to": "{to}",
      "startDate": "{start_date}",
      "endDate": "{end_date}",
      "budget": "{budget}"
    },
    "hotels": [
      {
        "hotelName": "Budget Backpackers Hotel",
        "hotelAddress": "123 Main Street, {to}",
        "pricePerNight": 50,
        "hotelImageURL": "https://example.com/budget_backpackers_hotel.jpg",
        "geoCoordinates": {
          "latitude": 34.0522,
          "longitude": -118.2437
        },
        "rating": 3.5,
        "description": "Clean and basic accommodation perfect for budget travelers. Offers dorm rooms and private rooms with shared bathrooms. Free Wi-Fi available."
      },
      {
        "hotelName": "Mid-Range City Hotel",
        "hotelAddress": "456 Oak Avenue, {to}",
        "pricePerNight": 150,
        "hotelImageURL": "https://example.com/midrange_city_hotel.jpg",
        "geoCoordinates": {
          "latitude": 34.0522,
          "longitude": -118.2437
        },
        "rating": 4.2,
        "description": "Comfortable hotel with modern amenities including a fitness center, restaurant, and bar. Private rooms with en-suite bathrooms and city views."
      },
      {
        "hotelName": "Luxury Grand Hotel",
        "hotelAddress": "789 Pine Lane, {to}",
        "pricePerNight": 300,
        "hotelImageURL": "https://example.com/luxury_grand_hotel.jpg",
        "geoCoordinates": {
          "latitude": 34.0522,
          "longitude": -118.2437
        },
        "rating": 4.8,
        "description": "Elegant hotel offering exceptional service and luxurious amenities including a spa, rooftop pool, and fine-dining restaurants. Spacious suites with stunning city views."
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "plan": [
          {
            "placeName": "City Central Park",
            "placeDetails": "A large urban park offering green spaces, walking trails, and various recreational activities. A great place to relax and enjoy nature.",
            "placeImageURL": "https://example.com/city_central_park.jpg",
            "geoCoordinates": {
              "latitude": 34.0522,
              "longitude": -118.2437
            },
            "ticketPricing": "Free",
            "rating": 4.5,
            "bestTimeToVisit": "Morning or late afternoon",
            "timeTravel": "N/A"
          },
          {
            "placeName": "Local History Museum",
            "placeDetails": "Explore the rich history of the city through fascinating exhibits and artifacts. Learn about the city's past and cultural heritage.",
            "placeImageURL": "https://example.com/local_history_museum.jpg",
            "geoCoordinates": {
              "latitude": 34.0522,
              "longitude": -118.2437
            },
            "ticketPricing": 15,
            "rating": 4.0,
            "bestTimeToVisit": "Any time during opening hours",
            "timeTravel": "15 minutes by public transport from City Central Park"
          },
          {
            "placeName": "Local Food Market",
            "placeDetails": "Experience the vibrant culinary scene of the city at this bustling food market. Sample local delicacies and enjoy a delicious lunch.",
            "placeImageURL": "https://example.com/local_food_market.jpg",
            "geoCoordinates": {
              "latitude": 34.0522,
              "longitude": -118.2437
            },
            "ticketPricing": "Varies depending on food choices",
            "rating": 4.3,
            "bestTimeToVisit": "Lunchtime",
            "timeTravel": "10 minutes by walking from Local History Museum"
          }
        ]
      },
      {
        "day": 2,
        "plan": [
          {
            "placeName": "Famous Landmark",
            "placeDetails": "Visit the iconic landmark of the city. Take stunning photos and learn about its significance.",
            "placeImageURL": "https://example.com/famous_landmark.jpg",
            "geoCoordinates": {
              "latitude": 34.0522,
              "longitude": -118.2437
            },
            "ticketPricing": 20,
            "rating": 4.7,
            "bestTimeToVisit": "Early morning to avoid crowds",
            "timeTravel": "N/A"
          },
          {
            "placeName": "Art Gallery District",
            "placeDetails": "Explore the vibrant art scene of the city in this district. Discover contemporary and traditional art pieces from local and international artists.",
            "placeImageURL": "https://example.com/art_gallery_district.jpg",
            "geoCoordinates": {
              "latitude": 34.0522,
              "longitude": -118.2437
            },
            "ticketPricing": "Free (some galleries may charge)",
            "rating": 4.2,
            "bestTimeToVisit": "Afternoon",
            "timeTravel": "20 minutes by public transport from Famous Landmark"
          },
          {
            "placeName": "Rooftop Bar",
            "placeDetails": "Enjoy panoramic views of the city while sipping on cocktails at a stylish rooftop bar. The perfect way to end the day.",
            "placeImageURL": "https://example.com/rooftop_bar.jpg",
            "geoCoordinates": {
              "latitude": 34.0522,
              "longitude": -118.2437
            },
            "ticketPricing": "Varies depending on drink choices",
            "rating": 4.4,
            "bestTimeToVisit": "Evening",
            "timeTravel": "15 minutes by walking from Art Gallery District"
          }
        ]
      }
    ]
  }
  \`\`\``,
        },
      ],
    },
  ],
});
