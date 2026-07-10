export const color = {
  primary: "#0B4171",
  primaryHover: "#0D4D85",
  primarySoft: "#EAF1F8",
  accent: "#2563EB",
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
  blue: "bg-[#EAF1F8] text-[#0B4171]",
  gray: "bg-[#F1F5F9] text-[#64748B]",
};

export const chartPalette = {
  primary: "#0B4171",
  accent: "#2563EB",
  track: "#E2E8F0",
  danger: "#EF4444",
  ink: "#0F172A",
};

export function confidenceTone(value) {
  if (value >= 80) return "green";
  if (value >= 60) return "amber";
  return "red";
}
