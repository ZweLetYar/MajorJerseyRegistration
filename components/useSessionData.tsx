"use client";

import { useEffect, useState } from "react";

type RegistrationData = {
  isRegistrant?: boolean;
  [key: string]: unknown;
};

export default function useSessionData() {
  const [storedData, setStoredData] = useState<RegistrationData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("registration");

    if (stored && stored !== "undefined") {
      try {
        setStoredData(JSON.parse(stored));
      } catch {
        setStoredData(null);
      }
    }
  }, []);

  return { storedData };
}
