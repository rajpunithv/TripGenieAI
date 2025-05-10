import React, { useState, useEffect } from "react";
import { Plane, ChevronDown } from "lucide-react";
import AuthButtons from "./AuthButtons";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  onDestinationSelect?: (destination: string) => void;
}

export default function Navbar({ onDestinationSelect }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePlaceClick = (place: string) => {
    if (onDestinationSelect) {
      onDestinationSelect(place);
      setIsDropdownOpen(false);
      document.getElementById("plan-trip")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePlanTripClick = () => {
    if (location.pathname === "/") {
      // Scroll if already on home
      document.getElementById("plan-trip")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Navigate to home and scroll will happen there
      navigate("/#plan-trip");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("famous-places-dropdown");
      const button = document.getElementById("famous-places-button");
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-50 backdrop-blur-xl bg-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <Plane className="w-6 h-6 text-[#0F172A] group-hover:text-[#4C1D95] transition-colors duration-300" />
              <span className="text-xl font-bold text-[#0F172A] group-hover:text-[#4C1D95] transition-colors duration-300">
                TripGenie-AI
              </span>
            </a>
            <div className="hidden md:flex items-center space-x-8 ml-10">
              <a
                href="/"
                className="text-md font-bold text-[#0F172A] transition-colors duration-300 hover:text-[#4C1D95]"
              >
                Home
              </a>
              <button
                onClick={handlePlanTripClick}
                className="text-md font-bold text-[#0F172A] transition-colors duration-300 hover:text-[#4C1D95]"
              >
                Plan a Trip
              </button>
              <div className="relative">
                <button
                  id="famous-places-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 text-md font-bold text-[#0F172A] transition-colors duration-300 hover:text-[#4C1D95] focus:outline-none"
                >
                  Famous Places
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    id="famous-places-dropdown"
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <button
                      onClick={() => handlePlaceClick("Taj Mahal, Agra")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Taj Mahal, Agra
                    </button>
                    <button
                      onClick={() => handlePlaceClick("Pink City, Jaipur")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Pink City, Jaipur
                    </button>
                    <button
                      onClick={() => handlePlaceClick("Varanasi Ghats")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Varanasi Ghats
                    </button>
                    <button
                      onClick={() => handlePlaceClick("Kerala Backwaters")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Kerala Backwaters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
