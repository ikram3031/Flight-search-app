import { ChevronDown } from "lucide-react";
import logo from "../../assets/logo.png";

type NavItem = {
  label: string;
  hasDropdown?: boolean;
};

const navItems: NavItem[] = [
  { label: "Flight" },
  { label: "Hotel" },
  { label: "Transport", hasDropdown: true },
];

const Header = () => {
  return (
    <header className="w-full border-t-[6px] border-[#3f4654] bg-white shadow-sm">
      <div className="mx-auto flex h-[80px] max-w-[1240px] items-center justify-between px-4">
        <div className="flex items-center justify-between gap-12">
          <a href="/" className="flex items-center gap-2">
            {/* Logo */}
            <img
              src={logo}
              alt="ShareTrip"
              className="h-18 w-auto object-contain"
            />
          </a>

          <nav className="hidden items-center gap-8 lg:flex lg:justify-center w-[70vw] mx-auto">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-1 text-[15px] font-medium text-brand-accent transition-colors hover:text-brand-dark"
              >
                <span>{item.label}</span>
                {item.hasDropdown ? <ChevronDown className="h-4 w-4" /> : null}
              </button>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="rounded-full bg-brand-dark py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-[#155fcc px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
