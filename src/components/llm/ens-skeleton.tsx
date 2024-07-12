import { Skeleton } from "@/components/ui/skeleton";

export function ENSSkeleton() {
  return (
    <div className="flex items-center justify-between bg-background px-4 py-3 rounded-lg border">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="grid gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
