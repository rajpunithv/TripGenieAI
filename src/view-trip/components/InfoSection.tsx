import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../services/GlobalAPI";

const InfoSection = ({ trip }: { trip: any }) => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.destination
        ?.split(" ")[0]
        ?.replace(/[^a-zA-Z]/g, ""),
    };
    console.log("data", data);
    const results = await GetPlaceDetails(data).then((resp) => {
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[1].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };
  return (
    <div>
      <img
        src={photoUrl && photoUrl.trim() !== "" ? photoUrl : "/placeholder.jpg"}
        alt={trip?.userSelection?.destination}
        className="h-[340px] w-full object-cover rounded-xl mt-7"
        onError={(e) => {
          e.currentTarget.onerror = null; // Prevent infinite loop
          e.currentTarget.src = "/placeholder.jpg";
        }}
      />
      <div>
        <div className=" my-5 flex flex-col gap-2">
          <h2 className="text-4xl font-bold text-gray-800 tracking-wide capitalize drop-shadow-md font-[Poppins] transition-all duration-300 hover:text-blue-600">
            {trip?.userSelection?.destination
              ? trip.userSelection.destination.charAt(0).toUpperCase() +
                trip.userSelection.destination.slice(1).toLowerCase()
              : ""}
          </h2>

          <div>
            <h2 className="p-3 bg-gray-100 rounded-lg text-gray-700 text-lg font-medium shadow-md w-full md:w-fit">
              <span className="block">
                🗓️ Trip starts on <b>{trip?.userSelection?.startDate}</b>
              </span>
              <span className="block">
                🏁 Ends on <b>{trip?.userSelection?.endDate}</b>
              </span>
              <span className="block mt-2 text-blue-600 font-semibold">
                ⏳ Total Duration:{" "}
                {trip?.userSelection?.startDate && trip?.userSelection?.endDate
                  ? Math.ceil(
                      (new Date(trip.userSelection.endDate).getTime() -
                        new Date(trip.userSelection.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 0}{" "}
                days.
              </span>
              <span className="block mt-2 text-green-700 font-semibold bg-green-200 px-2 py-1 rounded-md w-fit">
                💰 Budget: ₹{trip?.userSelection?.budget}
              </span>
            </h2>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          <IoIosSend />
          Send
        </button>
      </div>
    </div>
  );
};

export default InfoSection;
