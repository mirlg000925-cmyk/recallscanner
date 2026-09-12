import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-20 text-center space-y-6">
      <p className="text-3xl">🔍</p>
      <h1 className="text-xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-500 text-sm">차종 이름으로 다시 검색해보세요.</p>
      <SearchBox />
      <Link href="/" className="text-brand-600 text-sm hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
