import SearchBox from "@/components/SearchBox";
import PopularModels from "@/components/PopularModels";
import ShoppingSection from "@/components/ShoppingSection";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-14">
      <section className="text-center space-y-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
          🚗 내 차 리콜,
          <br />
          쉽게 확인하세요.
        </h1>
        <p className="text-gray-500">차종 또는 차종 + 연식을 입력해주세요.</p>
        <div className="max-w-xl mx-auto">
          <SearchBox />
        </div>
        <p className="text-xs text-gray-400">
          회원가입 없이 무료로 이용할 수 있습니다. 오타나 영문 입력도 자동으로 인식돼요.
        </p>
      </section>

      <PopularModels />

      <ShoppingSection />
    </div>
  );
}
