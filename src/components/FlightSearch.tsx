import { useState } from "react";
import DatePicker from "react-datepicker";
import { Plane, ArrowLeftRight, Calendar, MapPin } from "lucide-react";

type TripType = "round" | "oneWay";

type Airport = {
  code: string;
  city: string;
};

const airports: Airport[] = [
  { code: "DAC", city: "Dhaka" },
  { code: "DXB", city: "Dubai" },
  { code: "KUL", city: "Kuala Lumpur" },
  { code: "LHR", city: "London" },
];

export default function FlightSearch() {
  const [tripType, setTripType] = useState<TripType>("round");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);

    if (type === "oneWay") {
      setReturnDate(null); // VERY IMPORTANT
    }
  };

  const handleSwap = () => {
    if (!from || !to) return;

    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setDepartureDate(start);
    setReturnDate(end);
  };

  const handleSearch = () => {
    if (!from || !to || !departureDate) {
      alert("Please select From, To and Departure date");
      return;
    }

    if (tripType === "round" && !returnDate) {
      alert("Please select Return date");
      return;
    }

    console.log({
      tripType,
      from,
      to,
      departureDate,
      returnDate,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      {/* Trip Type */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
        <button
          onClick={() => handleTripTypeChange("round")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            tripType === "round"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <Plane size={16} />
          Round Trip
        </button>

        <button
          onClick={() => handleTripTypeChange("oneWay")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            tripType === "oneWay"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <ArrowLeftRight size={16} />
          One Way
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* From */}
        <div className="flex items-center border rounded-lg px-2 flex-1 h-10">
          <MapPin size={16} className="text-gray-400 mr-2" />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full outline-none text-sm bg-transparent"
          >
            <option value="">From</option>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        {/* Swap */}
        <button onClick={handleSwap} className="h-10 px-3 border rounded-lg">
          <ArrowLeftRight size={16} />
        </button>

        {/* To */}
        <div className="flex items-center border rounded-lg px-2 flex-1 h-10">
          <MapPin size={16} className="text-gray-400 mr-2" />
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full outline-none text-sm bg-transparent"
          >
            <option value="">To</option>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="flex items-center border rounded-lg px-2 flex-1 h-10">
          <Calendar size={16} className="text-gray-400 mr-2" />

          {tripType === "round" ? (
            <DatePicker
              selected={departureDate}
              onChange={handleDateChange}
              startDate={departureDate}
              endDate={returnDate}
              selectsRange
              placeholderText="Select travel dates"
              className="w-full outline-none text-sm"
            />
          ) : (
            <DatePicker
              selected={departureDate}
              onChange={(date: Date | null) => setDepartureDate(date)}
              placeholderText="Select departure date"
              className="w-full outline-none text-sm"
            />
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-4 flex justify-center sm:justify-end">
        <button
          onClick={handleSearch}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          Search Flights
        </button>
      </div>
    </div>
  );
}
