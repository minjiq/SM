export const hours = ["06", "08", "10", "12", "14", "16", "18", "20", "22"];

export const lineNames = ["전체", "1호선", "2호선", "3호선", "4호선", "5호선", "6호선", "7호선", "8호선", "9호선"];

const baseByHour = [30, 95, 70, 60, 55, 65, 110, 80, 45];

function buildLine(lineIndex, name) {
  return hours.map((h, i) => {
    let total = baseByHour[i];
    if (name !== "전체") total = Math.round(total * (0.08 + 0.04 * Math.abs(Math.sin(lineIndex * 2.3 + i))));
    if (name === "4호선") total = Math.round(total * 2.2);
    if (name === "2호선") total = Math.round(total * 1.6);
    const auto = Math.round(total * (0.74 + 0.12 * Math.abs(Math.cos(lineIndex + i))));
    return { hour: `${h}시`, total, auto };
  });
}

export const inflowByLine = Object.fromEntries(lineNames.map((name, i) => [name, buildLine(i, name)]));

export const confidenceHistogram = [2, 3, 4, 6, 8, 10, 14, 19, 26, 34].map((count, i) => ({
  bin: 50 + i * 4.5,
  count,
}));
export const confidenceTotal = 186;

export const exceptionQueue = [
  {
    priority: 1,
    summary: "승강장 틈새 유모차 끼임 · 비상벨 무응답",
    flags: [
      { tone: "red", label: "안전" },
      { tone: "blue", label: "교통약자" },
    ],
    dept: "안전관리실",
    confidence: 61,
    due: "D-1",
    hot: true,
  },
  {
    priority: 2,
    summary: "OO역 엘리베이터 3일째 고장, 휠체어 이용 불가",
    flags: [
      { tone: "blue", label: "교통약자" },
      { tone: "gray", label: "반복 3회" },
    ],
    dept: "시설 분야",
    confidence: 74,
    due: "D-2",
    hot: true,
  },
  {
    priority: 3,
    summary: "객실 냉방 불량 + 반복 소음 복합 민원 (4호선)",
    flags: [{ tone: "gray", label: "복합" }],
    dept: "차량 분야",
    confidence: 58,
    due: "D-4",
    hot: false,
  },
  {
    priority: 4,
    summary: "역무원 응대 불만 및 재발 방지 요청",
    flags: [{ tone: "gray", label: "응대" }],
    dept: "고객서비스팀",
    confidence: 69,
    due: "D-5",
    hot: false,
  },
];

export const liveLogPool = [
  ["또타24 챗봇", "승무 분야", 93],
  ["홈페이지", "차량 분야", 88],
  ["문자(1577)", "고객서비스팀", 91],
  ["또타지하철 앱", "시설 분야", 86],
  ["홈페이지", "안전관리실", 64],
  ["또타24 챗봇", "역운영 분야", 95],
  ["문자(1577)", "차량 분야", 90],
  ["홈페이지", "전기신호 분야", 83],
];

export const todaySummary = {
  receivedToday: 3340,
  receivedDeltaPct: 6,
  autoRate: 96.3,
  autoRateTargetMet: true,
  avgDispatchSec: 8.2,
  avgDispatchDeltaSec: -1.1,
  hitlWaiting: 48,
  hitlMaxWaitMin: 32,
  updatedAt: "2026-07-10 (금) 10:12 기준",
  refreshCycleMin: 5,
};

export const weatherToday = {
  headline: "폭염특보 발효 · 최고 35°C",
  impact: "냉방 민원 급증 · 내일 장마 누수·미끄럼 주의",
  days: [
    { label: "오늘", temp: 35, icon: "sun" },
    { label: "금", temp: 36, icon: "sun" },
    { label: "토", temp: 28, icon: "rain" },
    { label: "일", temp: 27, icon: "cloud" },
  ],
};

export const aiProcessing = {
  total: 3340,
  autoComplete: 2989,
  exception: 48,
  failed: 18,
  unprocessed: 285,
  avgWaitSec: 8.2,
};

export const orgTable = [
  { org: "계", total: 3340, auto: 2989, exception: 48, failed: 18, unprocessed: 285, rate: 95.0, status: "양호" },
  { org: "고객센터", total: 1120, auto: 1022, exception: 19, failed: 9, unprocessed: 70, rate: 97.5, status: "양호" },
  { org: "시설", total: 842, auto: 748, exception: 26, failed: 6, unprocessed: 62, rate: 96.2, status: "양호" },
  { org: "전동차", total: 689, auto: 622, exception: 18, failed: 3, unprocessed: 46, rate: 96.9, status: "양호" },
  { org: "승강기", total: 312, auto: 246, exception: 21, failed: 10, unprocessed: 35, rate: 90.1, status: "주의" },
  { org: "냉난방", total: 245, auto: 168, exception: 28, failed: 8, unprocessed: 41, rate: 85.3, status: "점검" },
  { org: "안전", total: 132, auto: 93, exception: 14, failed: 4, unprocessed: 21, rate: 86.4, status: "주의" },
];

export const orgShare = [
  { label: "고객센터", pct: 33, color: "#17288B" },
  { label: "시설", pct: 25, color: "#5F79D6" },
  { label: "전동차", pct: 21, color: "#F59E0B" },
  { label: "승강기", pct: 9, color: "#FBC94C" },
  { label: "냉난방", pct: 7, color: "#94A3B8" },
  { label: "안전", pct: 4, color: "#10B981" },
  { label: "기타", pct: 1, color: "#E2E8F0" },
];

export const channelBreakdown = [
  { label: "고객센터", count: 3287, pct: 98.4 },
  { label: "고객의소리", count: 37, pct: 1.1 },
  { label: "서울시응답소", count: 16, pct: 0.5 },
];

export const complaintTypes = [
  { label: "전동차 냉난방", count: 812, delta: "▲43%", tone: "hot" },
  { label: "열차내 질서저해", count: 521, delta: "▲12%", tone: "hot" },
  { label: "열차 지연", count: 334, delta: "—", tone: "flat" },
  { label: "역사 환경", count: 268, delta: "—", tone: "flat" },
  { label: "유실물", count: 227, delta: "▼3%", tone: "down" },
  { label: "역사내 시설물", count: 179, delta: "—", tone: "flat" },
];

export const receiptTimeline = [
  { time: "09:00", count: 210, peak: false },
  { time: "09:15", count: 245, peak: false },
  { time: "09:30", count: 312, peak: true },
  { time: "09:45", count: 298, peak: true },
  { time: "10:00", count: 260, peak: false },
  { time: "10:15", count: 232, peak: false },
];

export const confidenceBuckets = [
  { label: "95~100%", count: 2318, tone: "green" },
  { label: "90~95%", count: 742, tone: "green" },
  { label: "85~90%", count: 214, tone: "amber" },
  { label: "85% 미만", count: 66, tone: "red", note: "→ 검수" },
];

export const urgentAlerts = [
  {
    pinned: true,
    tone: "red",
    text: "전동차 냉방 민원 급증 — 기상청 폭염특보 연계 · 100건↑ (전일 대비 +43%)",
    action: "조치 지시 →",
  },
  {
    pinned: true,
    tone: "red",
    text: "2호선 장애신고 집중 — 동일노선 탐지 · 관제/차량부서 발송됨",
    action: "조치 지시 →",
  },
  {
    pinned: false,
    tone: "amber",
    text: "잠실역 일대 혼잡 민원 증가 예상",
    meta: "대규모 행사 일정 연계",
    action: "7/15 예정",
  },
  {
    pinned: false,
    tone: "amber",
    text: "동일 역사(건대입구) 시설 장애 반복 접수",
    meta: "동일유형 함지",
    action: "30분 내 12건↑",
  },
  {
    pinned: false,
    tone: "amber",
    text: "내일 장마 예보 — 역사 누수·미끄럼 민원 증가 예상",
    meta: "기상청 강수예보 연계",
    action: "사전점검 권고",
  },
  {
    pinned: false,
    tone: "blue",
    text: "타기관 이첩 대상 민원 3건 발생",
    meta: "실시간 이첩 시스템",
    action: "처리기한 최대 7일 단축",
  },
];
