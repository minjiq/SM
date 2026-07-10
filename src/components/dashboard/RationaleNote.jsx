import { useState } from "react";
import { Lightbulb } from "lucide-react";

export function DesignIntent({ question, children, ids }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
          open ? "bg-[#E9ECFA] text-[#122590]" : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
        }`}
      >
        <Lightbulb className="h-3.5 w-3.5" />
        설계 의도
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[420px] overflow-hidden rounded-[16px] bg-[#101B4D] text-[#E2E8F0] shadow-[0_24px_48px_-16px_rgba(11,42,71,0.45)]">
            <div className="px-6 pb-4 pt-5">
              <span className="whitespace-nowrap rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold text-white">
                검증 질문
              </span>
              <p className="mt-3 text-[13px] font-medium leading-[1.6] text-white/90">{question}</p>
            </div>
            <div className="border-t border-white/10 px-6 pb-5 pt-3 text-[12.5px] leading-[1.8] text-white/70">
              {children}
              {ids ? <div className="mt-3 text-[11px] text-white/40">{ids}</div> : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
