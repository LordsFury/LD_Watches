"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Watch } from "@/types/watch";
import { formatPrice, getMainImage } from "@/lib/utils";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminWatchListProps {
  watches: Watch[];
  onAddWatch?: () => void;
}

export default function AdminWatchList({ watches, onAddWatch }: AdminWatchListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/watches/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch {
      alert("Failed to delete watch");
    } finally {
      setDeleting(null);
    }
  };

  if (watches.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <p className="text-ld-light mb-2">No watches yet</p>
        <p className="text-ld-silver text-sm mb-6">Start building your collection</p>
        {onAddWatch && (
          <button onClick={onAddWatch} className="btn-gold text-sm">
            <Plus className="w-4 h-4" />
            Add your first watch
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {watches.map((watch) => (
          <div
            key={watch._id}
            className="p-4 bg-ld-dark rounded-xl border border-ld-grey/40"
          >
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-ld-charcoal shrink-0">
                <Image
                  src={watch.images[0] || "/placeholder-watch.svg"}
                  alt={watch.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{watch.name}</p>
                <p className="text-ld-silver text-xs">{watch.brand} · {watch.category}</p>
                <p className="text-ld-gold font-semibold text-sm mt-1">{formatPrice(watch.price)}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {watch.inStock ? (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">In Stock</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">Out of Stock</span>
                  )}
                  {watch.featured && (
                    <span className="px-2 py-0.5 bg-ld-gold/15 text-ld-gold-light text-xs rounded">Featured</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-ld-grey/30">
              <Link href={`/watches/${watch.slug}`} target="_blank" className="p-2 text-ld-silver hover:text-ld-gold" title="View">
                <Eye className="w-4 h-4" />
              </Link>
              <Link href={`/admin/watches/${watch._id}/edit`} className="p-2 text-ld-silver hover:text-ld-gold" title="Edit">
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(watch._id, watch.name)}
                disabled={deleting === watch._id}
                className="p-2 text-ld-silver hover:text-red-400 disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-ld-grey/50">
              <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">Watch</th>
              <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">Category</th>
              <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">Price</th>
              <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">Status</th>
              <th className="text-right py-3 px-4 text-ld-silver text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watches.map((watch) => (
              <tr key={watch._id} className="border-b border-ld-grey/30 hover:bg-ld-dark/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ld-dark shrink-0">
                      <Image
                        src={getMainImage(watch)}
                        alt={watch.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{watch.name}</p>
                      <p className="text-ld-silver text-xs">{watch.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-ld-light text-sm">{watch.category}</td>
                <td className="py-3 px-4 text-ld-gold-light text-sm font-semibold">{formatPrice(watch.price)}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 flex-wrap">
                    {watch.inStock ? (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">In Stock</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">Out of Stock</span>
                    )}
                    {watch.featured && (
                      <span className="px-2 py-0.5 bg-ld-gold/15 text-ld-gold-light text-xs rounded">Featured</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/watches/${watch.slug}`} target="_blank" className="p-2 text-ld-silver hover:text-ld-gold transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/watches/${watch._id}/edit`} className="p-2 text-ld-silver hover:text-ld-gold transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(watch._id, watch.name)}
                      disabled={deleting === watch._id}
                      className="p-2 text-ld-silver hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
