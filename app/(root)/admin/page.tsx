"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const password = "861181";
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));

  const handleChange = (value: string, index: number) => {
    if (!/\d/.test(value) && value !== "") return;

    const nextCode = [...code];
    nextCode[index] = value.slice(-1);
    setCode(nextCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`,
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      const nextCode = [...code];
      nextCode[index - 1] = "";
      setCode(nextCode);

      const prevInput = document.getElementById(
        `otp-${index - 1}`,
      ) as HTMLInputElement | null;
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");
    if (enteredCode === password) {
      // Handle successful password entry
      router.push("/admin/dashboardyenom");
    } else {
      // Handle incorrect password
      alert("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="flex  items-center justify-center ">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-xl font-semibold text-blue-900">
          Enter Password
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Enter your 6-digit code
        </p>

        <div className="flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-14 w-12 rounded-lg border border-slate-300 text-center text-xl font-semibold text-blue-900 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Page;
