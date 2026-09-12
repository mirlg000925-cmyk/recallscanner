export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-sm text-gray-500 space-y-2">
        <p>
          리콜스캐너는 공개된 자동차 리콜 정보를 보기 쉽게 정리해 제공하는 무료
          서비스입니다. 개별 차량의 정확한 리콜 대상 및 조치 여부는{" "}
          <a
            href="https://www.car.go.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 underline"
          >
            자동차리콜센터(car.go.kr)
          </a>
          에서 차량번호 또는 차대번호로 확인해주세요.
        </p>
        <p>© {new Date().getFullYear()} 리콜스캐너. 회원가입 없이 무료로 이용할 수 있습니다.</p>
      </div>
    </footer>
  );
}
