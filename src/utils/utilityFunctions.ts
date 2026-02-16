export const formatTime = (time24?: string): string => {
  if (!time24) return "";

  const [hourStr, minuteStr] = time24.split(":");

  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (isNaN(hour) || isNaN(minute)) return time24;

  const period = hour >= 12 ? "PM" : "AM";

  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minuteStr} ${period}`;
};
