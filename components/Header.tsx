import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <span aria-hidden>🚗</span>
          <span>리콜스캐너</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-brand-600">
            리콜 조회
          </Link>
          <Link href="/#popular" className="hover:text-brand-600">
            인기 차종
          </Link>
          <a
            href="https://www.car.go.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600"
          >
            자동차리콜센터
          </a>
        </nav>
      </div>
    </header>
  );
}
