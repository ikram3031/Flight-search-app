// src/services/flightApi.ts

import axios from "axios";
import type { Flight, SearchParams } from "../types/flight";

const BASE_URL = "http://localhost:3001";

export const searchFlights = async (
  params: SearchParams,
): Promise<Flight[]> => {
  const response = await axios.get<Flight[]>(`${BASE_URL}/flights`, {
    params: {
      from: params.from,
      to: params.to,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      tripType: params.tripType,
      adults: params.passengers.adults,
      children: params.passengers.children,
      infants: params.passengers.infants,
    },
  });

  return response.data;
};
