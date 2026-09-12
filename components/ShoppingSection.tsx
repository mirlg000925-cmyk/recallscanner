// 리콜/안전 점검이라는 사이트 맥락과 맞닿아 있는 항목 위주로 6개만 선별했습니다
// (전시성 카테고리를 나열하기보다, 실제로 클릭할 이유가 있는 소수 큐레이션 방식).
// 아래 href는 쿠팡 파트너스에서 발급받은 실제 제휴 링크입니다.
const ITEMS = [
  { label: "타이어 공기압 측정기", href: "https://link.coupang.com/a/gZeCBsBQom" }, // 리콜/안전점검과 직결
  { label: "타이어 트레드 측정기", href: "https://link.coupang.com/a/gZeK0D1RWm" }, // 리콜/안전점검과 직결
  { label: "차량용 점프스타터", href: "https://link.coupang.com/a/gZeNa9v0QC" }, // 배터리 비상대비
  { label: "블랙박스", href: "https://link.coupang.com/a/gZePrYzagu" },
  { label: "워셔액", href: "https://link.coupang.com/a/gZeRKCxMrc" },
  { label: "차량용 무선청소기", href: "https://link.coupang.com/a/gZeVO5lqGi" },
];

// 쿠팡 파트너스 정책상 반드시 아래 문구를 함께 표시해야 합니다. (필수 고지, 임의로 지우지 마세요)
const DISCLOSURE = "위 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

export default function ShoppingSection() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="font-bold text-gray-900 mb-1">🚗 차량 관리용품도 함께 확인해보세요</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors px-4 py-3 text-sm text-center text-gray-700"
          >
            {item.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">{DISCLOSURE}</p>
    </section>
  );
}
