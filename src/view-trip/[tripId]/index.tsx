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

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    if (tripId) {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setTrip(docSnap.data() as Record<string, any>);
      } else {
        console.log("No such document!");
      }
    } else {
      console.error("tripId is undefined");
      toast("No Trip found");
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-blue-50 px-4 md:px-20 lg:px-44 xl:px-56 py-10">
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
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
