import { ProductCard } from "@/components/Index/ProductCard";
import { usePagedResult } from "@/hooks/use-paged-result";
import type { PagedResult } from "@/types/paged-result";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { SearchX } from "lucide-react";
import type { ProductCatlog } from "@/types/product";

const Products = ({ viewMode = 'grid' }: { viewMode: 'grid' | 'list' }) =>
{
  const { pagedResult, loading, fetchPagedResultAsync, payload } = usePagedResult()

  if (pagedResult.totalItems == 0)
  {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center">
        <SearchX className="h-16 w-16 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-semibold">
          No items match your filter
        </h2>

        <p className="mt-2 text-muted-foreground">
          Try changing or resetting your filters
        </p>

        <Button
          className="mt-6"
          onClick={async () =>
          {
            await fetchPagedResultAsync({
              ...payload,
              columnFilters: [],
              sorting: [],
              searchString: ""
            })
            window.dispatchEvent(new Event("resetCatalogFilters"));
          }}

        >
          Reset Filters
        </Button>
      </div>
    )
  }

  if (loading)
  {
    return (
      <div
        className={`grid gap-6 ${viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1"
          }`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-fit w-full rounded-xs flex flex-col gap-2 border border-accent p-1.5">
            <Skeleton className="h-48 w-full rounded-xs rounded-b-none" />
            <div className="grid grid-cols-1 h-fit w-full gap-1">
              <Skeleton className="h-4 w-full rounded-xs" />
              <Skeleton className="h-4 w-3/4 rounded-xs" />
              <Skeleton className="h-4 w-1/2 rounded-xs" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              <Skeleton className="h-4 w-full rounded-xs" />
              <Skeleton className="h-4 w-full rounded-xs" />
              <Skeleton className="h-4 w-full rounded-xs" />
            </div>
            <Separator className="bg-accent" />
            <div className="grid grid-cols-2">
              <Skeleton className="size-10 rounded-xs" />
              <Skeleton className="h-10 w-full rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    )
  }


  return (
    <div
      className={`grid gap-6 ${viewMode === "grid"
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1"
        }`}
    >
      {(pagedResult as PagedResult<ProductCatlog>).items.map((product, index) => (
        <ProductCard key={index} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default Products;
