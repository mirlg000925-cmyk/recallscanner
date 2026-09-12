import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { vehicles, findVehicleBySlug } from "@/lib/vehicles";
import {
  getRecallsForVehicle,
  getRecallsForVehicleYear,
  getAvailableYears,
} from "@/lib/recalls";
import RecallCard from "@/components/RecallCard";
import OfficialCheckButton from "@/components/OfficialCheckButton";
import ShoppingSection from "@/components/ShoppingSection";
import SearchBox from "@/components/SearchBox";

interface Props {
  params: Promise<{ manufacturer: string; model: string; year: string }>;
}

export function generateStaticParams() {
  const params: { manufacturer: string; model: string; year: string }[] = [];
  for (const v of vehicles) {
    const years = getAvailableYears(v.manufacturerSlug, v.slug);
    for (const y of years) {
      params.push({
        manufacturer: v.manufacturerSlug,
        model: v.slug,
        year: String(y),
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { manufacturer, model, year } = await params;
  const vehicle = findVehicleBySlug(manufacturer, model);
  if (!vehicle) return {};
  const title = `${year} ${vehicle.modelName} 리콜 조회`;
  const description = `${year}년식 ${vehicle.manufacturer} ${vehicle.modelName} 관련 공개 리콜 정보를 확인하세요.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/recall/${vehicle.manufacturerSlug}/${vehicle.slug}/${year}`,
    },
  };
}

export default async function VehicleYearPage({ params }: Props) {
  const resolvedParams = await params;
  const vehicle = findVehicleBySlug(resolvedParams.manufacturer, resolvedParams.model);
  if (!vehicle) notFound();

  const year = parseInt(resolvedParams.year, 10);
  const years = getAvailableYears(vehicle.manufacturerSlug, vehicle.slug);
  if (!years.includes(year)) notFound();

  const yearRecalls = getRecallsForVehicleYear(vehicle.manufacturerSlug, vehicle.slug, year);
  const allRecalls = getRecallsForVehicle(vehicle.manufacturerSlug, vehicle.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-10">
      <div>
        <p className="text-sm text-gray-400">
          <Link
            href={`/recall/${vehicle.manufacturerSlug}/${vehicle.slug}`}
            className="hover:text-brand-600"
          >
            {vehicle.manufacturer} {vehicle.modelName}
          </Link>{" "}
          / {year}년식
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          {year} {vehicle.modelName} 리콜 조회
        </h1>
        <p className="text-gray-500 mt-2">
          {year}년식 {vehicle.manufacturer} {vehicle.modelName}과 관련된 공개 리콜
          정보입니다.
        </p>
      </div>

      <SearchBox />

      <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500">
        ※ 이 페이지는 리콜 공고에 언급된 대략적인 연식 범위를 기준으로
        분류되었습니다. 정확한 생산번호 기준 리콜 대상 여부는 공식
        자동차리콜센터에서 확인하세요.
      </div>

      <div className="space-y-5">
        {yearRecalls.map((r) => (
          <RecallCard key={r.id} recall={r} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 mr-1">다른 연식</span>
        {years
          .filter((y) => y !== year)
          .map((y) => (
            <Link
              key={y}
              href={`/recall/${vehicle.manufacturerSlug}/${vehicle.slug}/${y}`}
              className="text-sm rounded-full border border-gray-300 hover:border-brand-400 hover:text-brand-700 px-3 py-1 transition-colors"
            >
              {y}
            </Link>
          ))}
        <Link
          href={`/recall/${vehicle.manufacturerSlug}/${vehicle.slug}`}
          className="text-sm rounded-full border border-gray-300 hover:border-brand-400 hover:text-brand-700 px-3 py-1 transition-colors"
        >
          전체 연식 ({allRecalls.length}건)
        </Link>
      </div>

      <OfficialCheckButton />
      <ShoppingSection />
    </div>
  );
}
