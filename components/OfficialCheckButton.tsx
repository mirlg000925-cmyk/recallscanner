export default function OfficialCheckButton() {
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <p className="font-semibold text-brand-800">🚗 내 차량 실제 리콜 여부 확인</p>
        <p className="text-sm text-brand-700 mt-1">
          차량번호 또는 차대번호로 공식 확인하세요. 리콜스캐너는 차량번호를
          저장하거나 분석하지 않습니다.
        </p>
      </div>
      <a
        href="https://www.car.go.kr/"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 transition-colors"
      >
        자동차리콜센터에서 확인 ↗
      </a>
    </div>
  );
}
