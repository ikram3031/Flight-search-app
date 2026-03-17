import type { SearchPayload } from "../utils/types";
import FlightSearch from "./FlightSearch";

type Props = {
  onSearch: (payload: SearchPayload) => void;
};

const Home = ({ onSearch }: Props) => {
  return (
    <section className="bg-linear-to-b from-blue-100 to-white py-16 sm:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
          Search Flights <span className="text-blue-600">Worldwide</span>
        </h1>

        <p className="mt-4 text-sm sm:text-lg text-gray-600">
          Find the best deals on 500+ airlines across the globe with our
          real-time comparison engine.
        </p>

        <div className="mt-8 sm:mt-12">
          <FlightSearch onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
};

export default Home;
