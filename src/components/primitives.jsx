import { badgeTone } from "../design/tokens";

export function Card({ title, meta, action, children, className = "", padding = "p-8" }) {
  return (
    <section
      className={`rounded-[20px] bg-white ${padding} shadow-[0_1px_3px_0_rgba(15,23,42,0.06),0_1px_2px_-1px_rgba(15,23,42,0.04)] ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h3 className="flex flex-wrap items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] text-[#64748B]">
                {title}
              </h3>
            ) : null}
            {meta ? <p className="mt-1 text-[12px] text-[#94A3B8]">{meta}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Badge({ tone = "gray", children }) {
  return (
    <span
      className={`inline-flex h-[24px] items-center rounded-full px-3 text-[11.5px] font-semibold tracking-[-0.01em] ${
        badgeTone[tone] || badgeTone.gray
      }`}
    >
      {children}
    </span>
  );
}

export function Chip({ active, children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-[7px] text-[12.5px] font-semibold transition-all active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17288B]/30 focus-visible:ring-offset-2 ${
        active
          ? "bg-[#17288B] text-white"
          : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconChip({ tone = "primary", children }) {
  const toneClass =
    tone === "danger"
      ? "bg-[#FEF2F2] text-[#DC2626]"
      : tone === "accent"
      ? "bg-[#EEF1FC] text-[#3B54D9]"
      : "bg-[#E9ECFA] text-[#17288B]";
  return <div className={`grid h-10 w-10 place-items-center rounded-[12px] ${toneClass}`}>{children}</div>;
}

export function KpiCard({ label, icon, iconTone, value, unit, delta, deltaTone = "up", note, valueColor }) {
  return (
    <Card padding="p-7">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#64748B]">{label}</span>
        {icon ? <IconChip tone={iconTone}>{icon}</IconChip> : null}
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span
          className="font-variant-tabular tabular-nums text-[32px] font-bold leading-none tracking-[-0.02em]"
          style={{ color: valueColor || "#0F172A" }}
        >
          {value}
        </span>
        {unit ? <span className="text-[13px] font-medium text-[#94A3B8]">{unit}</span> : null}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[12.5px]">
        {delta ? (
          <span className={`font-semibold ${deltaTone === "up" ? "text-[#DC2626]" : "text-[#059669]"}`}>{delta}</span>
        ) : null}
        {note ? <span className="text-[#94A3B8]">{note}</span> : null}
      </div>
    </Card>
  );
}
