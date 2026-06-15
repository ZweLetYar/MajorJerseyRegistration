import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} height={50} />
        ))}
    </div>
  );
}
