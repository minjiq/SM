export const color = {
  primary: "#17288B",
  primaryHover: "#1F3AA6",
  primarySoft: "#E9ECFA",
  accent: "#3B54D9",
  ink: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
};

export const badgeTone = {
  red: "bg-[#FEF2F2] text-[#DC2626]",
  amber: "bg-[#FFFBEB] text-[#B45309]",
  green: "bg-[#ECFDF5] text-[#059669]",
  blue: "bg-[#E9ECFA] text-[#17288B]",
  gray: "bg-[#F1F5F9] text-[#64748B]",
};

export const chartPalette = {
  primary: "#17288B",
  accent: "#3B54D9",
  track: "#E2E8F0",
  danger: "#EF4444",
  ink: "#0F172A",
};

export function confidenceTone(value) {
  if (value >= 80) return "green";
  if (value >= 60) return "amber";
  return "red";
}
