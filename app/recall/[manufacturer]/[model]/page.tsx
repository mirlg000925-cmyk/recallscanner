import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { vehicles, findVehicleBySlug } from "@/lib/vehicles";
import { getRecallsForVehicle, getAvailableYears } from "@/lib/recalls";
import RecallCard from "@/components/RecallCard";
import OfficialCheckButton from "@/components/OfficialCheckButton";
import ShoppingSection from "@/components/ShoppingSection";
import SearchBox from "@/components/SearchBox";

interface Props {
  params: Promise<{ manufacturer: string; model: string }>;
  searchParams: Promise<{ year?: string }>;
}

export function generateStaticParams() {
  return vehicles.map((v) => ({
    manufacturer: v.manufacturerSlug,
    model: v.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { manufacturer, model } = await params;
  const vehicle = findVehicleBySlug(manufacturer, model);
  if (!vehicle) return {};
  const title = `${vehicle.manufacturer} ${vehicle.modelName} 리콜 조회`;
  const description = `${vehicle.manufacturer} ${vehicle.modelName}의 공개된 리콜 정보를 한눈에 확인하세요. 결함 내용, 조치 방법, 대상 대수를 정리했습니다.`;
  return {
    title,
    description,
    alternates: { canonical: `/recall/${vehicle.manufacturerSlug}/${vehicle.slug}` },
    openGraph: { title: `${title} | 리콜스캐너`, description },
  };
}

export default async function VehiclePage({ params, searchParams }: Props) {
  const { manufacturer, model } = await params;
  const resolvedSearchParams = await searchParams;
  const vehicle = findVehicleBySlug(manufacturer, model);
  if (!vehicle) notFound();

  const recallList = getRecallsForVehicle(vehicle.manufacturerSlug, vehicle.slug);
  const years = getAvailableYears(vehicle.manufacturerSlug, vehicle.slug);
  const requestedYear = resolvedSearchParams.year
    ? parseInt(resolvedSearchParams.year, 10)
    : null;
  const relatedVehicles = vehicles.filter(
    (v) => v.manufacturerSlug === vehicle.manufacturerSlug && v.id !== vehicle.id
  );

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-10">
      <div>
        <p className="text-sm text-gray-400">
          {vehicle.manufacturer} · {vehicle.category}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          {vehicle.manufacturer} {vehicle.modelName} 리콜 조회
        </h1>
        <p className="text-gray-500 mt-2">
          {vehicle.manufacturer} {vehicle.modelName}의 공개된 리콜 정보를 확인할 수 있습니다.
        </p>
        <p className="text-sm font-medium text-brand-700 mt-3">
          현재 확인된 리콜 {recallList.length}건
        </p>
      </div>

      <SearchBox />

      {requestedYear && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600">
          요청하신 {requestedYear}년식 전용 페이지는 아직 준비되지 않았습니다. 아래{" "}
          {vehicle.modelName} 전체 리콜 목록을 확인해주세요.
        </div>
      )}

      {years.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 mr-1">연식별 리콜</span>
          {years.map((y) => (
            <Link
              key={y}
              href={`/recall/${vehicle.manufacturerSlug}/${vehicle.slug}/${y}`}
              className="text-sm rounded-full border border-gray-300 hover:border-brand-400 hover:text-brand-700 px-3 py-1 transition-colors"
            >
              {y} {vehicle.modelName} 리콜
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-5">
        {recallList.length > 0 ? (
          recallList.map((r) => <RecallCard key={r.id} recall={r} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            현재 데이터베이스에 등록된 공개 리콜 정보가 없습니다. 데이터가
            업데이트되는 대로 이 페이지에 자동으로 반영됩니다.
          </div>
        )}
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500">
        ※ 리콜 대상 여부는 차량별 생산번호 등에 따라 달라질 수 있습니다. 정확한
        내 차량의 리콜 대상 및 조치 여부는 공식 자동차리콜센터에서 확인하세요.
      </div>

      <OfficialCheckButton />

      {relatedVehicles.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900">관련 차종</h2>
          <div className="flex flex-wrap gap-2">
            {relatedVehicles.map((v) => (
              <Link
                key={v.id}
                href={`/recall/${v.manufacturerSlug}/${v.slug}`}
                className="text-sm rounded-full bg-white border border-gray-200 hover:border-brand-300 px-4 py-2 transition-colors"
              >
                {v.manufacturer} {v.modelName}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ShoppingSection />
    </div>
  );
}
