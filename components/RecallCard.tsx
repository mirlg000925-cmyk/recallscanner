import { Recall } from "@/lib/types";

function formatCount(n?: number) {
  if (!n) return null;
  return n.toLocaleString("ko-KR") + "대";
}

export default function RecallCard({ recall }: { recall: Recall }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1">
          🟡 관련 리콜 있음
        </span>
        {recall.recallType && (
          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs px-3 py-1">
            {recall.recallType}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{recall.title}</h3>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-gray-500">리콜 실시일</dt>
          <dd className="font-medium text-gray-900">{recall.recallDate}</dd>
        </div>
        <div>
          <dt className="text-gray-500">대상</dt>
          <dd className="font-medium text-gray-900">{recall.affectedModelsText}</dd>
        </div>
        {(recall.productionStart || recall.productionEnd) && (
          <div>
            <dt className="text-gray-500">대상 생산기간</dt>
            <dd className="font-medium text-gray-900">
              {recall.productionStart ?? "확인 필요"} ~ {recall.productionEnd ?? "확인 필요"}
            </dd>
          </div>
        )}
        {formatCount(recall.affectedCount) && (
          <div>
            <dt className="text-gray-500">리콜 대상 대수</dt>
            <dd className="font-medium text-gray-900">{formatCount(recall.affectedCount)}</dd>
          </div>
        )}
      </dl>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-500 mb-1">결함 내용</p>
          <p className="text-gray-800 leading-relaxed">{recall.defect}</p>
        </div>
        {recall.risk && (
          <div>
            <p className="text-gray-500 mb-1">발생 가능 문제</p>
            <p className="text-gray-800 leading-relaxed">{recall.risk}</p>
          </div>
        )}
        <div>
          <p className="text-gray-500 mb-1">조치 방법</p>
          <p className="text-gray-800 leading-relaxed">{recall.remedy}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <a
          href={recall.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:underline font-medium"
        >
          공식 출처: {recall.source} ↗
        </a>
        <span>최근 업데이트 {recall.updatedAt}</span>
      </div>
    </div>
  );
}
