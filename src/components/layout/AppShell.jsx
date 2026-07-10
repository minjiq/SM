import { CalendarClock, FileBarChart2, LayoutDashboard, ShieldCheck } from "lucide-react";

const TABS = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "hitl", label: "예외검수", icon: ShieldCheck },
  { key: "report", label: "월간리포트", icon: FileBarChart2 },
  { key: "forecast", label: "사전예보", icon: CalendarClock },
];

export function AppShell({ active, onChange, children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="flex w-[92px] shrink-0 flex-col items-center gap-1 bg-[#17288B] py-6">
        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="서울교통공사" className="mb-6 h-5 w-auto brightness-0 invert" />
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex w-[72px] flex-col items-center gap-1.5 rounded-[12px] py-3 text-[11px] font-medium transition-colors ${
                isActive ? "bg-white/12 font-semibold text-white" : "text-white/55 hover:bg-white/8 hover:text-white/85"
              }`}
            >
              <Icon className="h-[20px] w-[20px]" strokeWidth={1.75} />
              {tab.label}
            </button>
          );
        })}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center gap-8 bg-white px-8 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <span className="text-[13.5px] font-semibold text-[#0F172A]">AI 민원 자동배부 시스템</span>
          <nav className="flex gap-6 text-[13px] font-medium text-[#64748B]">
            <span>이용정보</span>
            <span>안전환경</span>
            <span>시민참여</span>
            <span>알림마당</span>
            <span>정보공개</span>
          </nav>
          <div className="ml-auto text-[12.5px] text-[#64748B]">
            관리자 <b className="font-semibold text-[#0F172A]">김서울</b> · 영업지원처
            <span className="mx-3 text-[#E2E8F0]">|</span>로그아웃
          </div>
        </div>

        <main className="mx-auto w-full max-w-[1360px] px-8 py-8 pb-20">{children}</main>
      </div>
    </div>
  );
}
