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

export const confidenceTiers = [
  {
    key: "ok",
    emoji: "😀",
    label: "확실 (90% 이상)",
    count: 3060,
    pct: 92,
    desc: "바로 자동배부 — 사람 개입 불필요",
    tone: "green",
  },
  {
    key: "mid",
    emoji: "😐",
    label: "다소 애매 (85~90%)",
    count: 214,
    pct: 6,
    desc: "자동배부 후 사후 모니터링",
    tone: "amber",
  },
  {
    key: "low",
    emoji: "❗",
    label: "불확실 (85% 미만)",
    count: 66,
    pct: 2,
    desc: "사람 검수(HITL)로 자동 전달",
    tone: "red",
  },
];
export const confidenceTotal = 3340;

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
  city: "서울",
  rainChance: 5,
  temp: 35,
  headline: "폭염특보 발효 · 최고 35°C",
  impact: "냉방 민원 급증 · 내일 장마 누수·미끄럼 주의",
  icon: "sun-cloud",
  days: [
    { label: "오늘", temp: 35, icon: "sun-cloud" },
    { label: "금", temp: 36, icon: "sun-cloud" },
    { label: "토", temp: 28, icon: "rain-cloud" },
    { label: "일", temp: 27, icon: "rain-cloud" },
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

export const todoItems = [
  {
    tone: "red",
    label: "예외 검수 대기",
    count: 48,
    unit: "건",
    sub: "최대 대기 32분",
    action: "검수 시작 →",
  },
  {
    tone: "amber",
    label: "배부 실패 재처리",
    count: 18,
    unit: "건",
    sub: "사유별 조치 필요",
    action: "재처리 →",
  },
  {
    tone: "green",
    label: "분류 지연 (5분 초과)",
    count: 0,
    unit: "건",
    sub: "AI가 자동 소화 중",
    action: "정상",
  },
];

export const orgTable = [
  { org: "계", total: 3340, auto: 2989, exception: 48, failed: 18, unprocessed: 285, rate: 95.0, status: "양호" },
  { org: "고객센터", total: 1120, auto: 1022, exception: 19, failed: 9, unprocessed: 70, rate: 97.5, status: "양호" },
  { org: "시설", total: 842, auto: 748, exception: 26, failed: 6, unprocessed: 62, rate: 96.2, status: "양호" },
  { org: "전동차", total: 689, auto: 622, exception: 18, failed: 3, unprocessed: 46, rate: 96.9, status: "양호" },
  { org: "승강기", total: 312, auto: 246, exception: 21, failed: 10, unprocessed: 35, rate: 90.1, status: "주의" },
  { org: "냉난방", total: 245, auto: 168, exception: 28, failed: 8, unprocessed: 41, rate: 85.3, status: "점검" },
  { org: "안전", total: 132, auto: 93, exception: 14, failed: 4, unprocessed: 21, rate: 86.4, status: "주의" },
];
export const orgNote = "냉난방: 폭염 신규 유형 유입으로 AI 확신도 하락 → AI 학습현황에서 재학습 필요";

export const orgShare = [
  { label: "고객센터", pct: 33, color: "#122590" },
  { label: "시설", pct: 25, color: "#2C3FA0" },
  { label: "전동차", pct: 21, color: "#4A5FBC" },
  { label: "승강기", pct: 9, color: "#7189D6" },
  { label: "냉난방", pct: 7, color: "#9DB0E6" },
  { label: "안전", pct: 4, color: "#C6D0F1" },
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
];
export const complaintComposition = "대분류 구성: 단순문의 58% · 불편접수 36% · 칭찬격려 3% · 기타 3%";

export const receiptTimeline = [
  { time: "09:00", count: 210, peak: false },
  { time: "09:15", count: 245, peak: false },
  { time: "09:30", count: 312, peak: true },
  { time: "09:45", count: 298, peak: true },
  { time: "10:00", count: 260, peak: false },
  { time: "10:15", count: 232, peak: false },
];

export const pipelineStages = [
  {
    n: "1단계",
    label: "민원 접수",
    value: "3,412건",
    tone: "done",
    desc: "콜센터·또타24·홈페이지·국민신문고 실시간 수집",
    sub: "응급상황 3건 → 관제·보안관·112 동시 공유됨",
  },
  {
    n: "2단계",
    label: "분류·배정",
    value: "45건 진행 중",
    tone: "hot",
    desc: "배정 완료 3,367 · 🔔 HITL 수동검토 4건 — 지금 검토 →",
    sub: "타기관 자동이첩 41건 (코레일 18 · 응답소 14 · 9호선 9)",
  },
  {
    n: "3단계",
    label: "현장 조치",
    value: "389건 조치 중",
    tone: "default",
    desc: "실시간 즉각조치 214 (냉난방·소란 등)",
    sub: "시설 보수·법적/기술 검토 175",
  },
  {
    n: "4단계",
    label: "답변 결재",
    value: "38건 대기",
    tone: "warm",
    desc: "팀장·부서장 승인 대기",
    sub: "24h 초과 6건 — 결재자 자동 독촉 발송",
  },
  {
    n: "5단계",
    label: "결과 통보",
    value: "2,940건 완료",
    tone: "done",
    desc: "문자·알림톡·이메일 자동 발송",
    sub: "양방향 모니터링 공개 · 만족도 4.2/5.0",
  },
];

export const pipelineStack = [
  { label: "통보 완료", count: 2940, pct: 86.2, color: "#34D399" },
  { label: "조치 중", count: 389, pct: 11.4, color: "#60A5FA" },
  { label: "결재 대기", count: 38, pct: 1.1, color: "#FBBF24" },
  { label: "타기관 이첩", count: 41, pct: 1.2, color: "#94A3B8" },
  { label: "수동검토", count: 4, pct: 0.1, color: "#EF4444" },
];

export const aiBriefing =
  '오늘 민원 3,412건 (전일 대비 +18%). 2호선 강남 냉방 민원 급증(+340%)이 주요 원인입니다. 병목은 4단계 답변 결재(24h 초과 6건)와 기술센터(3호선) 과부하 — 결재 독촉과 인력 재배치를 권고합니다. 기한초과 5건 중 2건은 지연사유서 미제출 상태입니다.';

export const deadlineNotes = [
  { title: "역무원 응대 불만 · 법적언급", id: "26-58077", owner: "고객서비스처 홍길동", due: "기한 초과 D+1", overdue: true },
  { title: "휠체어 리프트 고장 (충무로역)", id: "26-58110", owner: "기술센터3 박민준", due: "오늘 10:00 마감" },
  { title: "신도림 환승통로 누수", id: "26-58091", owner: "토목처 김철수", due: "오늘 13:00 마감" },
  { title: "시설물 파손 (출입구 계단)", id: "26-57912", owner: "토목처 김철수", due: "오늘 14:30 마감" },
  { title: "에스컬레이터 역주행 소음", id: "26-58044", owner: "기술센터5 이영희", due: "오늘 15:00 마감" },
  { title: "정기권 환불 요청", id: "26-58060", owner: "영업처 최수진", due: "오늘 17:00 마감" },
  { title: "환불 지연 재문의", id: "26-57988", owner: "영업처 최수진", due: "오늘 17:00 마감" },
];

export const priorityTop = [
  { stars: 5, id: "26-58077", title: "역무원 응대 불만 · 법적언급", dept: "고객서비스처 · 홍길동", due: "기한초과 D+1", sla: "r", stage: "2단계 수동검토" },
  { stars: 5, id: "26-57889", title: "스크린도어 오작동 신고", dept: "승강장안전문관리단", due: "기한초과 D+2", sla: "r", stage: "3단계 조치 중" },
  { stars: 5, id: "26-58110", title: "휠체어 리프트 고장 (충무로)", dept: "기술센터3 · 박민준", due: "오늘 10:00", sla: "y", stage: "2단계 수동검토" },
  { stars: 4, id: "26-58091", title: "신도림 환승통로 누수", dept: "토목처 · 김철수", due: "오늘 13:00", sla: "y", stage: "2단계 수동검토" },
  { stars: 4, id: "26-57912", title: "시설물 파손 (출입구 계단)", dept: "토목처 · 김철수", due: "오늘 14:30", sla: "y", stage: "4단계 결재 대기" },
  { stars: 4, id: "26-58044", title: "에스컬레이터 역주행 소음", dept: "기술센터5 · 이영희", due: "오늘 15:00", sla: "y", stage: "2단계 승인대기" },
  { stars: 3, id: "26-58060", title: "정기권 환불 요청", dept: "영업처 · 최수진", due: "오늘 17:00", sla: "y", stage: "2단계 승인대기" },
  { stars: 3, id: "26-57988", title: "환불 지연 재문의", dept: "영업처 · 최수진", due: "오늘 17:00", sla: "y", stage: "4단계 결재 대기" },
  { stars: 3, id: "26-58031", title: "혼잡 안전 우려 (9호선)", dept: "영업사업소 · 정우성", due: "내일 09:00", sla: "g", stage: "3단계 조치 중" },
  { stars: 3, id: "26-58012", title: "객실 와이파이 불량", dept: "정보통신처", due: "내일 15:00", sla: "g", stage: "3단계 조치 중" },
];
export const priorityCounts = { r: 5, y: 37, g: 1842 };

export const aiActions = [
  {
    tag: "긴급",
    tone: "red",
    title: "🔁 담당자 변경 추천",
    flow: "기술센터(3호선) — 2시간 후 SLA 초과 예상 (#26-58110 리프트 고장) → 기술센터(4호선) 교차출동으로 변경 추천",
    effect: "예상 처리시간 3.1h → 1.9h (−1.2h) · SLA 초과 회피",
    action: "적용",
  },
  {
    tag: "권고",
    tone: "amber",
    title: "⚖️ 재배부 시뮬레이션",
    flow: "홍길동(54건, 지연 3) → 김철수(21건)에게 5건 이동 시",
    effect: "SLA 준수율 96.2% → 98.8% · 18시 지연 예상 11건 → 4건",
    action: "시뮬레이션 적용",
  },
  {
    tag: "4단계",
    tone: "amber",
    title: "📝 결재 병목 해소",
    flow: "답변 결재 24h 초과 6건 — 결재자 3명 부재(출장) 감지 → 대결(代決) 라인 전환 추천",
    effect: "결재 대기 38건 → 예상 12건 (금일 내)",
    action: "대결 전환",
  },
  {
    tag: "효율",
    tone: "blue",
    title: "📦 반복민원 일괄 처리",
    flow: "2호선 냉방 87건 (+340%) — 이벤트 케이스 병합, 표준 프로세스 일괄 배부",
    effect: "개별 배부 대비 약 43분 절감 · 답변 일괄 발송",
    action: "일괄배부 승인",
  },
];

export const workloadByPerson = [
  { name: "홍길동 · 고객서비스처", holding: 54, avgDays: "5.4일", delay: 3, doneToday: 11, over: true },
  { name: "박민준 · 기술센터3", holding: 41, avgDays: "4.1일", delay: 2, doneToday: 9, over: true },
  { name: "김철수 · 토목처", holding: 21, avgDays: "3.0일", delay: 0, doneToday: 8, over: false },
  { name: "이영희 · 기술센터5", holding: 26, avgDays: "3.4일", delay: 0, doneToday: 7, over: false },
  { name: "최수진 · 영업처", holding: 18, avgDays: "2.6일", delay: 0, doneToday: 10, over: false },
];
export const workloadByDept = [
  { name: "기술센터 (시설/전기)", holding: 412, avgDays: "5.8일", delay: 2, doneToday: 86, over: true },
  { name: "고객서비스처", holding: 298, avgDays: "4.2일", delay: 2, doneToday: 64, over: true },
  { name: "역무운영처", holding: 254, avgDays: "3.9일", delay: 1, doneToday: 51, over: false },
  { name: "영업처 (유실물/환불)", holding: 231, avgDays: "2.7일", delay: 0, doneToday: 58, over: false },
  { name: "차량처 (냉난방 제어)", holding: 167, avgDays: "2.2일", delay: 0, doneToday: 49, over: false },
];

export const delayBottleneck = [
  { label: "담당자 부재/과부하", pct: 32, count: 13, color: "#F87171" },
  { label: "현장출동 대기", pct: 24, count: 10, color: "#FB923C" },
  { label: "부품 대기", pct: 18, count: 8, color: "#FBBF24" },
  { label: "결재 지연", pct: 15, count: 6, color: "#60A5FA" },
  { label: "타기관 협조", pct: 11, count: 5, color: "#94A3B8" },
];

export const aiOpsKpis = [
  { label: "자동배부율", value: "87.3%", tone: "up" },
  { label: "자동종결율", value: "74.2%", tone: "up" },
  { label: "배부 정확도 (재배부율 2.4%)", value: "96.1%" },
  { label: "이첩 정확도", value: "98.2%" },
];

export const stationHotspots = [
  { rank: 1, station: "강남 (2호선)", count: 412, density: 100, prevChange: "▲2", keywords: "냉방 · 혼잡" },
  { rank: 2, station: "신도림 (1·2호선)", count: 367, density: 88, prevChange: "—", keywords: "누수 · 환승동선" },
  { rank: 3, station: "잠실 (2·8호선)", count: 341, density: 81, prevChange: "▲4", keywords: "혼잡 · 행사" },
  { rank: 4, station: "홍대입구 (2호선)", count: 288, density: 69, prevChange: "▼1", keywords: "취객 · 소음" },
  { rank: 5, station: "충무로 (3·4호선)", count: 245, density: 58, prevChange: "▲1", keywords: "승강설비" },
];

export const weatherForecastLines = [
  { label: "☀️ 34°C 폭염경보", value: "냉방 +320건 예상" },
  { label: "오후 소나기 60%", value: "누수·미끄럼 +40건" },
  { label: "18시 잠실 콘서트", value: "9호선 혼잡 +120%" },
];

export const channelBreakdownV2 = [
  { label: "또타24 챗봇", count: 1297, pct: 38 },
  { label: "국민신문고/응답소", count: 989, pct: 29 },
  { label: "고객센터", count: 602, pct: 18 },
  { label: "자체 홈페이지", count: 524, pct: 15 },
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
  {
    pinned: false,
    tone: "blue",
    text: "또타24 챗봇 자동응대 처리 1,204건",
    meta: "챗봇 연계",
    action: "전일 대비 +8%",
  },
];
