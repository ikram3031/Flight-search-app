import { useState } from "react";
import { Plane, Hotel, Car } from "lucide-react";
import FlightSearchForm from "./FlightSearchForm";
import HotelSearchForm from "./HotelSearchForm";
import CarSearchForm from "./CarSearchForm";

type BookingTab = "flight" | "hotel" | "car";

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("flight");

  return (
    <div className="w-full rounded-2xl ">
      <div className="flex items-center gap-2 border-b px-4 pt-4">
        <button
          type="button"
          onClick={() => setActiveTab("flight")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
            activeTab === "flight"
              ? "border-orange-500 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plane size={18} />
          Flight
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hotel")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
            activeTab === "hotel"
              ? "border-orange-500 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Hotel size={18} />
          Hotel
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("car")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
            activeTab === "car"
              ? "border-orange-500 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Car size={18} />
          Car
        </button>
      </div>

      <div className="p-4 md:p-6">
        {activeTab === "flight" && <FlightSearchForm />}
        {activeTab === "hotel" && <HotelSearchForm />}
        {activeTab === "car" && <CarSearchForm />}
      </div>
    </div>
  );
};

export default BookingTabs;
