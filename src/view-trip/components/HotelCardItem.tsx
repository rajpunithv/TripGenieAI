import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../services/GlobalAPI";

const HotelCardItem = ({ hotel }: { hotel: any }) => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    const results = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[0].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };
  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        hotel?.hotelName +
        "," +
        hotel?.hotelAddress
      }
      target="_blank"
    >
      <div className="hover:scale-110 transition-all cursor-pointer">
        <img
          src={
            photoUrl && photoUrl.trim() !== "" ? photoUrl : "/placeholder.jpg"
          }
          alt={hotel?.hotelName}
          className="w-full md:w-56 h-40 object-cover rounded-xl"
          onError={(e) => {
            e.currentTarget.onerror = null; // Prevent infinite loop
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
        <div className="my-2 flex flex-col gap-1">
          <h2 className="text-lg font-meduim font-semibold">
            {hotel?.hotelName}
          </h2>

          <h2 className="text-md text-gray-500 ">📍 {hotel?.hotelAddress}</h2>

          <h2 className="text-sm">Cost per night: ₹{hotel?.pricePerNight}</h2>

          <h2 className="text-sm">⭐ {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
};

export default HotelCardItem;
