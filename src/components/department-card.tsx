import Image from "next/image";
import Link from "next/link";
import type { Department } from "@/data/departments";

export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Link
      href={`/range?department=${department.slug}`}
      className="block overflow-hidden rounded-[20px] border border-line bg-white text-teal transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[5px] hover:shadow-card-lg"
    >
      <div className="h-[168px] overflow-hidden bg-sand-deep">
        <Image
          src={department.image}
          alt={department.name}
          width={600}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-5 py-[18px]">
        <div className="mb-1 text-[17px] font-bold">{department.name}</div>
        <div className="text-[13.5px] text-muted">
          {department.count} {department.count === 1 ? "product" : "products"}
        </div>
      </div>
    </Link>
  );
}
