import { redirect } from "next/navigation";
import Link from "next/link";
import { searchVehicle } from "@/lib/search";
import { getAvailableYears } from "@/lib/recalls";
import SearchBox from "@/components/SearchBox";
import PopularModels from "@/components/PopularModels";

export const metadata = {
  title: "차종 검색 결과",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = (resolvedSearchParams.q || "").trim();

  if (!q) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 space-y-10">
        <SearchBox />
        <PopularModels />
      </div>
    );
  }

  const result = searchVehicle(q);

  if (result.exact) {
    const { manufacturerSlug, slug } = result.exact;
    if (result.year) {
      const years = getAvailableYears(manufacturerSlug, slug);
      if (years.includes(result.year)) {
        redirect(`/recall/${manufacturerSlug}/${slug}/${result.year}`);
      }
      redirect(`/recall/${manufacturerSlug}/${slug}?year=${result.year}`);
    }
    redirect(`/recall/${manufacturerSlug}/${slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 space-y-10">
      <SearchBox initialValue={q} />

      {result.candidates.length === 1 && (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center space-y-4">
          <p className="text-gray-700">
            혹시{" "}
            <strong className="text-brand-700">
              {result.candidates[0].vehicle.manufacturer} {result.candidates[0].vehicle.modelName}
            </strong>
            를 찾으시나요?
          </p>
          <p className="text-sm text-gray-500">입력하신 검색어와 가장 가까운 차종입니다.</p>
          <Link
            href={`/recall/${result.candidates[0].vehicle.manufacturerSlug}/${result.candidates[0].vehicle.slug}${
              result.year ? `?year=${result.year}` : ""
            }`}
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 transition-colors"
          >
            {result.candidates[0].vehicle.manufacturer} {result.candidates[0].vehicle.modelName}로 검색
          </Link>
        </div>
      )}

      {result.candidates.length > 1 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <p className="text-gray-700 font-medium">
            검색하신 차종을 정확하게 찾지 못했습니다.
          </p>
          <p className="text-sm text-gray-500">비슷한 차종</p>
          <ol className="space-y-2">
            {result.candidates.map((c, i) => (
              <li key={c.vehicle.id}>
                <Link
                  href={`/recall/${c.vehicle.manufacturerSlug}/${c.vehicle.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 px-4 py-3 transition-colors"
                >
                  <span className="text-gray-400">{i + 1}</span>
                  <span className="font-medium text-gray-900">
                    {c.vehicle.manufacturer} {c.vehicle.modelName}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {result.candidates.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 text-center">
          <p className="text-gray-700">
            &lsquo;{q}&rsquo;에 대한 검색 결과를 찾지 못했습니다.
          </p>
          <p className="text-sm text-gray-500">
            아래 인기 차종 중에서 찾아보시거나, 다른 표기로 다시 검색해보세요.
          </p>
        </div>
      )}

      <PopularModels />
    </div>
  );
}
