import { useState } from "react";
import DatePicker from "react-datepicker";
import { Plane, ArrowLeftRight, Calendar, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

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

type CabinClass = "Economy" | "Business" | "First";

export default function FlightSearch() {
  const [tripType, setTripType] = useState<TripType>("round");
  const [travellersOpen, setTravellersOpen] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");

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
      // alert("Please select From, To and Departure date");
      toast.error("Please select From, To and travel date(s)");
      return;
    }

    if (tripType === "round" && !returnDate) {
      // alert("Please select Return date");
      toast.error("Please select Return date");
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

  const CounterRow = ({
    label,
    value,
    setValue,
  }: {
    label: string;
    value: number;
    setValue: (n: number) => void;
  }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm">{label}</span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setValue(Math.max(0, value - 1))}
          className="w-6 h-6 border rounded"
        >
          –
        </button>

        <span className="w-4 text-center">{value}</span>

        <button
          onClick={() => setValue(value + 1)}
          className="w-6 h-6 border rounded"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      {/* top */}
      <div className="flex flex-col sm:justify-between sm:items-center mb-4 sm:flex-row">
        <div className="flex gap-2 justify-center ">
          <button
            onClick={() => handleTripTypeChange("round")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              tripType === "round"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 border border-gray-400"
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
                : "bg-gray-100 text-gray-700 border border-gray-400"
            }`}
          >
            <ArrowLeftRight size={16} />
            One Way
          </button>
        </div>
        <div className="flex gap-2 justify-center mt-4 sm:mt-0">
          {/* passenger */}
          <div className="relative">
            <button
              onClick={() => setTravellersOpen((prev) => !prev)}
              className="border rounded-lg px-3 h-10 text-sm bg-blue-100 flex items-center gap-1"
            >
              <Users size={16} className="text-blue-600" />
              <span>{adults + children + infants}</span>
              {adults + children + infants === 1 ? "Traveller" : "Travellers"}
            </button>
            {travellersOpen && (
              <div className="absolute right-0 mt-2 w-46 sm:w-64 bg-white border rounded-xl shadow-lg p-4 z-50">
                <CounterRow
                  label="Adults"
                  value={adults}
                  setValue={setAdults}
                />
                <CounterRow
                  label="Children"
                  value={children}
                  setValue={setChildren}
                />
                <CounterRow
                  label="Infants"
                  value={infants}
                  setValue={setInfants}
                />

                <button
                  onClick={() => setTravellersOpen(false)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
          {/* class */}
          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value as CabinClass)}
            className="border rounded-lg px-3 h-10 text-sm bg-blue-100"
          >
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* From */}
        <div className="flex items-center border rounded-lg px-2 flex-1 h-10">
          <MapPin size={16} className="text-gray-400 mr-2" />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full outline-none text-sm bg-transparent h-10"
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
        <button
          onClick={handleSwap}
          className="h-10 px-3 border rounded-lg w-10 mx-auto"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/* To */}
        <div className="flex items-center border rounded-lg px-2 flex-1 h-10">
          <MapPin size={16} className="text-gray-400 mr-2" />
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full outline-none text-sm bg-transparent h-10"
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
              className="w-full outline-none text-sm h-10"
            />
          ) : (
            <DatePicker
              selected={departureDate}
              onChange={(date: Date | null) => setDepartureDate(date)}
              placeholderText="Select departure date"
              className="w-full outline-none text-sm h-10"
            />
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-4 flex justify-center sm:justify-end">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          Search Flights
        </button>
      </div>
    </div>
  );
}
