export type SearchPayload = {
  tripType: "round" | "oneWay";
  from: string;
  to: string;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: "Economy" | "Business" | "First";
};
