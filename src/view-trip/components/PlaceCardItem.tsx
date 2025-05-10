import React, { useEffect, useState } from "react";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../services/GlobalAPI";

const PlaceCardItem = ({ place }: { place: any }) => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName,
    };
    const results = await GetPlaceDetails(data).then((resp) => {
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[1].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 items-start">
      {/* Image */}
      <img
        src={photoUrl && photoUrl.trim() !== "" ? photoUrl : "/placeholder.jpg"}
        alt={place.placeName}
        className="w-full md:w-56 h-40 object-cover rounded-xl"
        onError={(e) => {
          e.currentTarget.onerror = null; // Prevent infinite loop
          e.currentTarget.src = "/placeholder.jpg";
        }}
      />

      {/* Text beside image */}
      <div className="flex-1 space-y-2">
        <h4 className="text-xl font-semibold text-gray-900">
          {place.placeName}
        </h4>
        <p className="text-sm text-orange-600">{place.timeTravel}</p>
        <p className="text-sm text-gray-700">{place.placeDetails}</p>

        <div className="flex flex-wrap justify-between text-sm text-gray-600 mt-3">
          <span>⭐ {place.rating}</span>
          <span>{place.ticketPricing}</span>
        </div>

        <p className="text-xs text-gray-500">
          Best Time to Visit:{" "}
          <span className="font-medium">{place.bestTimeToVisit}</span>
        </p>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            place.placeName
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline block pt-1"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default PlaceCardItem;
