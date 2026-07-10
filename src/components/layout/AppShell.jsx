const TABS = [
  { key: "dashboard", label: "자동배부 대시보드" },
  { key: "hitl", label: "HITL 예외 검수 (XAI)" },
  { key: "report", label: "경영진 월간 리포트" },
  { key: "forecast", label: "민원 사전 예보" },
];

export function AppShell({ active, onChange, children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex h-16 items-center gap-8 bg-white px-8 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="서울교통공사" className="h-6 w-auto shrink-0" />
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

      <div className="sticky top-0 z-40 flex h-14 items-center gap-1 bg-[#0B4171] px-8">
        <span className="mr-5 text-[13px] font-semibold text-white/60">AI 민원 자동배부 시스템</span>
        <nav className="flex h-full gap-1">
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex h-full items-center gap-2 rounded-t-[8px] px-4 text-[13.5px] font-medium transition-colors ${
                active === tab.key ? "bg-white/10 font-semibold text-white" : "text-white/55 hover:text-white/85"
              }`}
            >
              <span className="text-[11px] font-semibold tabular-nums opacity-70">{i + 1}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-[1360px] px-8 py-8 pb-20">{children}</main>
    </div>
  );
}
