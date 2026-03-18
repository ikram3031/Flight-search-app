import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export type TripType = "round" | "oneWay";

export type FlightDatePickerChange = {
  departureDate: Date | null;
  returnDate: Date | null;
};

export type FlightDatePickerProps = {
  tripType: TripType;
  departureDate: Date | null;
  returnDate: Date | null;
  onChange: (dates: FlightDatePickerChange) => void;
};

const FlightDatePicker = ({
  tripType,
  departureDate,
  returnDate,
  onChange,
}: FlightDatePickerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const selected = useMemo((): DateRange | undefined => {
    if (!departureDate) return undefined;

    return {
      from: departureDate,
      to: tripType === "round" ? (returnDate ?? undefined) : departureDate,
    };
  }, [departureDate, returnDate, tripType]);

  const label = useMemo(() => {
    if (!departureDate) return "Select dates";

    if (tripType === "oneWay") {
      return format(departureDate, "dd MMM yyyy");
    }

    if (departureDate && returnDate) {
      return `${format(departureDate, "dd MMM")} - ${format(returnDate, "dd MMM")}`;
    }

    return `${format(departureDate, "dd MMM")} - Return`;
  }, [departureDate, returnDate, tripType]);

  const handleSelect = (range: DateRange | undefined): void => {
    if (!range?.from) {
      onChange({
        departureDate: null,
        returnDate: null,
      });
      return;
    }

    if (tripType === "oneWay") {
      onChange({
        departureDate: range.from,
        returnDate: null,
      });
      setOpen(false);
      return;
    }

    const hasRealReturn =
      range.from && range.to && range.from.getTime() !== range.to.getTime();

    onChange({
      departureDate: range.from,
      returnDate: hasRealReturn ? (range.to ?? null) : null,
    });

    if (hasRealReturn) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (tripType === "oneWay" && returnDate) {
      onChange({
        departureDate,
        returnDate: null,
      });
    }
  }, [tripType]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="text-slate-400" size={18} />

          <div>
            <p className="text-xs text-slate-500">
              {tripType === "oneWay" ? "Departure" : "Departure & Return"}
            </p>

            <p className="text-sm font-semibold text-slate-800">{label}</p>
          </div>
        </div>

        <ChevronDown size={16} />
      </button>

      {/* Calendar */}
      {open && (
        <div className="absolute z-50 mt-2 rounded-xl border bg-white p-4 shadow-lg">
          {tripType === "oneWay" ? (
            <DayPicker
              mode="single"
              selected={departureDate ?? undefined}
              onSelect={(date) => {
                onChange({
                  departureDate: date ?? null,
                  returnDate: null,
                });

                if (date) {
                  setOpen(false);
                }
              }}
              numberOfMonths={2}
              disabled={{ before: today }}
              classNames={{
                day: "h-10 w-10 rounded-md hover:bg-slate-200",
                day_selected: "bg-blue-600 text-white",
                day_today: "border border-blue-300",
              }}
            />
          ) : (
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={(range) => {
                if (!range?.from) {
                  onChange({
                    departureDate: null,
                    returnDate: null,
                  });
                  return;
                }

                const hasRealReturn =
                  !!range.to && range.from.getTime() !== range.to.getTime();

                onChange({
                  departureDate: range.from,
                  returnDate: hasRealReturn ? (range.to ?? null) : null,
                });

                if (hasRealReturn) {
                  setOpen(false);
                }
              }}
              numberOfMonths={2}
              disabled={{ before: today }}
              min={2}
              classNames={{
                day: "h-10 w-10 rounded-md hover:bg-slate-200",
                day_selected: "bg-blue-600 text-white",
                day_range_start: "bg-blue-600 text-white",
                day_range_end: "bg-blue-600 text-white",
                day_range_middle: "bg-blue-100",
                day_today: "border border-blue-300",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FlightDatePicker;
