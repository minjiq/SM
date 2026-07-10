import { BellRing, BrainCog, CalendarClock, History, LayoutDashboard, ShieldCheck } from "lucide-react";
import { todaySummary } from "../../data/dashboard";

const TABS = [
  { key: "dashboard", label: "운영 대시보드", icon: LayoutDashboard },
  { key: "hitl", label: "예외 검수(HITL)", icon: ShieldCheck },
  { key: "history", label: "배부 이력조회", icon: History },
  { key: "alerts", label: "민원알림 센터", icon: BellRing },
  { key: "forecast", label: "민원 사전예보", icon: CalendarClock },
  { key: "learning", label: "AI 학습현황", icon: BrainCog },
];

export function AppShell({ active, onChange, children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="flex h-16 items-center gap-4 bg-white px-8 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF1FC]">
            <img src={`${import.meta.env.BASE_URL}logo-mark.svg`} alt="" className="h-[18px] w-[18px]" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">서울교통공사</div>
            <div className="text-[14px] font-bold text-[#0F172A]">AI 민원 자동배부</div>
          </div>
        </div>
        <span className="ml-2 text-[15px] font-bold text-[#0F172A]">민원 자동배부 대시보드</span>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-right text-[12px] leading-tight text-[#94A3B8]">
            <div>{todaySummary.updatedAt}</div>
            <div>자동 갱신 주기: {todaySummary.refreshCycleMin}분</div>
          </div>
          <div className="text-[12.5px] text-[#64748B]">
            관리자 <b className="font-semibold text-[#0F172A]">김서울</b> · 영업지원처
            <span className="mx-3 text-[#E2E8F0]">|</span>로그아웃
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="flex w-[204px] shrink-0 flex-col bg-[#17288B] py-5">
          <div className="mb-2 px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
            VOC 통합플랫폼
          </div>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className={`mx-3 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive ? "bg-white/14 font-semibold text-white" : "text-white/60 hover:bg-white/8 hover:text-white/90"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <main className="min-w-0 flex-1 px-8 py-8 pb-20">
          <div className="mx-auto w-full max-w-[1360px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
