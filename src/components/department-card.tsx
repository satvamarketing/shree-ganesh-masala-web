import Image from "next/image";
import Link from "next/link";
import type { Department } from "@/data/departments";
import { departmentImageOverrides } from "@/data/department-overrides";

export function DepartmentCard({ department }: { department: Department }) {
  const override = departmentImageOverrides[department.slug];
  const src = override?.image ?? department.image;
  const contain = override?.fit === "contain";

  return (
    <Link
      href={`/range?department=${department.slug}`}
      className="block overflow-hidden rounded-[18px] border border-line bg-white text-ink transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-card-lg"
    >
      <div
        className={`relative h-[150px] overflow-hidden ${
          contain ? "bg-sand" : "bg-sand-deep"
        }`}
      >
        <Image
          src={src}
          alt={department.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          className={contain ? "object-contain p-4" : "object-cover"}
        />
      </div>
      <div className="px-5 py-4">
        <div className="mb-0.5 text-[16px] font-bold">{department.name}</div>
        <div className="text-[13px] text-muted">
          {department.count} {department.count === 1 ? "product" : "products"}
        </div>
      </div>
    </Link>
  );
}
