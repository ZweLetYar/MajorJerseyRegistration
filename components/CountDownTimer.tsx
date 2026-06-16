"use client";

import { useEffect, useState } from "react";
import TableSkeleton from "./TableSkeleton";

export default function CountDownTimer() {
  const targetDate = new Date("2026-06-16T12:30:01").getTime();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTimeLeft = () => {
    const diff = targetDate - Date.now();

    if (diff <= 0) return null;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    if (!mounted) return;

    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted]);

  // ✅ IMPORTANT: prevent hydration mismatch
  if (!mounted || !timeLeft) {
    return (
      <div className="w-full rounded-2xl border border-white bg-blue-50 p-4 text-center">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-[240px] rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
      <p className="mb-3 text-center text-xl font-bold text-blue-700">
        Registration starts in
      </p>

      <div className="flex items-center justify-center gap-2">
        <TimeBlock value={timeLeft.hours} label="H" />
        <span className="text-lg font-bold text-blue-700">:</span>
        <TimeBlock value={timeLeft.minutes} label="M" />
        <span className="text-lg font-bold text-blue-700">:</span>
        <TimeBlock value={timeLeft.seconds} label="S" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[44px] rounded-xl bg-white px-3 py-2 text-center text-lg font-bold text-blue-900 shadow">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[11px] text-gray-500">{label}</span>
    </div>
  );
}
