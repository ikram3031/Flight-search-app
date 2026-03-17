export type TripType = "ONE_WAY" | "ROUND_TRIP";

export type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
};

export type SearchParams = {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  passengers: PassengerCounts;
};

export type FlightSegment = {
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  flightNumber: string;
  duration: number; // minutes
};

export type Flight = {
  id: string;
  price: number;
  currency: "BDT" | "USD";
  stops: number;
  outbound: FlightSegment[];
  inbound?: FlightSegment[];
};
