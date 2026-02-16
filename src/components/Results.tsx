import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import type { SearchPayload } from "../utils/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatTime } from "../utils/utilityFunctions";

type Props = {
  searchParams: SearchPayload | null;
  onBack: () => void;
  // visible: boolean;
};

const Results = ({ searchParams, onBack }: Props) => {
  if (!searchParams) return null;
  // if (!visible) return null;

  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const CHUNK_SIZE = 10;

  const [displayedFlights, setDisplayedFlights] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const getToken = async (): Promise<string> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/app/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            appSecrate: import.meta.env.VITE_APP_SECRATE,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Token request failed");
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error("Token missing in response");
      }

      return data.token;
    } catch (err) {
      console.error("Token Error:", err);
      throw err;
    }
  };

  const getAppData = async (token: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/agent/appdata`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("AppData request failed");

    return res.json();
  };

  const buildSearchBody = (apiId: number) => {
    if (!searchParams?.departureDate) return null;

    const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

    const segments =
      searchParams.tripType === "oneWay"
        ? [
            {
              DepartureAirport: searchParams.from,
              ArrivalAirport: searchParams.to,
              FlyDate: formatDate(searchParams.departureDate),
            },
          ]
        : [
            {
              DepartureAirport: searchParams.from,
              ArrivalAirport: searchParams.to,
              FlyDate: formatDate(searchParams.departureDate),
            },
            {
              DepartureAirport: searchParams.to,
              ArrivalAirport: searchParams.from,
              FlyDate: formatDate(searchParams.returnDate!),
            },
          ];

    return {
      OriginDestinationOptions: segments,
      Passengers: [
        {
          PassengerType: "ADT",
          Quantity: searchParams.passengers.adults,
        },
      ],
      CabinClass: searchParams.cabinClass,
      ApiId: apiId,
    };
  };

  const searchFlightsForApi = async (apiId: number, token: string) => {
    const body = buildSearchBody(apiId);

    if (!body) throw new Error("Invalid search body");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/flights/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) throw new Error(`API ${apiId} failed`);

    return res.json();
  };

  const runMultiSupplierSearch = async (apiIds: number[], token: string) => {
    const results = await Promise.allSettled(
      apiIds.map((id) => searchFlightsForApi(id, token)),
    );

    return results
      .filter((r) => r.status === "fulfilled")
      .map((r: any) => r.value);
  };

  const startSearchFlow = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      const appData = await getAppData(token);

      const apiIds = appData.agentInfo.flightApis.slice(0, 2);

      const responses = await runMultiSupplierSearch(apiIds, token);

      // MERGE RESULTS
      const combinedResults = responses.flatMap((r) => r?.results || []);

      // SIMPLIFY RESULTS
      const simplified = combinedResults
        .map((r: any) => {
          const outbound = r.flights?.[0];
          const inbound = r.flights?.[1];

          if (!outbound?.flightSegments?.length) return null;

          const firstOutbound = outbound.flightSegments[0];
          const lastOutbound =
            outbound.flightSegments[outbound.flightSegments.length - 1];

          const simplifiedFlight: any = {
            id: r.resultID,
            flightKey: r.flightKey,
            airline: r.validatingCarrier,
            airlineCode: firstOutbound.airline?.code,
            apiId: r.apiId,
            price: r.totalFare?.totalFare ?? 0,
            currency: r.totalFare?.currency ?? "",
            outStops: outbound.totalStops,
            inStops: inbound?.totalStops ?? 0,
            duration: outbound.totalElapsedTime,

            outbound: {
              from: firstOutbound.departure?.airport?.airportCode,
              to: lastOutbound.arrival?.airport?.airportCode,
              depTime: firstOutbound.departure?.depTime,
              arrTime: lastOutbound.arrival?.arrTime,
              depDate: firstOutbound.departure?.depDate,
              arrDate: lastOutbound.arrival?.arrDate,
            },
          };

          if (inbound?.flightSegments?.length) {
            const firstInbound = inbound.flightSegments[0];
            const lastInbound =
              inbound.flightSegments[inbound.flightSegments.length - 1];

            simplifiedFlight.inbound = {
              from: firstInbound.departure?.airport?.airportCode,
              to: lastInbound.arrival?.airport?.airportCode,
              depTime: firstInbound.departure?.depTime,
              arrTime: lastInbound.arrival?.arrTime,
              depDate: firstInbound.departure?.depDate,
              arrDate: lastInbound.arrival?.arrDate,
            };
          }

          return simplifiedFlight;
        })
        .filter(Boolean);

      console.log("SIMPLIFIED:", simplified);

      setFlights(simplified);
      setTotalResults(simplified.length);
      setDisplayedFlights(simplified.slice(0, CHUNK_SIZE));
      setPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Flight search failed");
    } finally {
      setLoading(false);
    }
  };

  const hasExecuted = useRef(false);

  useEffect(() => {
    // if (!searchParams) return;
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    startSearchFlow();
  }, [searchParams]);

  const travellersCount =
    searchParams.passengers.adults +
    searchParams.passengers.children +
    searchParams.passengers.infants;

  const loadMore = () => {
    const nextPage = page + 1;

    const nextItems = flights.slice(page * CHUNK_SIZE, nextPage * CHUNK_SIZE);

    if (nextItems.length === 0) return;

    setDisplayedFlights((prev) => [...prev, ...nextItems]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedFlights.length < flights.length
        ) {
          loadMore();
        }
      },
      { threshold: 1 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [displayedFlights, flights, page]);

  return (
    <div className="bg-blue-100 min-h-screen ">
      {/* top */}
      <div className="bg-blue-500">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between p-4">
          <div className="text-white font-semibold text-xl mr-4 sm:mr-0">
            {searchParams.from} → {searchParams.to}{" "}
            {searchParams.tripType === "round" && `→ ${searchParams.from}`}
            <p className="text-sm font-normal mt-1">
              <span>
                {searchParams.tripType === "round" ? "Round Trip" : "One Way"}{" "}
                |{" "}
              </span>
              <span>
                {searchParams.departureDate &&
                  format(searchParams.departureDate, "d MMM, EEEE")}
                {searchParams.returnDate &&
                  ` → ${format(searchParams.returnDate, "d MMM, EEEE")}`}{" "}
                |{" "}
              </span>
              <span>
                {travellersCount}{" "}
                {travellersCount > 1 ? "Travellers" : "Traveller"}
              </span>
            </p>
          </div>

          <button
            onClick={onBack}
            className="flex gap-1 items-center text-sm text-black bg-white rounded-xl px-3 py-2 shadow "
          >
            <Pencil size={14} />
            <span className="hidden sm:block">Modify</span>
          </button>
        </div>
      </div>
      {/* Loadning */}
      {loading && (
        <div className="p-6 text-center text-gray-500">
          Searching flights...
        </div>
      )}
      {/* Results */}
      {!loading && displayedFlights.length > 0 && (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <h2 className="text-xl font-bold">
            {totalResults} available flights
          </h2>

          {displayedFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex flex-col gap-4 w-full">
                  {/* OUTBOUND */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr]">
                    <div>
                      <p className="font-bold text-lg">
                        {flight.outbound.from} → {flight.outbound.to}
                      </p>
                      <p className="text-sm">{flight.airline}</p>
                      <p className="text-xs text-gray-500 font-bold">
                        {flight.duration}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold">
                        {formatTime(flight.outbound.depTime)}
                      </p>
                      <p className="text-xs truncate">
                        {format(flight.outbound.depDate, "d MMM, EEEE")}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold">
                        {formatTime(flight.outbound.arrTime)}
                      </p>
                      <p className="text-xs truncate">
                        {format(flight.outbound.arrDate, "d MMM, EEEE")}
                      </p>
                    </div>

                    <div className="text-sm font-bold">
                      {flight.outStops === 0
                        ? "Non-Stop"
                        : `${flight.outStops} Stop(s)`}
                    </div>
                  </div>

                  {/* INBOUND */}
                  {flight.inbound && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr] border-t border-gray-300 pt-2">
                      <div>
                        <p className="font-bold text-lg">
                          {flight.inbound.from} → {flight.inbound.to}
                        </p>
                        <p className="text-sm">{flight.airline}</p>
                        <p className="text-xs text-gray-500 font-bold">
                          {flight.duration}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold">
                          {formatTime(flight.inbound.depTime)}
                        </p>
                        <p className="text-xs truncate">
                          {format(flight.inbound.depDate, "d MMM, EEEE")}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold">
                          {formatTime(flight.inbound.arrTime)}
                        </p>
                        <p className="text-xs truncate">
                          {format(flight.inbound.arrDate, "d MMM, EEEE")}
                        </p>
                      </div>

                      <div className="text-sm font-bold">
                        {flight.inStops === 0
                          ? "Non-Stop"
                          : `${flight.inStops} Stop`}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex flex-row sm:flex-col justify-between sm:justify-center gap-6 items-center border-t border-gray-300 pt-4 sm:border-0 sm:pt-0">
                  <p className="text-sm font-bold text-center text-gray-800">
                    {flight.currency}{" "}
                    <span className="text-xl">{flight.price}</span>
                  </p>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* OBSERVER */}
          <div ref={observerRef} className="h-10" />
        </div>
      )}
    </div>
  );
};

export default Results;
