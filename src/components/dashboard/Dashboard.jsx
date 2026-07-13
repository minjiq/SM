import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, ArrowUpDown, Bot, CalendarDays, Inbox, Info, Timer } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, Chip, KpiCard } from "../primitives";
import {
  aiProcessing,
  channelBreakdown,
  complaintComposition,
  complaintTypes,
  confidenceTiers,
  exceptionQueue,
  inflowByLine,
  lineNames,
  liveLogPool,
  orgNote,
  orgShare,
  orgTable,
  todaySummary,
  todoItems,
  urgentAlerts,
  weatherToday,
} from "../../data/dashboard";

const WEATHER_ICON_SRC = (name) => `${import.meta.env.BASE_URL}weather/${name}.svg`;
const STATUS_TONE = { 양호: "green", 주의: "amber", 점검: "red" };
const TODO_COUNT_TONE = { red: "text-[#DC2626]", amber: "text-[#B45309]", green: "text-[#059669]" };
const TODO_TEXT_TONE = { red: "text-[#DC2626]", amber: "text-[#B45309]", green: "text-[#059669]" };

function InflowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload[0]?.payload?.total;
  const auto = payload[0]?.payload?.auto;
  return (
    <div className="rounded-[12px] bg-white px-4 py-3 text-[12px] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)]">
      <div className="mb-1 font-semibold text-[#0F172A]">{label}</div>
      <div className="text-[#64748B]">
        총 유입 <b className="tabular-nums text-[#0F172A]">{total}</b>건 · 자동배부{" "}
        <b className="tabular-nums text-[#122590]">{auto}</b>건
      </div>
    </div>
  );
}

function SortableHeader({ children, align = "left" }) {
  return (
    <th className={`whitespace-nowrap pb-3 pr-3 text-${align} text-[11.5px] font-semibold text-[#94A3B8]`}>
      <span className="inline-flex cursor-pointer items-center gap-1 hover:text-[#64748B]">
        {children}
        <ArrowUpDown className="h-3 w-3 shrink-0" />
      </span>
    </th>
  );
}

function SubNavRow() {
  const [channel, setChannel] = useState("통합민원현황");
  const [period, setPeriod] = useState("오늘");
  const channels = ["통합민원현황", "고객센터", "고객의소리", "서울시응답소"];
  const periods = ["오늘", "주간", "월간", "연간"];

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        {channels.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            className={`rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-colors ${
              channel === c
                ? "bg-[#122590] text-white"
                : "bg-white text-[#64748B] shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] hover:text-[#0F172A]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex rounded-full border border-[#E2E8F0] bg-white p-0.5">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
                period === p ? "bg-[#122590] text-white" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-[12.5px] text-[#64748B]">
          <CalendarDays className="h-3.5 w-3.5" />
          2026.07.10
        </div>
      </div>
    </div>
  );
}

const TODO_DOT_COLOR = { red: "#DC2626", amber: "#F59E0B", green: "#10B981" };

function TodoLabel() {
  return (
    <div className="mb-2.5 text-[12px] font-semibold text-[#94A3B8]">지금 처리할 업무</div>
  );
}

function TodoStrip() {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-9 gap-y-3">
      {todoItems.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-center gap-2.5 text-[12.5px] ${i > 0 ? "border-l border-[#E2E8F0] pl-9" : ""}`}
        >
          <i className="h-2 w-2 shrink-0 rounded-full" style={{ background: TODO_DOT_COLOR[item.tone] }} />
          <span className="font-bold text-[#0F172A]">{item.label}</span>
          <span className={`text-[20px] font-extrabold tabular-nums leading-none ${TODO_COUNT_TONE[item.tone]}`}>
            {item.count}
            <span className="text-[12px] font-semibold">{item.unit}</span>
          </span>
          <span className="text-[11px] text-[#94A3B8]">{item.sub}</span>
          <button
            type="button"
            className={`text-[11.5px] font-bold transition-opacity hover:opacity-70 ${TODO_TEXT_TONE[item.tone]}`}
          >
            {item.action}
          </button>
        </div>
      ))}
    </div>
  );
}

function WeatherInline() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <img src={WEATHER_ICON_SRC(weatherToday.icon)} alt="" className="h-16 w-16 shrink-0 -my-2" />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[30px] font-extrabold leading-none tabular-nums text-[#0F172A]">{weatherToday.temp}°</span>
          <span className="text-[13px] font-semibold text-[#0F172A]">{weatherToday.headline}</span>
        </div>
        <div className="mt-1 text-[11.5px] text-[#64748B]">{weatherToday.impact}</div>
      </div>
      <div className="ml-2 flex items-center gap-3.5 border-l border-[#0F172A]/10 pl-5">
        {weatherToday.days.map((d) => (
          <div key={d.label} className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-[#94A3B8]">{d.label}</span>
            <img src={WEATHER_ICON_SRC(d.icon)} alt="" className="h-6 w-6" />
            <span className="text-[11px] font-semibold tabular-nums text-[#0F172A]">{d.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoTip({ text, align = "left" }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="설명 보기"
        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors ${
          open ? "bg-[#E9ECFA] text-[#122590]" : "text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#64748B]"
        }`}
      >
        <Info className="h-3 w-3" />
      </button>
      {open ? (
        <>
          <button type="button" aria-label="닫기" onClick={() => setOpen(false)} className="fixed inset-0 z-40 cursor-default" />
          <div
            className={`absolute top-[calc(100%+6px)] z-50 w-[230px] rounded-[10px] bg-[#101B4D] px-3.5 py-3 text-[11.5px] leading-[1.6] text-white/85 shadow-[0_16px_32px_-12px_rgba(11,42,71,0.5)] ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {text}
          </div>
        </>
      ) : null}
    </span>
  );
}

function FlowStep({ label, value, sub, tone, info }) {
  const valueClass = tone === "green" ? "text-[#2E7D32]" : tone === "muted" ? "text-[#64748B]" : "text-[#0F172A]";
  return (
    <div className="min-w-[150px]">
      <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-[#94A3B8]">
        {label}
        {info ? <InfoTip text={info} /> : null}
      </div>
      <div className={`whitespace-nowrap text-[22px] font-extrabold tabular-nums ${valueClass}`}>{value}</div>
      {sub ? <div className="mt-1 text-[10.5px] leading-[1.5] text-[#94A3B8]">{sub}</div> : null}
    </div>
  );
}

function ProcessingFlow() {
  const { total, autoComplete, exception, failed, unprocessed, avgWaitSec } = aiProcessing;

  return (
    <Card
      title={
        <>
          <img src={`${import.meta.env.BASE_URL}icons/gemini.svg`} alt="" className="h-4 w-4" />
          AI 처리 흐름
        </>
      }
      meta="각 상태별로 '무엇을 하면 되는지'가 함께 보이도록 구성"
      className="mb-6"
      style={{
        border: "1.5px solid transparent",
        backgroundImage:
          "linear-gradient(#fff, #fff), linear-gradient(120deg, #9DB0E6, #C6D0F1 45%, #E9ECFA)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="flex flex-wrap items-center gap-5">
        <FlowStep label="① 접수" value={`${total.toLocaleString()}건`} sub="3개 채널 통합 유입" />
        <ArrowRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
        <FlowStep
          label="② AI 분류 중 (미처리)"
          value={`${unprocessed}건`}
          sub={<>평균 {avgWaitSec}초 내 자동 소화<br /><span className="text-[#059669]">5분 초과 지연 0건 — 조치 불필요</span></>}
          tone="muted"
          info="완료·미처리 → 기다리면 됨. 미처리는 AI가 초 단위로 처리하는 대기열. 5분 초과 시에만 '지연'으로 상단에 경고."
        />
        <ArrowRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
        <FlowStep label="③ 자동배부 완료" value={`${autoComplete.toLocaleString()}건 (89.5%)`} sub="담당부서 자동 전달 완료 — 조치 불필요" tone="green" />
        <ArrowRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
        <div className="flex min-w-[240px] flex-1 flex-col gap-2">
          <div className="flex items-center gap-2.5 rounded-[8px] bg-[#FDFAF4] px-3 py-2 text-[12.5px] transition-colors hover:bg-[#FCF3E3]">
            <i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B45309]" />
            예외 검수 <b className="tabular-nums text-[#B45309]">{exception}건</b>
            <InfoTip text="예외 검수 → 사람이 판단. AI가 확신 못한 건. HITL 화면에서 승인/수정하면 AI가 재학습." align="right" />
            <button type="button" className="ml-auto shrink-0 rounded-[6px] bg-[#B45309] px-2.5 py-1 text-[11px] font-bold text-white transition-transform active:scale-[0.96]">
              HITL 검수 →
            </button>
          </div>
          <div className="flex items-center gap-2.5 rounded-[8px] bg-[#FDF6F6] px-3 py-2 text-[12.5px] transition-colors hover:bg-[#FBEAEA]">
            <i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#DC2626]" />
            배부 실패 <b className="tabular-nums text-[#DC2626]">{failed}건</b>
            <InfoTip text="배부 실패 → 사유 확인 후 조치. 담당부서 미매핑 9 · 신규유형 6 · 형식오류 3. [재처리] 클릭 시 자동 재시도." align="right" />
            <button type="button" className="ml-auto shrink-0 rounded-[6px] bg-[#DC2626] px-2.5 py-1 text-[11px] font-bold text-white transition-transform active:scale-[0.96]">
              재처리 →
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function OrgBars() {
  const rows = orgTable.filter((row) => row.org !== "계");
  return (
    <Card title="기관별 AI 배부처리 현황" meta="막대 = 처리결과 구성비 · 자동배부율 90% 미만 기관은 주의 표시">
      <div className="space-y-3">
        {rows.map((row) => {
          const pct = (n) => (n / row.total) * 100;
          return (
            <div key={row.org} className="flex items-center gap-3 text-[11.5px]">
              <span className="w-[52px] shrink-0 text-right font-bold text-[#0F172A]">{row.org}</span>
              <span className="w-[52px] shrink-0 text-[10.5px] text-[#94A3B8]">{row.total.toLocaleString()}건</span>
              <div className="flex h-5 flex-1 overflow-hidden rounded-[3px] border border-[#E2E8F0]">
                <div className="h-full bg-[#C8E0C9]" style={{ width: `${pct(row.auto)}%` }} title={`자동배부 ${row.auto}건`} />
                <div className="h-full bg-[#F0B070]" style={{ width: `${pct(row.exception)}%` }} title={`예외검수 ${row.exception}건`} />
                <div className="h-full bg-[#E08A8A]" style={{ width: `${pct(row.failed)}%` }} title={`실패 ${row.failed}건`} />
                <div className="h-full bg-[#DCDCDC]" style={{ width: `${pct(row.unprocessed)}%` }} title={`분류중 ${row.unprocessed}건`} />
              </div>
              <span className={`w-[52px] shrink-0 text-right text-[12.5px] font-extrabold ${row.rate < 90 ? "text-[#DC2626]" : "text-[#0F172A]"}`}>
                {row.rate.toFixed(1)}%
              </span>
              <span className="w-[44px] shrink-0 text-center">
                <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-[#64748B]">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#C8E0C9]" />자동배부</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#F0B070]" />예외검수</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#E08A8A]" />실패</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#DCDCDC]" />분류중</span>
      </div>
      <div className="mt-3 border-t border-dashed border-[#E2E8F0] pt-3 text-[11px] leading-[1.6] text-[#94A3B8]">
        ※ <span className="font-semibold text-[#DC2626]">냉난방</span>: {orgNote.replace(/^냉난방:\s*/, "")}
      </div>
    </Card>
  );
}

function OrgShareDonut() {
  return (
    <Card title="기관별 점유율" meta="대분류 기준 · 클릭 시 해당 기관 필터">
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie data={orgShare} dataKey="pct" nameKey="label" innerRadius={44} outerRadius={72} paddingAngle={1.5}>
            {orgShare.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}%`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] text-[#64748B]">
        {orgShare.map((entry) => (
          <span key={entry.label} className="flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: entry.color }} />
            {entry.label} <span className="tabular-nums">{entry.pct}%</span>
          </span>
        ))}
      </div>
    </Card>
  );
}

function ProportionBars({ title, meta, items, maxOf, footer }) {
  const max = maxOf ?? Math.max(...items.map((i) => i.count));
  return (
    <Card title={title} meta={meta}>
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
              <span className="font-medium text-[#0F172A]">{item.label}</span>
              <span className="flex items-center gap-2 tabular-nums text-[#64748B]">
                {item.count.toLocaleString()}건
                {item.delta ? (
                  <span
                    className={`font-semibold ${
                      item.tone === "hot" ? "text-[#DC2626]" : item.tone === "down" ? "text-[#059669]" : "text-[#94A3B8]"
                    }`}
                  >
                    {item.delta}
                  </span>
                ) : null}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#F1F5F9]">
              <div
                className={`h-2 rounded-full ${item.tone === "hot" ? "bg-[#DC2626]" : "bg-[#122590]"}`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {footer ? (
        <div className="mt-3.5 border-t border-dashed border-[#E2E8F0] pt-3 text-[11px] text-[#94A3B8]">{footer}</div>
      ) : null}
    </Card>
  );
}

const TIER_TEXT_TONE = { green: "text-[#2E7D32]", amber: "text-[#B45309]", red: "text-[#DC2626]" };
const TIER_BAR_COLOR = { green: "#C8E0C9", amber: "#F0B070", red: "#E08A8A" };
const TIER_BAR_TEXT = { green: "#1E4D20", amber: "#5C3A00", red: "#FFFFFF" };

function ConfidenceTiersCard() {
  return (
    <Card title="AI는 얼마나 확신하고 배부했나?" meta="확신도 = AI가 담당부서를 확신한 정도">
      <div className="flex h-[26px] overflow-hidden rounded-[6px] border border-[#94A3B8]/40">
        {confidenceTiers.map((t) => (
          <div
            key={t.key}
            className="flex items-center justify-center overflow-hidden whitespace-nowrap text-[10.5px] font-bold"
            style={{ width: `${t.pct}%`, background: TIER_BAR_COLOR[t.tone], color: TIER_BAR_TEXT[t.tone] }}
          >
            {t.pct >= 10 ? `${t.label.split(" ")[0]} ${t.count.toLocaleString()}건 (${t.pct}%)` : `${t.pct}%`}
          </div>
        ))}
      </div>
      <div className="mt-1">
        {confidenceTiers.map((t) => (
          <div key={t.key} className="flex items-center gap-3 border-t border-[#F1F5F9] py-3 text-[12px] first:border-t-0">
            <span className="w-[150px] shrink-0 text-[12.5px] font-extrabold">
              {t.emoji} <span className={TIER_TEXT_TONE[t.tone]}>{t.label}</span>
            </span>
            <span className="w-[68px] shrink-0 text-[16px] font-extrabold tabular-nums text-[#0F172A]">
              {t.count.toLocaleString()}건
            </span>
            <span className="text-[#64748B]">{t.desc}</span>
          </div>
        ))}
      </div>
      <div className="mt-3.5 rounded-[10px] bg-[#F8FAFC] px-4 py-3 text-[12px] leading-[1.7] text-[#0F172A]">
        ※ 요약: AI가 <b>100건 중 92건은 확신</b>하고 배부했고, 확신 못한 <b>2건만 사람이 검수</b>하면 됩니다.
      </div>
    </Card>
  );
}

function UrgentAlertsCard() {
  const pinned = urgentAlerts.filter((a) => a.pinned);
  const rest = urgentAlerts.filter((a) => !a.pinned);
  const toneBox = { red: "border-[#DC2626] bg-[#FEF2F2]", amber: "border-[#F59E0B]/40 bg-white", blue: "border-[#122590]/30 bg-white" };
  const toneDot = { red: "#DC2626", amber: "#F59E0B", blue: "#122590" };
  const toneBadge = { amber: "amber", blue: "blue" };

  return (
    <Card title="긴급 민원 알림" meta="긴급은 상단 고정 · 나머지는 스크롤 · 전체 이력은 '민원알림 센터'에서 조회">
      <div className="space-y-2.5">
        {pinned.map((a, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 text-[13px] ${toneBox[a.tone]}`}
          >
            <i className="h-2 w-2 shrink-0 rounded-full" style={{ background: toneDot[a.tone] }} />
            <span className="text-[#0F172A]">{a.text}</span>
            <button
              type="button"
              className="ml-auto shrink-0 rounded-[8px] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0F172A] shadow-[0_1px_2px_0_rgba(15,23,42,0.1)] transition-transform active:scale-[0.97]"
            >
              {a.action}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 max-h-[230px] space-y-1 overflow-y-auto pr-1">
        {rest.map((a, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[12.5px] transition-colors hover:bg-[#F8FAFC]">
            <Badge tone={toneBadge[a.tone]}>{a.tone === "amber" ? "주의" : "정보"}</Badge>
            <span className="text-[#0F172A]">{a.text}</span>
            {a.meta ? <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] text-[#64748B]">{a.meta}</span> : null}
            <span className="ml-auto shrink-0 text-[11.5px] font-medium text-[#64748B]">{a.action}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FooterNote() {
  return (
    <div className="mt-6 rounded-[12px] bg-white px-6 py-4 text-[11.5px] leading-[1.8] text-[#94A3B8] shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
      ※ 연계 시스템: AI 챗봇 「또타24」 · 타기관 민원 실시간 이첩 시스템 · 기상청 예보 API · 행사일정 DB &nbsp;|&nbsp; 분석
      데이터는 경영 인사이트 리포트로 정기 제공
    </div>
  );
}

function InflowChart({ line, onLineChange }) {
  const data = inflowByLine[line];
  return (
    <Card
      title={
        <>
          실시간 접수 Timeline <Badge tone="gray">총 유입 vs 자동배부 완료</Badge>
        </>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {lineNames.map((name) => (
          <Chip key={name} active={line === name} onClick={() => onLineChange(name)}>
            {name}
          </Chip>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 18, right: 4, left: -20, bottom: 0 }} barCategoryGap={12}>
          <XAxis dataKey="hour" tick={{ fontSize: 10.5, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<InflowTooltip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="total" stackId="a" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
          <Bar dataKey="auto" stackId="b" fill="#122590" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex gap-5 text-[11.5px] font-medium text-[#64748B]">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#E2E8F0]" />총 유입</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#122590]" />자동배부 완료</span>
      </div>
    </Card>
  );
}

function ExceptionQueueCard() {
  return (
    <Card
      title={
        <>
          예외 큐 — 영향도 우선 정렬 <Badge tone="gray">클릭 시 검수 화면 이동</Badge>
        </>
      }
    >
      <table className="w-full border-separate border-spacing-0 text-[13px]">
        <thead>
          <tr className="text-left">
            <SortableHeader>우선</SortableHeader>
            <th className="whitespace-nowrap pb-3 pr-3 text-left text-[11.5px] font-semibold text-[#94A3B8]">민원 요약</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-left text-[11.5px] font-semibold text-[#94A3B8]">플래그</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-left text-[11.5px] font-semibold text-[#94A3B8]">AI 1순위</th>
            <SortableHeader>신뢰도</SortableHeader>
            <SortableHeader>기한</SortableHeader>
          </tr>
        </thead>
        <tbody>
          {exceptionQueue.map((row) => (
            <tr key={row.priority} className="cursor-pointer transition-colors hover:bg-[#F8FAFC]">
              <td className="border-t border-[#F1F5F9] py-4 pr-3 font-semibold tabular-nums text-[#0F172A]">{row.priority}</td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3 text-[#0F172A]">{row.summary}</td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3">
                <div className="flex flex-wrap gap-1.5">
                  {row.flags.map((flag) => (
                    <Badge key={flag.label} tone={flag.tone}>{flag.label}</Badge>
                  ))}
                </div>
              </td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3 text-[#0F172A]">{row.dept}</td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3 tabular-nums text-[#0F172A]">{row.confidence}%</td>
              <td
                className={`border-t border-[#F1F5F9] py-4 font-bold tabular-nums ${
                  row.hot ? "text-[#DC2626]" : "text-[#0F172A]"
                }`}
              >
                {row.due}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function randomLogEntry(id) {
  const pick = liveLogPool[Math.floor(Math.random() * liveLogPool.length)];
  return { id, channel: pick[0], dept: pick[1], confidence: pick[2] };
}

function LiveLogCard({ threshold }) {
  const nextId = useRef(88220);
  const [rows, setRows] = useState(() => {
    const seed = [];
    for (let i = 0; i < 6; i++) seed.push(randomLogEntry(88214 + i));
    return seed;
  });
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const addTimer = setInterval(() => {
      const entry = randomLogEntry(nextId.current++);
      setRows((prev) => [entry, ...prev].slice(0, 7));
      setSecondsAgo(0);
    }, 7000);
    const tickTimer = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => {
      clearInterval(addTimer);
      clearInterval(tickTimer);
    };
  }, []);

  return (
    <Card
      title={
        <>
          <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />
          실시간 배부 로그
        </>
      }
      action={
        <span className="text-[12px] text-[#94A3B8]">
          {secondsAgo === 0 ? "방금 갱신" : `최근 갱신 ${secondsAgo}초 전`}
        </span>
      }
    >
      <table className="w-full border-separate border-spacing-0 text-[13px]">
        <thead>
          <tr className="text-left">
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">민원ID</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">채널</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">AI 분류부서</th>
            <SortableHeader>신뢰도</SortableHeader>
            <th className="whitespace-nowrap pb-3 text-[11.5px] font-semibold text-[#94A3B8]">상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-[#F8FAFC]">
              <td className="border-t border-[#F1F5F9] py-4 pr-3 tabular-nums text-[#0F172A]">#CX-{row.id}</td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3 text-[#0F172A]">{row.channel}</td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3 text-[#0F172A]">{row.dept}</td>
              <td className="border-t border-[#F1F5F9] py-4 pr-3 tabular-nums text-[#0F172A]">{row.confidence}%</td>
              <td className="border-t border-[#F1F5F9] py-4">
                {row.confidence >= threshold ? <Badge tone="green">자동배부</Badge> : <Badge tone="amber">예외 큐</Badge>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const AUTO_DISPATCH_THRESHOLD = 85;

export function Dashboard() {
  const [line, setLine] = useState("전체");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[#0F172A]">자동배부 대시보드</h1>
        <WeatherInline />
      </div>

      <SubNavRow />
      <TodoLabel />
      <TodoStrip />

      <div className="mb-6 flex items-center gap-4 rounded-[16px] bg-[#FEF2F2] px-6 py-4 text-[13.5px] shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[#DC2626]" />
        <span className="text-[#0F172A]">
          예외 큐 잔량이 임계치(20건)를 초과했습니다. 현재 <b className="tabular-nums text-[#DC2626]">27건</b> 대기 중 — 안전
          플래그 1건 · 법정기한 임박 2건 포함
        </span>
        <button
          type="button"
          className="ml-auto shrink-0 rounded-[10px] border border-[#DC2626] px-4 py-2.5 text-[13px] font-semibold text-[#DC2626] transition-all hover:bg-[#DC2626] hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]/40 focus-visible:ring-offset-2"
        >
          예외 검수 화면 바로가기 →
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-5">
        <KpiCard
          label="오늘 접수"
          icon={<Inbox className="h-[18px] w-[18px]" />}
          iconTone="primary"
          value={todaySummary.receivedToday.toLocaleString()}
          unit="건"
          delta={`▲ 전일 대비 +${todaySummary.receivedDeltaPct}%`}
        />
        <KpiCard
          label="AI 자동배부율"
          icon={<Bot className="h-[18px] w-[18px]" />}
          iconTone="primary"
          value={`${todaySummary.autoRate}%`}
          note="● 목표 95% 달성"
        />
        <KpiCard
          label="평균 배부시간"
          icon={<Timer className="h-[18px] w-[18px]" />}
          iconTone="primary"
          value={`${todaySummary.avgDispatchSec}초`}
          note={`● 전주 대비 ${todaySummary.avgDispatchDeltaSec}초`}
        />
      </div>

      <ProcessingFlow />

      <div className="mb-6 grid grid-cols-[1.5fr_1fr] gap-5">
        <OrgBars />
        <OrgShareDonut />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-5">
        <ProportionBars title="채널별 민원 현황" meta="3개 접수경로 통합 DB 기준" items={channelBreakdown} />
        <ProportionBars
          title="민원 유형별 현황 (상위)"
          meta="급증 유형은 적색 표시"
          items={complaintTypes}
          footer={complaintComposition}
        />
      </div>

      <div className="mb-6 grid grid-cols-[1.35fr_1fr] gap-5">
        <InflowChart line={line} onLineChange={setLine} />
        <ConfidenceTiersCard />
      </div>

      <div className="mb-6 grid grid-cols-[1.2fr_1fr] gap-5">
        <ExceptionQueueCard />
        <LiveLogCard threshold={AUTO_DISPATCH_THRESHOLD} />
      </div>

      <UrgentAlertsCard />

      <FooterNote />
    </div>
  );
}
