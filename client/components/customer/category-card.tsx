import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
}

export function CategoryCard({ id, name, slug, image, itemCount }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`} className="group relative block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient for better text legibility if we wanted text over image, but we'll put text below */}
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white transition-colors group-hover:text-primary">
            {name}
          </h3>
          {itemCount !== undefined && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </p>
          )}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-primary-foreground dark:bg-slate-800 dark:text-slate-400">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
