import * as React from "react";
import { cn } from "@/lib/utils";

// Inline Skeleton component using Tailwind theme-aware colors
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-light-4 dark:bg-gray-50",
        className
      )}
      {...props}
    />
  );
}

export default function GraphSuspense() {
  return (
    <div className="p-2 flex flex-col justify-between h-full overflow-hidden">
      <div className="w-full flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-10 w-[160px]" />
      </div>

      <div className="w-full h-[250px] flex items-center justify-center">
        <div
          className="w-full h-full grid gap-1 items-end"
          style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}
        >
          {Array.from({ length: 30 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="w-full"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
