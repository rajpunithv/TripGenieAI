import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Plane,
  DollarSign,
  Search,
  Loader2,
  Save,
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Navbar from "./components/Navbar";
import { chatSession } from "./services/AIModal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface TravelFormData {
  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

interface TripPlan {
  destinations: string[];
  activities: string[];
  accommodations: string[];
  transportation: string[];
  budget: {
    accommodation: number;
    activities: number;
    transportation: number;
    food: number;
  };
}

function App() {
  const [formData, setFormData] = useState<TravelFormData>({
    fromLocation: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleDestinationSelect = (destination: string) => {
    setFormData((prev) => ({
      ...prev,
      destination,
    }));
  };

  const generateTripPlan = async (AI_PROMPT: string) => {
    const FINAL_PROMPT = AI_PROMPT.replace("{from}", formData.fromLocation)
      .replace("{to}", formData.destination)
      .replace("{start_date}", formData.startDate)
      .replace("{end_date}", formData.endDate)
      .replace("{budget}", formData.budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text?.());
    SaveAiTrip(result?.response?.text?.());
  };

  const SaveAiTrip = async (TripData: string) => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userId: user?.email,
      id: docId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/view-trip/${docId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const prompt = `Plan a trip from ${formData.fromLocation} to ${formData.destination} 
        starting on ${formData.startDate} and ending on ${formData.endDate} 
        with a budget of $${formData.budget}. Include specific recommendations for:
        - Top destinations and attractions to visit
        - Daily activities and experiences
        - Accommodation options within budget
        - Transportation recommendations
        - Budget breakdown for accommodation, activities, transportation, and food`;

      const plan = await generateTripPlan(AI_PROMPT);
    } catch (error: any) {
      console.error("Error generating trip plan:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar onDestinationSelect={handleDestinationSelect} />

      {/* Hero Section */}
      <div
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              AI-Powered Travel Planning
            </h1>
            <p className="text-xl text-white mb-8 animate-slide-up">
              Create your perfect trip itinerary with the power of artificial
              intelligence
            </p>
            <div className="flex flex-col items-center">
              <button
                onClick={scrollToSection}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg animate-bounce"
              >
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Planning Form Section */}
      <div
        id="plan-trip"
        className="relative max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `
            url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"),
            url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"),
            url("https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
          `,
          backgroundPosition: "100% 0, 0 50%, 100% 100%",
          backgroundSize: "300px, 300px, 300px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-white/95 backdrop-blur-sm rounded-3xl"></div>

        {/* Form Container */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 hover:bg-white/90 hover:shadow-2xl transform hover:-translate-y-1">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Plan Your Dream Journey
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Location */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                  <MapPin className="w-4 h-4" />
                  From
                </label>
                <input
                  type="text"
                  value={formData.fromLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, fromLocation: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your starting point"
                  required
                />
              </div>

              {/* Destination */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                  <Plane className="w-4 h-4" />
                  Where to go
                </label>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                  selectProps={{
                    value: formData.destination
                      ? {
                          label: formData.destination,
                          value: formData.destination,
                        }
                      : undefined,
                    onChange: (val) =>
                      setFormData({
                        ...formData,
                        destination: val?.label || "",
                      }),
                    placeholder: "Enter your destination",
                    isClearable: true,
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        borderRadius: "0.5rem",
                        padding: "0.25rem 0.5rem",
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#60a5fa",
                        },
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: "#6b7280",
                      }),
                    },
                  }}
                />
              </div>

              {/* Start Date */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* End Date */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* Budget */}
              <div className="md:col-span-2 group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                  <FaRupeeSign className="w-4 h-4" />
                  Budget
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your budget"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? "Planning Your Trip..." : "Generate My Trip"}
              </button>
            </div>
          </form>
        </div>

        {/* Trip Plan Results */}
        {tripPlan && (
          <div className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-all duration-300 hover:bg-white/90 hover:shadow-2xl transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Personalized Trip Plan
            </h2>

            <div className="space-y-6">
              <div className="bg-white/50 rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Recommended Destinations
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {tripPlan.destinations.map((destination, index) => (
                    <li key={index} className="text-gray-700">
                      {destination}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/50 rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Suggested Activities
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {tripPlan.activities.map((activity, index) => (
                    <li key={index} className="text-gray-700">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/50 rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Accommodation Options
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {tripPlan.accommodations.map((accommodation, index) => (
                    <li key={index} className="text-gray-700">
                      {accommodation}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/50 rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Transportation
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {tripPlan.transportation.map((transport, index) => (
                    <li key={index} className="text-gray-700">
                      {transport}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/50 rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Budget Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <p className="text-sm text-gray-600">Accommodation</p>
                    <p className="text-lg font-semibold">
                      ${tripPlan.budget.accommodation}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <p className="text-sm text-gray-600">Activities</p>
                    <p className="text-lg font-semibold">
                      ${tripPlan.budget.activities}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <p className="text-sm text-gray-600">Transportation</p>
                    <p className="text-lg font-semibold">
                      ${tripPlan.budget.transportation}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <p className="text-sm text-gray-600">Food</p>
                    <p className="text-lg font-semibold">
                      ${tripPlan.budget.food}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Smart Recommendations
            </h3>
            <p className="text-gray-600">
              Get personalized travel suggestions based on your preferences
            </p>
          </div>
          <div className="text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Perfect Timing</h3>
            <p className="text-gray-600">
              Plan your trip with optimal scheduling and timing
            </p>
          </div>
          <div className="text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LiaRupeeSignSolid className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Budget Friendly</h3>
            <p className="text-gray-600">
              Find the best deals within your budget
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }x
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}

const scrollToSection = () => {
  document.getElementById("plan-trip")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const AI_PROMPT =
  'Generate a detailed travel itinerary for a trip based on the following inputs: From: {from} To: {to} Start Date: {start_date} End Date: {end_date} Budget: {budget} (e.g., cheap, mid-range, luxury) The response should include: Hotels List Hotel Name Hotel Address Price per Night Hotel Image URL Geo Coordinates (Latitude, Longitude) Rating Description Day-wise Itinerary Day {X} Plan Place Name Place Details Place Image URL Geo Coordinates (Latitude, Longitude) Ticket Pricing Rating Best Time to Visit Time Travel (Estimated time taken between locations) The itinerary should be optimized for travel efficiency and include budget-friendly recommendations if the budget is marked as "cheap". The response should be formatted in JSON.';

export default App;
