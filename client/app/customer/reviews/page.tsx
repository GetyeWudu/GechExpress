import { Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const REVIEWS = [
  {
    id: "rev-1",
    product: {
      id: "p1",
      name: "Premium Wireless Headphones with Active Noise Cancellation",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop"
    },
    rating: 5,
    date: "Oct 28, 2026",
    title: "Absolutely incredible sound quality",
    content: "I've tried many premium headphones but these take the cake. The noise cancellation is unreal, especially on flights. Battery life is solid as well, going easily for 30 hours. Highly recommended!",
    helpful: 12,
    status: "Published"
  },
  {
    id: "rev-2",
    product: {
      id: "p4",
      name: "Leather Messenger Bag",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200&auto=format&fit=crop"
    },
    rating: 4,
    date: "Sep 15, 2026",
    title: "Great quality, slightly smaller than expected",
    content: "The leather is beautiful and it smells amazing. Stitching is very high quality. My only gripe is it barely fits my 15-inch laptop, it's a very tight squeeze. But overall a great bag for daily commuting.",
    helpful: 3,
    status: "Published"
  }
];

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your product reviews and ratings
        </p>
      </div>

      <div className="space-y-6">
        {REVIEWS.map((review) => (
          <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col sm:flex-row gap-6">
              
              {/* Product Info */}
              <div className="flex sm:flex-col gap-4 sm:w-48 shrink-0">
                <Link href={`/products/${review.product.id}`} className="relative h-20 w-20 sm:h-32 sm:w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900 block shrink-0">
                  <Image 
                    src={review.product.image} 
                    alt={review.product.name} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 640px) 5rem, 8rem"
                  />
                </Link>
                <div>
                  <Link href={`/products/${review.product.id}`} className="hover:underline">
                    <h3 className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-white">
                      {review.product.name}
                    </h3>
                  </Link>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700"}`} 
                        />
                      ))}
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{review.title}</h4>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 shrink-0">
                    {review.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {review.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <span>Reviewed on {review.date}</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {review.helpful} people found this helpful
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
