import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  Bot,
  Cloud,
  CloudRain,
  Inbox,
  SearchCheck,
  Sun,
  Timer,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Card, Chip, IconChip, KpiCard } from "../primitives";
import { DesignIntent } from "./RationaleNote";
import {
  aiProcessing,
  channelBreakdown,
  complaintTypes,
  confidenceBuckets,
  confidenceHistogram,
  confidenceTotal,
  exceptionQueue,
  inflowByLine,
  lineNames,
  liveLogPool,
  orgShare,
  orgTable,
  todaySummary,
  urgentAlerts,
  weatherToday,
} from "../../data/dashboard";

const WEATHER_ICON = { sun: Sun, rain: CloudRain, cloud: Cloud };
const STATUS_TONE = { 양호: "green", 주의: "amber", 점검: "red" };

function InflowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload[0]?.payload?.total;
  const auto = payload[0]?.payload?.auto;
  return (
    <div className="rounded-[12px] bg-white px-4 py-3 text-[12px] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)]">
      <div className="mb-1 font-semibold text-[#0F172A]">{label}</div>
      <div className="text-[#64748B]">
        총 유입 <b className="tabular-nums text-[#0F172A]">{total}</b>건 · 자동배부{" "}
        <b className="tabular-nums text-[#17288B]">{auto}</b>건
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
  const channels = ["통합민원현황", "고객센터", "고객의소리", "서울시응답소"];

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
                ? "bg-[#17288B] text-white"
                : "bg-white text-[#64748B] shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] hover:text-[#0F172A]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex gap-2 text-[13px] font-medium text-[#64748B]">
        {["2026", "7월", "전체"].map((v) => (
          <select
            key={v}
            defaultValue={v}
            className="rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17288B]/30"
          >
            <option>{v}</option>
          </select>
        ))}
      </div>
    </div>
  );
}

function LegendRow() {
  const items = [
    { color: "#DC2626", label: "긴급/위험 — 즉시 조치" },
    { color: "#F59E0B", label: "주의 — 모니터링 강화" },
    { color: "#17288B", label: "정보 — 참고" },
    { color: "#10B981", label: "양호 — 정상 운영" },
  ];
  return (
    <div className="mb-5 flex flex-wrap items-center gap-5 text-[12px] text-[#64748B]">
      <span className="font-semibold text-[#94A3B8]">중요도 표시:</span>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function WeatherKpi() {
  return (
    <Card padding="p-7">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#64748B]">오늘의 기상 연계</span>
        <IconChip tone="amber">
          <Sun className="h-[18px] w-[18px]" />
        </IconChip>
      </div>
      <div className="mt-4 text-[15px] font-bold leading-tight text-[#0F172A]">{weatherToday.headline}</div>
      <div className="mt-1 text-[11.5px] leading-snug text-[#64748B]">{weatherToday.impact}</div>
      <div className="mt-3.5 grid grid-cols-4 gap-1.5">
        {weatherToday.days.map((d) => {
          const Icon = WEATHER_ICON[d.icon];
          return (
            <div key={d.label} className="flex flex-col items-center gap-1 rounded-[10px] bg-[#F8FAFC] py-2">
              <span className="text-[10px] text-[#94A3B8]">{d.label}</span>
              <Icon className="h-3.5 w-3.5 text-[#B45309]" />
              <span className="tabular-nums text-[11.5px] font-semibold text-[#0F172A]">{d.temp}°</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ProcessingBar() {
  const { total, autoComplete, exception, failed, unprocessed, avgWaitSec } = aiProcessing;
  const pct = (n) => (n / total) * 100;
  const segments = [
    { key: "auto", value: autoComplete, color: "#10B981", label: `자동배부 완료 ${autoComplete.toLocaleString()}건 (${pct(autoComplete).toFixed(1)}%)` },
    { key: "exception", value: exception, color: "#F59E0B" },
    { key: "failed", value: failed, color: "#DC2626" },
    { key: "unprocessed", value: unprocessed, color: "#CBD5E1", label: `미처리 ${unprocessed}건` },
  ];
  const legend = [
    { color: "#10B981", text: `자동배부 완료 ${autoComplete.toLocaleString()}건 (양호)` },
    { color: "#F59E0B", text: `예외 검수 ${exception}건 (주의) → HITL 화면으로 이동` },
    { color: "#DC2626", text: `배부 실패 ${failed}건 (재처리 필요)` },
    { color: "#CBD5E1", text: `미처리(분류 대기) ${unprocessed}건 — 평균 대기 ${avgWaitSec}초` },
  ];

  return (
    <Card
      title="AI 처리 현황"
      meta={`접수 ${total.toLocaleString()}건 = 자동배부 + 예외검수 + 실패 + 미처리 · 5분 단위 갱신`}
      className="mb-6"
    >
      <div className="flex h-9 w-full overflow-hidden rounded-[8px] bg-[#F1F5F9]">
        {segments.map((seg) => (
          <div
            key={seg.key}
            title={seg.label || `${seg.value}건`}
            className="flex items-center justify-center overflow-hidden whitespace-nowrap text-[12px] font-bold text-white"
            style={{ width: `${pct(seg.value)}%`, background: seg.color }}
          >
            {pct(seg.value) > 8 ? seg.label : null}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#64748B]">
        {legend.map((l) => (
          <span key={l.text} className="flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: l.color }} />
            {l.text}
          </span>
        ))}
      </div>
    </Card>
  );
}

function OrgTable() {
  return (
    <Card title="기관별 AI 배부처리 건수 현황" meta="자동배부율 90% 미만 기관은 주의 표시">
      <table className="w-full border-separate border-spacing-0 text-[12.5px]">
        <thead>
          <tr className="text-left">
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">기관</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">계</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">AI 자동배부</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">예외검수</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">배부실패</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">미처리</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">자동배부율</th>
            <th className="whitespace-nowrap pb-3 text-[11.5px] font-semibold text-[#94A3B8]">상태</th>
          </tr>
        </thead>
        <tbody>
          {orgTable.map((row) => (
            <tr key={row.org} className={row.org === "계" ? "bg-[#F8FAFC] font-semibold" : "hover:bg-[#F8FAFC]"}>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-[#0F172A]">{row.org}</td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums text-[#0F172A]">{row.total.toLocaleString()}</td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums text-[#0F172A]">{row.auto.toLocaleString()}</td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums text-[#0F172A]">{row.exception}</td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums text-[#0F172A]">{row.failed}</td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums text-[#0F172A]">{row.unprocessed}</td>
              <td
                className={`border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums font-semibold ${
                  row.rate < 90 ? "text-[#DC2626]" : "text-[#0F172A]"
                }`}
              >
                {row.rate.toFixed(1)}%
              </td>
              <td className="border-t border-[#F1F5F9] py-3">
                <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

function ProportionBars({ title, meta, items, maxOf }) {
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
                className={`h-2 rounded-full ${item.tone === "hot" ? "bg-[#DC2626]" : "bg-[#17288B]"}`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ConfidenceBucketsCard() {
  const max = Math.max(...confidenceBuckets.map((b) => b.count));
  const barColor = { green: "#10B981", amber: "#F59E0B", red: "#DC2626" };
  return (
    <Card title="신뢰도 구간별 건수 현황" meta="낮은 구간은 클릭하면 검수로 이동">
      <div className="space-y-3.5">
        {confidenceBuckets.map((b) => (
          <div key={b.label}>
            <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
              <span className="font-medium text-[#0F172A]">{b.label}</span>
              <span className="tabular-nums text-[#64748B]">
                {b.count.toLocaleString()}건{" "}
                {b.note ? <span className="font-semibold text-[#DC2626]">{b.note}</span> : null}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#F1F5F9]">
              <div
                className="h-2 rounded-full"
                style={{ width: `${(b.count / max) * 100}%`, background: barColor[b.tone] }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UrgentAlertsCard() {
  const pinned = urgentAlerts.filter((a) => a.pinned);
  const rest = urgentAlerts.filter((a) => !a.pinned);
  const toneBox = { red: "border-[#DC2626] bg-[#FEF2F2]", amber: "border-[#F59E0B]/40 bg-white", blue: "border-[#17288B]/30 bg-white" };
  const toneDot = { red: "#DC2626", amber: "#F59E0B", blue: "#17288B" };
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
      연계 시스템: AI 챗봇 「또타24」(24시간 응대) · 타기관 민원 실시간 이첩 시스템 · 기상청 예보 API(특보·기온·강수) · 행사일정 DB
      <br />
      분석 데이터는 경영진 리포트·뉴스레터 형태로 시각화되어 정기 제공됩니다 (→ 경영진 월간 인사이트 화면 연계)
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
          <Bar dataKey="auto" stackId="b" fill="#17288B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex gap-5 text-[11.5px] font-medium text-[#64748B]">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#E2E8F0]" />총 유입</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#17288B]" />자동배부 완료</span>
      </div>
    </Card>
  );
}

function ConfidenceCard({ threshold, onThreshold }) {
  const stats = useMemo(() => {
    let auto = 0;
    let total = 0;
    confidenceHistogram.forEach(({ bin, count }) => {
      total += count;
      if (bin >= threshold) auto += count;
    });
    const autoN = Math.round((auto / total) * confidenceTotal);
    return { autoN, queueN: confidenceTotal - autoN, pct: Math.round((autoN / confidenceTotal) * 100) };
  }, [threshold]);

  const nearestBin = confidenceHistogram.reduce((best, cur) =>
    Math.abs(cur.bin - threshold) < Math.abs(best.bin - threshold) ? cur : best
  );

  return (
    <Card
      title={
        <>
          신뢰도 분포 · 자동배부 임계값 <Badge tone="gray">정책 시뮬레이션</Badge>
        </>
      }
    >
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={confidenceHistogram} margin={{ top: 16, right: 4, left: -30, bottom: 0 }} barCategoryGap={5}>
          <XAxis dataKey="bin" hide />
          <YAxis hide />
          <ReferenceLine
            x={nearestBin.bin}
            stroke="#EF4444"
            strokeWidth={2}
            label={{ value: `임계값 ${threshold}%`, position: "top", fontSize: 10.5, fill: "#EF4444", fontWeight: 700 }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {confidenceHistogram.map((entry) => (
              <Cell key={entry.bin} fill={entry.bin >= threshold ? "#17288B" : "#E2E8F0"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 flex items-center gap-3 text-[12px] text-[#64748B]">
        임계값
        <input
          type="range"
          min={50}
          max={95}
          value={threshold}
          onChange={(e) => onThreshold(Number(e.target.value))}
          className="flex-1 accent-[#17288B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17288B]/30"
        />
        <b className="tabular-nums text-[#0F172A]">{threshold}%</b>
      </div>
      <div className="mt-3.5 rounded-[12px] bg-[#F8FAFC] px-4 py-3.5 text-[12.5px] leading-[1.75] text-[#0F172A]">
        임계값 <b className="tabular-nums">{threshold}%</b> 적용 시 → 자동 배부{" "}
        <b className="tabular-nums">{stats.autoN}건 ({stats.pct}%)</b> · 예외 큐 <b className="tabular-nums">{stats.queueN}건</b>
        <br />
        <span className="text-[#94A3B8]">임계값은 성능이 아니라 공사가 선택하는 정책값 — 변경 이력은 감사 로그에 기록됩니다.</span>
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

export function Dashboard() {
  const [line, setLine] = useState("전체");
  const [threshold, setThreshold] = useState(80);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[#0F172A]">자동배부 대시보드</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">실시간 민원 자동배부 현황과 예외 처리 우선순위</p>
        </div>
        <DesignIntent
          question={'"지금 개입해야 하는가"를 3초 안에 판단할 수 있는가'}
          ids="관련 기능: DASH-001~006 · 010 · 012 | 지표: 자동배부율, 예외 큐 잔량, 배부 리드타임"
        >
          운영 관리자의 질문은 지표 나열이 아니라 <b className="text-white">개입 여부</b>다. 임계치 초과 시 경고 배너가
          최상단을 점유하고, 예외 큐는 접수순이 아닌 <b className="text-white">영향도 정렬</b>(안전 → 교통약자 → 법정기한)로
          배치했다. 실시간 배부 로그는 "AI가 지금 일하고 있다"는 <b className="text-white">시스템 가동감</b>을 제공하고,
          신뢰도 임계값 슬라이더는 자동배부율이 고정 성능이 아니라 <b className="text-white">공사가 선택하는 정책값</b>임을
          조작으로 체감하게 한다.
        </DesignIntent>
      </div>

      <SubNavRow />
      <LegendRow />

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

      <div className="mb-6 grid grid-cols-5 gap-5">
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
        <KpiCard
          label="검수 대기 (HITL)"
          icon={<SearchCheck className="h-[18px] w-[18px]" />}
          iconTone="danger"
          value={String(todaySummary.hitlWaiting)}
          unit="건"
          note={`최대 대기 ${todaySummary.hitlMaxWaitMin}분 — 즉시 검수 필요`}
          valueColor="#DC2626"
        />
        <WeatherKpi />
      </div>

      <ProcessingBar />

      <div className="mb-6 grid grid-cols-[1.5fr_1fr] gap-5">
        <OrgTable />
        <OrgShareDonut />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-5">
        <ProportionBars title="채널별 민원 현황" meta="3개 접수경로 통합 DB 기준" items={channelBreakdown} />
        <ProportionBars title="민원 유형별 현황 (상위)" meta="급증 유형은 적색 표시 · 클릭 시 상위 20개 전체보기" items={complaintTypes} />
      </div>

      <div className="mb-6 grid grid-cols-[1.35fr_1fr] gap-5">
        <InflowChart line={line} onLineChange={setLine} />
        <ConfidenceCard threshold={threshold} onThreshold={setThreshold} />
      </div>

      <div className="mb-6 grid grid-cols-[1.2fr_1fr] gap-5">
        <ExceptionQueueCard />
        <LiveLogCard threshold={threshold} />
      </div>

      <div className="grid grid-cols-[1fr_1.3fr] gap-5">
        <ConfidenceBucketsCard />
        <UrgentAlertsCard />
      </div>

      <FooterNote />
    </div>
  );
}
