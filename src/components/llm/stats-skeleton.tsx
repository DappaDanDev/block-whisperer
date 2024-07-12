import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  return (
    <Card className="bg-background rounded-lg border border-muted p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-4 w-12 rounded mt-1" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-20 rounded mt-1" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-20 rounded mt-1" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-20 rounded mt-1" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-20 rounded mt-1" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-20 rounded mt-1" />
        </div>
      </div>
    </Card>
  );
}
