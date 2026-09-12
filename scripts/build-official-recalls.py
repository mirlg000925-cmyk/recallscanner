#!/usr/bin/env python3
"""
data/recalls-2025-raw.csv (한국교통안전공단_자동차결함 리콜현황, data.go.kr 공공데이터,
https://www.data.go.kr/data/3048950/fileData.do)를 읽어서, 지정한 차종(slug) 키워드에
해당하는 리콜 행을 찾고, 같은 리콜사유+리콜개시일을 공유하는 트림들을 하나의 리콜로 묶어
lib/recalls.ts에 붙여넣을 수 있는 TypeScript 객체 리터럴 텍스트를 출력합니다.

사용법:
  1. data.go.kr에서 최신 "한국교통안전공단_자동차결함 리콜현황" 파일을 내려받아
     CP949(EUC-KR) -> UTF-8로 변환한 뒤 data/recalls-2025-raw.csv 를 덮어씁니다.
  2. TARGETS 딕셔너리에 새 차종을 추가하거나 기존 키워드를 수정합니다.
  3. python3 scripts/build-official-recalls.py > /tmp/new-recalls.txt 로 실행합니다.
  4. 출력된 객체들을 lib/recalls.ts 의 recalls 배열 안에 붙여넣습니다.

이 스크립트는 참고/반자동 도구이며, PRD의 "관리자 페이지 + 자동 업데이트 배치"를
대체하지 않습니다. 다음 단계로 이 로직을 관리자 페이지나 배치 작업으로 옮기는 것을
권장합니다.
"""
import csv
import json
import sys
from collections import OrderedDict

CSV_PATH = "data/recalls-2025-raw.csv"
SOURCE_LABEL = "한국교통안전공단 자동차결함 리콜현황 (2025-12-31 기준, data.go.kr 공공데이터)"
SOURCE_URL = "https://www.data.go.kr/data/3048950/fileData.do"

# slug -> (검색 키워드 목록, Vehicle.manufacturer 표기)
TARGETS = {
    "hyundai/palisade": (["팰리세이드"], "현대"),
    "hyundai/sonata": (["쏘나타"], "현대"),
    "hyundai/avante": (["아반떼"], "현대"),
    "hyundai/santafe": (["싼타페"], "현대"),
    "kia/sorento": (["쏘렌토"], "기아"),
    "kia/carnival": (["카니발"], "기아"),
    "genesis/gv80": (["gv80"], "제네시스"),
    "bmw/520d": (["520d"], "BMW"),
    "tesla/model-3": (["model 3"], "테슬라"),
}


def year_range(start, end):
    y0, y1 = int(start[:4]), int(end[:4])
    return list(range(y0, y1 + 1))


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def slug_id(vehicle_slug: str, recall_date: str) -> str:
    return "r-" + vehicle_slug.split("/")[1].replace("-", "") + "-" + recall_date.replace("-", "")


def main():
    with open(CSV_PATH, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    out = []
    for slug, (keywords, manufacturer) in TARGETS.items():
        matches = [
            r for r in rows
            if any(kw.lower() in r["차명"].lower() for kw in keywords)
        ]
        groups = OrderedDict()
        for m in matches:
            key = (m["리콜사유"], m["리콜개시일"])
            groups.setdefault(key, []).append(m)

        for (reason, recall_date), items in groups.items():
            names = list(dict.fromkeys(i["차명"] for i in items))
            pstart = min(i["생산기간(부터)"] for i in items)
            pend = max(i["생산기간(까지)"] for i in items)
            years = sorted({y for i in items for y in year_range(i["생산기간(부터)"], i["생산기간(까지)"])})
            vid = slug_id(slug, recall_date)
            years_ts = ", ".join(str(y) for y in years)
            entry = f'''  {{
    id: "{vid}",
    vehicleSlugs: ["{slug}"],
    manufacturer: "{manufacturer}",
    affectedModelsText: "{esc(", ".join(names))}",
    title: "TODO: 결함 내용을 요약한 제목을 직접 붙여주세요",
    recallDate: "{recall_date}",
    productionStart: "{pstart[:7]}",
    productionEnd: "{pend[:7]}",
    applicableYears: [{years_ts}],
    defect: "{esc(reason)}",
    remedy: "정확한 조치(시정) 방법은 자동차리콜센터 공식 안내 또는 제작사 서비스센터를 통해 확인하실 수 있습니다.",
    recallType: "리콜",
    status: "related",
    source: "{SOURCE_LABEL}",
    sourceUrl: "{SOURCE_URL}",
    updatedAt: "TODO: 오늘 날짜(YYYY-MM-DD)",
  }},'''
            out.append(entry)

    print("\n".join(out))
    print(f"\n// 총 {len(out)}건 생성됨", file=sys.stderr)


if __name__ == "__main__":
    main()
