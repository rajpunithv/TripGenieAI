import React from "react";
import PlaceCardItem from "./PlaceCardItem";

const PlacesToVisit = ({ trip }: { trip: any }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-20 py-8 max-w-7xl mx-auto">
      <h2 className="font-bold text-3xl mb-8 text-center text-blue-700">
        Places To Visit
      </h2>

      <div className="space-y-10">
        {trip?.tripData?.itinerary.map((item: any, dayIndex: number) => (
          <div key={dayIndex}>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Day {item.day}
            </h3>

            <div className="space-y-6">
              {item.plan.map((place: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-5 transition hover:shadow-xl"
                  >
                    <PlaceCardItem place={place} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
