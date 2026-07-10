import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./components/dashboard/Dashboard";

const COMING_SOON = {
  hitl: "HITL 예외 검수 (XAI)",
  report: "경영진 월간 리포트",
  forecast: "민원 사전 예보",
};

export default function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <AppShell active={tab} onChange={setTab}>
      {tab === "dashboard" ? (
        <Dashboard />
      ) : (
        <div className="flex h-[420px] items-center justify-center rounded-[20px] bg-white text-[14px] text-[#94A3B8] shadow-[0_1px_3px_0_rgba(15,23,42,0.06)]">
          {COMING_SOON[tab]} 화면은 다음 순서로 디자인 예정입니다.
        </div>
      )}
    </AppShell>
  );
}
