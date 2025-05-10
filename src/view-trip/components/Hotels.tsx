import React from "react";
import { Link } from "react-router-dom";
import HotelCardItem from "./HotelCardItem";

const Hotels = ({ trip }: { trip: any }) => {
  return (
    <div>
      <h2 className="font-bold text-xl mt-5"> Hotel Recommendations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
        {trip?.tripData?.hotels?.map(
          (
            hotel: {
              hotelName:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | null
                | undefined;
              hotelAddress:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | null
                | undefined;
              pricePerNight:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
              rating:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
            },
            index: any
          ) => (
            <HotelCardItem hotel={hotel} />
          )
        )}
      </div>
    </div>
  );
};

export default Hotels;
