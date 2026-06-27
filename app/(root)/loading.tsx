import TableSkeleton from "@/components/TableSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 flex justify-center px-4 py-3">
      <div className="w-full max-w-5xl">
        <TableSkeleton />
      </div>
    </main>
  );
}
