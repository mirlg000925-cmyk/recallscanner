export type RecallStatus = "related" | "official-check";

export interface Vehicle {
  id: string;
  manufacturer: string; // 한글 제조사명, 예: 현대
  manufacturerSlug: string; // 예: hyundai
  modelName: string; // 정식 한글 차종명, 예: 팰리세이드
  englishName?: string; // 예: Palisade
  slug: string; // 예: palisade
  aliases: string[]; // 오타/별칭/영문 등
  category?: string; // SUV, 세단, 미니밴 등
  soldSince?: number; // 국내 판매 시작 연도(대략)
  description?: string; // 차종 한줄 설명
}

export interface Recall {
  id: string;
  vehicleSlugs: string[]; // 연결된 차종 slug (한 리콜이 여러 차종 대상일 수 있음)
  manufacturer: string;
  affectedModelsText: string; // 예: "팰리세이드 등 4차종"
  title: string; // 리콜 제목
  recallDate: string; // YYYY-MM-DD, 시정조치(리콜) 실시일
  productionStart?: string; // YYYY-MM, 생산기간 시작 (확인된 경우만)
  productionEnd?: string; // YYYY-MM
  applicableYears?: number[]; // 해당 리콜과 관련된 대략적 연식(확인된 경우만, 참고용)
  defect: string; // 결함 내용
  risk?: string; // 위험성 / 발생 가능 문제
  remedy: string; // 조치(시정) 방법
  affectedCount?: number; // 리콜 대상 대수
  recallType?: string; // 리콜 / 자발적 시정조치 등
  status: RecallStatus; // related: 관련 리콜 있음(차종 단위) / 실제 대상여부는 공식 확인 필요
  source: string; // 출처명
  sourceUrl: string; // 출처 URL
  updatedAt: string; // 데이터 최종 업데이트일 (YYYY-MM-DD)
}
