import { useState } from "react";
import { Toaster } from "sonner";
import Home from "./components/Home";
import "react-datepicker/dist/react-datepicker.css";
import Results from "./components/Results";
import type { SearchPayload } from "./utils/types";

type View = "HOME" | "RESULTS";

function App() {
  const [view, setView] = useState<View>("HOME");
  const [searchParams, setSearchParams] = useState<SearchPayload | null>(null);

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <header className="w-full h-16 bg-white text-black flex items-center justify-center px-4 border-b border-gray-200">
          <div className="text-2xl font-bold">FLYNEXT</div>
        </header>
        {view === "HOME" && (
          <Home
            onSearch={(payload) => {
              setSearchParams(payload);
              setView("RESULTS");
            }}
          />
        )}
        {view === "RESULTS" && (
          <Results
            // visible={view === "RESULTS"}
            searchParams={searchParams}
            onBack={() => setView("HOME")}
          />
        )}
      </div>
    </>
  );
}

export default App;
