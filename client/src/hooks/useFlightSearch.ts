// src/hooks/useFlightSearch.ts

import { useEffect, useState } from "react";
import type { Flight, SearchParams } from "../types/flight";
import { searchFlights } from "../services/flightApi";

type State = {
  data: Flight[];
  loading: boolean;
  error: string | null;
};

export const useFlightSearch = (params: SearchParams | null) => {
  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!params) return;

    const fetchFlights = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const data = await searchFlights(params);

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          data: [],
          loading: false,
          error: "Something went wrong",
        });
      }
    };

    fetchFlights();
  }, [params]);

  return state;
};
