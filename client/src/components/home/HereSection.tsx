import heroVideo from "../../assets/hero-bg.mp4";
import BookingTabs from "./BookingTabs";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-[60vh] object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Overlay*/}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔥 Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-white text-4xl font-bold mb-6">
          Book Flights & Hotels Easily
        </h1>

        {/* Search Box */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
          <BookingTabs />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
