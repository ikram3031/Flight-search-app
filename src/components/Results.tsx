import { Pencil } from "lucide-react";
import type { SearchPayload } from "../utils/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

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

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

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
    const token = await getToken();
    const appData = await getAppData(token);

    const apiIds = appData.agentInfo.flightApis.slice(0, 2);

    const responses = await runMultiSupplierSearch(apiIds, token);

    console.log("FINAL RESULTS:", responses);
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

  return (
    <div className="bg-white min-h-screen max-w-7xl mx-auto">
      {/* top */}
      <div className="bg-blue-500 p-4 w-full flex items-center justify-between">
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
  );
};

export default Results;
