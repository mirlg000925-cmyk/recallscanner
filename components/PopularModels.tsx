import Link from "next/link";
import { vehicles } from "@/lib/vehicles";
import { getRecallsForVehicle } from "@/lib/recalls";

export default function PopularModels() {
  return (
    <section id="popular" className="space-y-4">
      <h2 className="font-bold text-lg text-gray-900">많이 찾는 차종</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {vehicles.map((v) => {
          const count = getRecallsForVehicle(v.manufacturerSlug, v.slug).length;
          return (
            <Link
              key={v.id}
              href={`/recall/${v.manufacturerSlug}/${v.slug}`}
              className="rounded-xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all px-4 py-4 text-center"
            >
              <p className="text-xs text-gray-400">{v.manufacturer}</p>
              <p className="font-semibold text-gray-900 mt-0.5">{v.modelName}</p>
              <p className="text-xs mt-1 text-gray-400">
                {count > 0 ? `관련 리콜 ${count}건` : "등록된 리콜 없음"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
