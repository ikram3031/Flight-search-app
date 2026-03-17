import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import Header from "./components/layout/Header";

const App = () => {
  /*   const [view, setView] = useState<View>("HOME");
  const [searchParams, setSearchParams] = useState<SearchPayload | null>(null); */

  return (
    // <>
    //   <Toaster position="top-right" richColors />
    //   <div className="min-h-screen bg-gray-50">
    //     {/* Navbar */}
    //     <header className="w-full h-16 bg-white text-black flex items-center justify-center px-4 border-b border-gray-200">
    //       <div className="text-2xl font-bold">FLYNEXT</div>
    //     </header>
    //     {view === "HOME" && (
    //       <Home
    //         onSearch={(payload) => {
    //           setSearchParams(payload);
    //           setView("RESULTS");
    //         }}
    //       />
    //     )}
    //     {view === "RESULTS" && (
    //       <Results
    //         // visible={view === "RESULTS"}
    //         searchParams={searchParams}
    //         onBack={() => setView("HOME")}
    //       />
    //     )}
    //   </div>
    // </>
    <>
      <Toaster position="top-right" richColors />
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
