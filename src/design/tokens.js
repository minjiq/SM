export const color = {
  primary: "#17288B",
  primaryHover: "#1F3AA6",
  primarySoft: "#E9ECFA",
  primaryMuted: "#1E2A47",
  ink: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
};

// Monochrome navy scale for charts that need several segments (e.g. share
// donuts) without reaching for unrelated hues.
export const navyScale = ["#17288B", "#2C3FA0", "#4A5FBC", "#7189D6", "#9DB0E6", "#C6D0F1", "#E2E8F0"];

export const badgeTone = {
  red: "bg-[#FEF2F2] text-[#DC2626]",
  amber: "bg-[#FFFBEB] text-[#B45309]",
  green: "bg-[#ECFDF5] text-[#059669]",
  blue: "bg-[#E9ECFA] text-[#17288B]",
  gray: "bg-[#F1F5F9] text-[#64748B]",
};

export const chartPalette = {
  primary: "#17288B",
  track: "#E2E8F0",
  danger: "#EF4444",
  ink: "#0F172A",
};

export function confidenceTone(value) {
  if (value >= 80) return "green";
  if (value >= 60) return "amber";
  return "red";
}
