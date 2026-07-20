import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge, Card, Chip } from "../primitives";
import {
  aiActions,
  aiBriefing,
  aiOpsKpis,
  channelBreakdownV2,
  deadlineNotes,
  delayBottleneck,
  pipelineStack,
  pipelineStages,
  priorityCounts,
  priorityTop,
  stationHotspots,
  weatherForecastLines,
  weatherToday,
  workloadByDept,
  workloadByPerson,
} from "../../data/dashboard";

const WEATHER_ICON_SRC = (name) => `${import.meta.env.BASE_URL}weather/${name}.svg`;

function WeatherHeadlineCard() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-3.5">
        <img src={WEATHER_ICON_SRC(weatherToday.icon)} alt="" className="-my-1.5 h-14 w-14 shrink-0" />
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[36px] font-extrabold leading-none tabular-nums text-[#0F172A]">
              {weatherToday.temp}°
            </span>
            <span className="text-[13px] font-bold text-[#B45309]">폭염특보 발효 · 최고 {weatherToday.temp}°C</span>
          </div>
          <div className="mt-1.5 text-[12px] text-[#64748B]">
            {weatherForecastLines.map((w) => w.value).join(" · ")}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        {weatherToday.days.map((d) => (
          <div key={d.label} className="flex flex-col items-center gap-1 text-[11px] text-[#64748B]">
            <span className="font-semibold">{d.label}</span>
            <img src={WEATHER_ICON_SRC(d.icon)} alt="" className="h-7 w-7" />
            <span className="font-bold tabular-nums text-[#0F172A]">{d.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PIPELINE_TONE = { done: "text-[#2E7D32]", hot: "text-[#DC2626]", warm: "text-[#B45309]", default: "text-[#0F172A]" };

function PipelineStage({ stage, isLast }) {
  return (
    <>
      <div className="min-w-[186px] flex-1 text-left">
        <div className="mb-1 text-[11px] font-bold text-[#94A3B8]">{stage.n} · {stage.label}</div>
        <div className={`whitespace-nowrap text-[19px] font-extrabold tabular-nums ${PIPELINE_TONE[stage.tone]}`}>{stage.value}</div>
        <div className="mt-1.5 text-[11px] leading-[1.6] text-[#64748B]">{stage.desc}</div>
        <div className="mt-1 text-[10.5px] leading-[1.6] text-[#94A3B8]">{stage.sub}</div>
      </div>
      {!isLast ? <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-[#CBD5E1]" /> : null}
    </>
  );
}

function PipelineFlow() {
  return (
    <Card
      title="민원 처리 5단계 — 실시간 단계별 현황"
      meta="오늘 접수 3,412건 기준 · 단계 클릭 시 해당 목록"
      className="mb-6"
      style={{
        border: "1.5px solid transparent",
        backgroundImage:
          "linear-gradient(#fff, #fff), linear-gradient(120deg, #9DB0E6, #C6D0F1 45%, #E9ECFA)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="mb-5 flex flex-wrap items-start gap-4">
        {pipelineStages.map((stage, i) => (
          <PipelineStage key={stage.n} stage={stage} isLast={i === pipelineStages.length - 1} />
        ))}
      </div>
      <div className="flex h-[22px] overflow-hidden rounded-[6px]">
        {pipelineStack.map((seg) => (
          <div
            key={seg.label}
            style={{ width: `${seg.pct}%`, background: seg.color }}
            title={`${seg.label} ${seg.count.toLocaleString()}건 (${seg.pct}%)`}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-[#64748B]">
        {pipelineStack.map((seg) => (
          <span key={seg.label} className="flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: seg.color }} />
            {seg.label} {seg.count.toLocaleString()}건
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2.5 rounded-[10px] bg-[#F8FAFC] px-4 py-3 text-[12px] leading-[1.7] text-[#0F172A]">
        <img src={`${import.meta.env.BASE_URL}icons/gemini.svg`} alt="" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <b className="font-bold text-[#122590]">AI 브리핑</b> — {aiBriefing}
        </span>
      </div>
    </Card>
  );
}

function DeadlineNotes() {
  return (
    <Card title="마감 임박 민원" meta="담당자별 오늘 마감 · 기한 초과 건은 적색으로 표시" className="min-w-0">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {deadlineNotes.map((note) => (
          <div
            key={note.id}
            className={`w-[204px] shrink-0 rounded-[12px] border px-4 py-3.5 text-[12px] ${
              note.overdue ? "border-[#DC2626]/30 bg-[#FEF2F2]" : "border-[#E2E8F0] bg-white"
            }`}
          >
            <div className="mb-1.5 text-[10.5px] font-semibold text-[#94A3B8]">#{note.id}</div>
            <div className="mb-2 font-semibold leading-snug text-[#0F172A]">{note.title}</div>
            <div className="text-[11px] text-[#64748B]">{note.owner}</div>
            <div className={`mt-1.5 font-bold ${note.overdue ? "text-[#DC2626]" : "text-[#B45309]"}`}>{note.due}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PriorityTop10Table() {
  return (
    <Card
      title="우선순위 TOP10"
      meta={
        <>
          긴급 <b className="tabular-nums text-[#DC2626]">{priorityCounts.r}</b> · 주의{" "}
          <b className="tabular-nums text-[#B45309]">{priorityCounts.y}</b> · 정상{" "}
          <b className="tabular-nums text-[#059669]">{priorityCounts.g.toLocaleString()}</b>
        </>
      }
    >
      <table className="w-full border-separate border-spacing-0 text-[12.5px]">
        <thead>
          <tr className="text-left">
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">중요도</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">민원</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">담당</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">단계</th>
            <th className="whitespace-nowrap pb-3 text-[11.5px] font-semibold text-[#94A3B8]">기한</th>
          </tr>
        </thead>
        <tbody>
          {priorityTop.map((row) => (
            <tr key={row.id} className="cursor-pointer transition-colors hover:bg-[#F8FAFC]">
              <td className="whitespace-nowrap border-t border-[#F1F5F9] py-3 pr-3 tabular-nums text-[#F59E0B]">
                {"★".repeat(row.stars)}
                <span className="text-[#E2E8F0]">{"★".repeat(5 - row.stars)}</span>
              </td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-[#0F172A]">
                <div className="font-medium">{row.title}</div>
                <div className="text-[10.5px] text-[#94A3B8]">#{row.id}</div>
              </td>
              <td className="whitespace-nowrap border-t border-[#F1F5F9] py-3 pr-3 text-[#64748B]">{row.dept}</td>
              <td className="whitespace-nowrap border-t border-[#F1F5F9] py-3 pr-3">
                <Badge tone="gray">{row.stage}</Badge>
              </td>
              <td
                className={`whitespace-nowrap border-t border-[#F1F5F9] py-3 font-bold tabular-nums ${
                  row.sla === "r" ? "text-[#DC2626]" : row.sla === "y" ? "text-[#B45309]" : "text-[#0F172A]"
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

function AiActionsList() {
  return (
    <Card title="AI 추천 액션" meta="클릭 시 즉시 적용 또는 시뮬레이션">
      <div className="space-y-3">
        {aiActions.map((a) => (
          <div key={a.title} className="rounded-[12px] border border-[#E2E8F0] px-4 py-3.5 text-[12.5px]">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge tone={a.tone}>{a.tag}</Badge>
              <span className="font-bold text-[#0F172A]">{a.title}</span>
            </div>
            <div className="text-[11.5px] leading-[1.6] text-[#64748B]">{a.flow}</div>
            <div className="mt-1.5 text-[11px] font-semibold text-[#122590]">{a.effect}</div>
            <button
              type="button"
              className="mt-2.5 rounded-[8px] bg-[#122590] px-3 py-1.5 text-[11.5px] font-bold text-white transition-transform active:scale-[0.96]"
            >
              {a.action}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WorkloadTable() {
  const [mode, setMode] = useState("person");
  const rows = mode === "person" ? workloadByPerson : workloadByDept;
  return (
    <Card
      title="담당자별 업무량"
      meta="재배부 판단용"
      action={
        <div className="flex gap-1.5">
          <Chip active={mode === "person"} onClick={() => setMode("person")}>담당자</Chip>
          <Chip active={mode === "dept"} onClick={() => setMode("dept")}>부서</Chip>
        </div>
      }
    >
      <table className="w-full border-separate border-spacing-0 text-[12.5px]">
        <thead>
          <tr className="text-left">
            <th className="whitespace-nowrap pb-3 pr-3 text-[11.5px] font-semibold text-[#94A3B8]">
              {mode === "person" ? "담당자" : "부서"}
            </th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">보유건</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">평균처리</th>
            <th className="whitespace-nowrap pb-3 pr-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">지연</th>
            <th className="whitespace-nowrap pb-3 text-right text-[11.5px] font-semibold text-[#94A3B8]">금일완료</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="transition-colors hover:bg-[#F8FAFC]">
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-[#0F172A]">
                {row.name}
                {row.over ? <span className="ml-1.5 text-[10px] font-bold text-[#DC2626]">과부하</span> : null}
              </td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums font-semibold text-[#0F172A]">
                {row.holding}
              </td>
              <td className="border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums text-[#64748B]">{row.avgDays}</td>
              <td
                className={`border-t border-[#F1F5F9] py-3 pr-3 text-right tabular-nums font-semibold ${
                  row.delay > 0 ? "text-[#DC2626]" : "text-[#94A3B8]"
                }`}
              >
                {row.delay}
              </td>
              <td className="border-t border-[#F1F5F9] py-3 text-right tabular-nums text-[#059669]">{row.doneToday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function DelayBottleneckCard() {
  const max = Math.max(...delayBottleneck.map((d) => d.pct));
  return (
    <Card title="지연 병목 원인" meta="지연·임박 42건 분석">
      <div className="space-y-3.5">
        {delayBottleneck.map((d) => (
          <div key={d.label}>
            <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
              <span className="font-medium text-[#0F172A]">{d.label}</span>
              <span className="tabular-nums text-[#64748B]">
                {d.count}건 · {d.pct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#F1F5F9]">
              <div className="h-2 rounded-full" style={{ width: `${(d.pct / max) * 100}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 border-t border-dashed border-[#E2E8F0] pt-3 text-[11.5px] text-[#64748B]">
        🤖 1위 원인이 <b className="text-[#0F172A]">인력(32%)</b> — 재배부 시뮬레이션 적용 권고.
      </div>
    </Card>
  );
}

function AiOpsKpiCard() {
  return (
    <Card title="AI 운영현황" meta="업무 영향 중심 · 7일">
      <div className="grid grid-cols-2 gap-4">
        {aiOpsKpis.map((k) => (
          <div key={k.label} className="rounded-[12px] bg-[#F8FAFC] px-4 py-3.5">
            <div className="text-[11px] font-semibold text-[#64748B]">{k.label}</div>
            <div className={`mt-1 text-[22px] font-extrabold tabular-nums ${k.tone === "up" ? "text-[#122590]" : "text-[#0F172A]"}`}>
              {k.value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 border-t border-dashed border-[#E2E8F0] pt-3 text-[11.5px] text-[#64748B]">
        ↳ 재학습 필요 <b className="text-[#0F172A]">17건</b> — 주말 배치 학습 자동 반영
      </div>
    </Card>
  );
}

const LINE_COLOR = { 1: "#0052A4", 2: "#00A84D", 3: "#EF7C1C", 4: "#00A5DE", 8: "#E6186C" };

const STATION_POS = {
  "신도림 (1·2호선)": { x: 160, y: 60, labelY: 40 },
  "홍대입구 (2호선)": { x: 150, y: 120, labelY: 98 },
  "강남 (2호선)": { x: 420, y: 120, labelY: 92 },
  "잠실 (2·8호선)": { x: 540, y: 120, labelY: 92 },
  "충무로 (3·4호선)": { x: 380, y: 180, labelY: 207 },
};

function heatColor(density) {
  if (density >= 90) return "#DC2626";
  if (density >= 75) return "#F59E0B";
  if (density >= 55) return "#FBBF24";
  return "#84CC16";
}

function StationHotspotsCard() {
  const max = Math.max(...stationHotspots.map((s) => s.density));
  return (
    <Card title="노선·역사 민원 히트맵" meta="실시간 · 원 크기=건수, 색=급증도">
      <svg viewBox="0 0 660 240" className="h-auto w-full">
        <polyline points="40,60 620,60" stroke={LINE_COLOR[1]} strokeWidth="5" fill="none" opacity="0.8" />
        <polyline points="40,120 620,120" stroke={LINE_COLOR[2]} strokeWidth="5" fill="none" opacity="0.8" />
        <polyline points="40,180 380,180 380,120" stroke={LINE_COLOR[3]} strokeWidth="5" fill="none" opacity="0.75" />
        <polyline points="380,180 620,180" stroke={LINE_COLOR[4]} strokeWidth="5" fill="none" opacity="0.75" />
        <polyline points="540,120 540,180" stroke={LINE_COLOR[8]} strokeWidth="4" fill="none" opacity="0.55" strokeDasharray="2 3" />
        <line x1="160" y1="60" x2="160" y2="120" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />

        <text x="8" y="64" fontSize="11" fontWeight="800" fill={LINE_COLOR[1]}>1호선</text>
        <text x="8" y="124" fontSize="11" fontWeight="800" fill={LINE_COLOR[2]}>2호선</text>
        <text x="8" y="184" fontSize="11" fontWeight="800" fill={LINE_COLOR[3]}>3호선</text>
        <text x="628" y="184" fontSize="11" fontWeight="800" fill={LINE_COLOR[4]}>4호선</text>

        {stationHotspots.map((s) => {
          const pos = STATION_POS[s.station];
          if (!pos) return null;
          const r = 8 + (s.density / max) * 12;
          const color = heatColor(s.density);
          const hot = s.density >= 90;
          return (
            <g key={s.station} className="cursor-pointer">
              <circle cx={pos.x} cy={pos.y} r={r} fill={color} opacity={hot ? 1 : 0.85}>
                <title>{`${s.station} · ${s.count}건 · ${s.keywords}`}</title>
              </circle>
              <text
                x={pos.x}
                y={pos.labelY}
                fontSize={hot ? 12 : 10.5}
                fontWeight={hot ? 800 : 700}
                textAnchor="middle"
                fill={hot ? "#DC2626" : "#475569"}
              >
                {s.station.split(" ")[0]} {s.count}
                {s.prevChange !== "—" ? ` ${s.prevChange}` : ""}
              </text>
            </g>
          );
        })}

        <circle cx="420" cy="222" r="5" fill="#84CC16" />
        <text x="430" y="226" fontSize="10" fill="#64748B">평시</text>
        <circle cx="470" cy="222" r="6" fill="#FBBF24" />
        <text x="480" y="226" fontSize="10" fill="#64748B">주의</text>
        <circle cx="520" cy="222" r="7" fill="#F59E0B" />
        <text x="530" y="226" fontSize="10" fill="#64748B">경계</text>
        <circle cx="575" cy="222" r="8" fill="#DC2626" />
        <text x="586" y="226" fontSize="10" fill="#64748B">급증</text>
      </svg>
    </Card>
  );
}

function ChannelBreakdownCard() {
  const max = Math.max(...channelBreakdownV2.map((c) => c.count));
  return (
    <Card title="채널별 접수 비중" meta="오늘 3,412건">
      <div className="space-y-3.5">
        {channelBreakdownV2.map((c) => (
          <div key={c.label}>
            <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
              <span className="font-medium text-[#0F172A]">{c.label}</span>
              <span className="tabular-nums text-[#64748B]">
                {c.count.toLocaleString()} · {c.pct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#F1F5F9]">
              <div className="h-2 rounded-full bg-[#122590]" style={{ width: `${(c.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 border-t border-dashed border-[#E2E8F0] pt-3 text-[11.5px] text-[#64748B]">
        ↳ 국민신문고 비중 전주 대비 <b className="text-[#DC2626]">▲4%p</b> — 자체 채널 안내 강화 검토
      </div>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div>
      <WeatherHeadlineCard />

      <PipelineFlow />

      <div className="mb-6 grid grid-cols-[1.5fr_1fr] gap-5">
        <PriorityTop10Table />
        <DeadlineNotes />
      </div>

      <div className="mb-6 grid grid-cols-[1fr_1.2fr] gap-5">
        <AiOpsKpiCard />
        <AiActionsList />
      </div>

      <div className="mb-6 grid grid-cols-[1.3fr_1fr] gap-5">
        <WorkloadTable />
        <DelayBottleneckCard />
      </div>

      <div className="grid grid-cols-[1.25fr_1fr] gap-5">
        <StationHotspotsCard />
        <ChannelBreakdownCard />
      </div>
    </div>
  );
}
