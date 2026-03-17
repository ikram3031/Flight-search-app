import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import {
  ArrowLeftRight,
  ChevronDown,
  MapPin,
  Plane,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
// import type { SearchPayload } from "../utils/types";

type TripType = "round" | "oneWay";

type Airport = {
  code: string;
  city: string;
};

type CabinClass = "Economy" | "Business" | "First";

type FareType = "regular" | "student" | "umrah";

/* type Props = {
  onSearch: (payload: SearchPayload) => void;
}; */

const airports: Airport[] = [
  { code: "DAC", city: "Dhaka" },
  { code: "DXB", city: "Dubai" },
  { code: "KUL", city: "Kuala Lumpur" },
  { code: "LHR", city: "London" },
  { code: "CXB", city: "Cox's Bazar" },
];

const FlightSearchForm = () => {
  const [tripType, setTripType] = useState<TripType>("round");
  const [travellersOpen, setTravellersOpen] = useState(false);

  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");
  const [fareType, setFareType] = useState<FareType>("regular");

  const [from, setFrom] = useState<string>("DAC");
  const [to, setTo] = useState<string>("CXB");

  const today = new Date();

  const defaultDeparture = new Date(today);
  defaultDeparture.setDate(today.getDate() + 1);

  const defaultReturn = new Date(today);
  defaultReturn.setDate(today.getDate() + 3);

  const [departureDate, setDepartureDate] = useState<Date | null>(
    defaultDeparture,
  );
  const [returnDate, setReturnDate] = useState<Date | null>(defaultReturn);

  const totalTravellers = adults + children + infants;

  const fromAirport = useMemo(
    () => airports.find((airport) => airport.code === from),
    [from],
  );

  const toAirport = useMemo(
    () => airports.find((airport) => airport.code === to),
    [to],
  );

  const formatDay = (date: Date | null) => {
    if (!date) return "--";
    return date.getDate();
  };

  const formatMonthYear = (date: Date | null) => {
    if (!date) return "Select Date";

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatWeekday = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);

    if (type === "oneWay") {
      setReturnDate(null);
      return;
    }

    if (type === "round" && departureDate && !returnDate) {
      const newReturn = new Date(departureDate);
      newReturn.setDate(departureDate.getDate() + 3);
      setReturnDate(newReturn);
    }
  };

  const handleSwap = () => {
    if (!from || !to) return;

    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleDepartureChange = (date: Date | null) => {
    setDepartureDate(date);

    if (tripType === "round" && date && returnDate && returnDate < date) {
      const newReturn = new Date(date);
      newReturn.setDate(date.getDate() + 3);
      setReturnDate(newReturn);
    }
  };

  const handleReturnChange = (date: Date | null) => {
    setReturnDate(date);
  };

  const handleSearch = () => {
    if (!from || !to) {
      toast.error("Please select origin and destination");
      return;
    }

    if (from === to) {
      toast.error("Origin and destination cannot be the same");
      return;
    }

    if (!departureDate) {
      toast.error("Please select departure date");
      return;
    }

    if (tripType === "round" && !returnDate) {
      toast.error("Please select return date");
      return;
    }

    /* const payload: SearchPayload = {
      tripType,
      from,
      to,
      departureDate,
      returnDate,
      passengers: {
        adults,
        children,
        infants,
      },
      cabinClass,
    };

    onSearch(payload); */
  };

  const CounterRow = ({
    label,
    value,
    setValue,
    min = 0,
  }: {
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    min?: number;
  }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue((prev) => Math.max(min, prev - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50"
          >
            -
          </button>

          <span className="w-5 text-center text-sm font-semibold text-slate-800">
            {value}
          </span>

          <button
            type="button"
            onClick={() => setValue((prev) => prev + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6">
      {/* Top controls */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleTripTypeChange("oneWay")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              tripType === "oneWay"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            One Way
          </button>

          <button
            type="button"
            onClick={() => handleTripTypeChange("round")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              tripType === "round"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Round Trip
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setTravellersOpen((prev) => !prev)}
              className="flex h-10 items-center gap-2 rounded-md bg-slate-100 px-4 text-sm font-semibold text-blue-600"
            >
              <Users size={16} />
              <span>
                {totalTravellers}{" "}
                {totalTravellers === 1 ? "Traveller" : "Travellers"}
              </span>
              <ChevronDown size={16} />
            </button>

            {travellersOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <CounterRow
                  label="Adults"
                  value={adults}
                  setValue={setAdults}
                  min={1}
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
                  type="button"
                  onClick={() => setTravellersOpen(false)}
                  className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as CabinClass)}
              className="h-10 appearance-none rounded-md bg-slate-100 px-4 pr-9 text-sm font-semibold text-blue-600 outline-none"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Search row */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.3fr_auto_1.3fr_1.2fr_1.2fr_72px]">
        {/* From */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-slate-500">From</p>

          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-slate-400" />

            <div className="min-w-0 flex-1">
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-transparent text-lg font-bold text-slate-800 outline-none"
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>

              <p className="truncate text-sm text-slate-500">
                {fromAirport?.city}, {fromAirport?.code}
              </p>
            </div>
          </div>
        </div>

        {/* Swap */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        {/* To */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-slate-500">To</p>

          <div className="flex items-center gap-3">
            <Plane size={18} className="text-slate-400" />

            <div className="min-w-0 flex-1">
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-transparent text-lg font-bold text-slate-800 outline-none"
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>

              <p className="truncate text-sm text-slate-500">
                {toAirport?.city}, {toAirport?.code}
              </p>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-slate-500">Departure</p>

          <div className="flex items-center gap-3">
            <div className="min-w-[34px] text-2xl font-bold text-slate-800">
              {formatDay(departureDate)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-slate-800">
                {formatMonthYear(departureDate)}
              </p>

              <DatePicker
                selected={departureDate}
                onChange={handleDepartureChange}
                minDate={today}
                dateFormat="dd MMMM yyyy"
                className="w-full bg-transparent text-sm text-slate-500 outline-none"
              />

              <p className="text-sm text-slate-500">
                {formatWeekday(departureDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Return */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-slate-500">Return</p>

          {tripType === "round" ? (
            <div className="flex items-center gap-3">
              <div className="min-w-[34px] text-2xl font-bold text-slate-800">
                {formatDay(returnDate)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-slate-800">
                  {formatMonthYear(returnDate)}
                </p>

                <DatePicker
                  selected={returnDate}
                  onChange={handleReturnChange}
                  minDate={departureDate ?? today}
                  dateFormat="dd MMMM yyyy"
                  className="w-full bg-transparent text-sm text-slate-500 outline-none"
                />

                <p className="text-sm text-slate-500">
                  {formatWeekday(returnDate)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center text-sm text-slate-400">
              Return not required
            </div>
          )}
        </div>

        {/* Search */}
        <button
          type="button"
          onClick={handleSearch}
          className="flex h-full min-h-[72px] items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600"
        >
          <Search size={24} />
        </button>
      </div>

      {/* Fare type */}
      <div className="mt-5 flex flex-wrap items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="radio"
            name="fareType"
            checked={fareType === "regular"}
            onChange={() => setFareType("regular")}
            className="h-4 w-4 accent-blue-600"
          />
          Regular Fare
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="radio"
            name="fareType"
            checked={fareType === "student"}
            onChange={() => setFareType("student")}
            className="h-4 w-4 accent-blue-600"
          />
          Student Fare
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="radio"
            name="fareType"
            checked={fareType === "umrah"}
            onChange={() => setFareType("umrah")}
            className="h-4 w-4 accent-blue-600"
          />
          Umrah Fare
        </label>
      </div>
    </div>
  );
};

export default FlightSearchForm;
