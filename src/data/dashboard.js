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
