import { type Dispatch, type SetStateAction } from 'react'
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePagedResult } from '@/hooks/use-paged-result';

const Toolbar = ({ viewMode, setViewMode }: { viewMode: "grid" | "list", setViewMode: Dispatch<SetStateAction<"grid" | "list">> }) =>
{
  const { pagedResult } = usePagedResult()

  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {pagedResult.items.length} products
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Toolbar