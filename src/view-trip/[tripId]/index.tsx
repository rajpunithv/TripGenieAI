import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { toast } from "react-toastify";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";
import Navbar from "../../components/Navbar"; // Adjust path if needed

const Viewtrip: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    } else {
      toast.error("Trip ID is missing from the URL.");
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data) {
          toast.error("Trip data is empty.");
          return;
        }
        console.log("Document data:", data);
        setTrip(data as Record<string, any>);
      } else {
        console.warn("No such trip document!");
        toast.error("No such trip found.");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast.error("Failed to fetch trip data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-blue-50 px-4 md:px-20 lg:px-44 xl:px-56 py-10">
        {loading ? (
          <p className="text-center text-lg font-semibold">Loading trip...</p>
        ) : trip ? (
          <>
            <InfoSection trip={trip} />
            <Hotels trip={trip} />
            <PlacesToVisit trip={trip} />
          </>
        ) : (
          <p className="text-center text-red-500 text-lg font-semibold">
            Trip not found or failed to load.
          </p>
        )}
      </div>

      <div className="w-screen bg-blue-50 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-[800px] will-change-transform">
          <p className="text-red-600 text-lg font-bold px-4 py-2 tracking-[2px]">
            ⚠️ If the Trip was not generated properly, Try again once 😊.
          </p>
          <p className="text-red-600 text-lg font-bold px-4 py-2 tracking-[2px]">
            ⚠️ If the Trip was not generated properly, Try again once 😊.
          </p>
        </div>
      </div>

      <div className="w-screen bg-blue-50 py-6">
        <Footer />
      </div>
    </>
  );
};

export default Viewtrip;
