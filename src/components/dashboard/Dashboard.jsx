import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowUpDown, Bot, Gauge, Inbox, SearchCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Card, Chip, KpiCard } from "../primitives";
import { DesignIntent } from "./RationaleNote";
import {
  confidenceHistogram,
  confidenceTotal,
  exceptionQueue,
  inflowByLine,
  lineNames,
  liveLogPool,
} from "../../data/dashboard";

function InflowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload[0]?.payload?.total;
  const auto = payload[0]?.payload?.auto;
  return (
    <div className="rounded-[12px] bg-white px-4 py-3 text-[12px] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)]">
      <div className="mb-1 font-semibold text-[#0F172A]">{label}</div>
      <div className="text-[#64748B]">
        총 유입 <b className="tabular-nums text-[#0F172A]">{total}</b>건 · 자동배부{" "}
        <b className="tabular-nums text-[#0B4171]">{auto}</b>건
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

function InflowChart({ line, onLineChange }) {
  const data = inflowByLine[line];
  return (
    <Card
      title={
        <>
          시간별 · 노선별 민원 유입 추이 <Badge tone="gray">총 유입 vs 자동배부 완료</Badge>
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
          <Bar dataKey="auto" stackId="b" fill="#0B4171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex gap-5 text-[11.5px] font-medium text-[#64748B]">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#E2E8F0]" />총 유입</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#0B4171]" />자동배부 완료</span>
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
              <Cell key={entry.bin} fill={entry.bin >= threshold ? "#0B4171" : "#E2E8F0"} />
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
          className="flex-1 accent-[#0B4171] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4171]/30"
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

      <div className="mb-6 flex items-center gap-4 rounded-[16px] bg-[#FEF2F2] px-6 py-4 text-[13.5px] shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[#DC2626]" />
        <span className="text-[#0F172A]">
          예외 큐 잔량이 임계치(20건)를 초과했습니다. 현재 <b className="tabular-nums text-[#DC2626]">27건</b> 대기 중 — 안전
          플래그 1건 · 법정기한 임박 2건 포함
        </span>
        <button
          type="button"
          className="ml-auto shrink-0 rounded-[10px] bg-[#0B4171] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#0D4D85] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4171]/40 focus-visible:ring-offset-2"
        >
          예외 검수 화면 바로가기 →
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-5">
        <KpiCard
          label="실시간 총 유입량"
          icon={<Inbox className="h-[18px] w-[18px]" />}
          iconTone="primary"
          value="1,284"
          unit="건"
          delta="▲ 12.4%"
          note="전일 대비 · 전 채널"
        />
        <KpiCard
          label="AI 자동 배부율"
          icon={<Bot className="h-[18px] w-[18px]" />}
          iconTone="accent"
          value="81.2%"
          note="7일 평균 78.4% · 상승 추세"
        />
        <KpiCard
          label="AI 분류 평균 신뢰도"
          icon={<Gauge className="h-[18px] w-[18px]" />}
          iconTone="accent"
          value="87.2%"
          note="전주 대비 +1.4%p"
        />
        <KpiCard
          label="예외 큐 잔량"
          icon={<SearchCheck className="h-[18px] w-[18px]" />}
          iconTone="danger"
          value="27"
          unit="건"
          delta="▲ 검수 필요"
          note="우선 처리 3건"
          valueColor="#DC2626"
        />
      </div>

      <div className="mb-6 grid grid-cols-[1.35fr_1fr] gap-5">
        <InflowChart line={line} onLineChange={setLine} />
        <ConfidenceCard threshold={threshold} onThreshold={setThreshold} />
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        <ExceptionQueueCard />
        <LiveLogCard threshold={threshold} />
      </div>
    </div>
  );
}
