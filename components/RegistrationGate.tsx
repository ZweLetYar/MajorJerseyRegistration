"use client";

import { useEffect, useState } from "react";
import CountDownTimer from "@/components/CountDownTimer";

export default function RegistrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const targetDate = new Date("2026-06-16T12:00:01").getTime();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (Date.now() >= targetDate) {
        setIsOpen(true);
      }
    };

    check(); // initial check
    const interval = setInterval(check, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔒 Before open → show only countdown
  if (!isOpen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <CountDownTimer />
        </div>
      </div>
    );
  }

  // 🔓 After open → show main app
  return <>{children}</>;
}
