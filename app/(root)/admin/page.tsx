// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// function Page() {
//   const password = "861181";
//   const router = useRouter();
//   const [code, setCode] = useState<string[]>(Array(6).fill(""));

//   const handleChange = (value: string, index: number) => {
//     if (!/\d/.test(value) && value !== "") return;

//     const nextCode = [...code];
//     nextCode[index] = value.slice(-1);
//     setCode(nextCode);

//     if (value && index < 5) {
//       const nextInput = document.getElementById(
//         `otp-${index + 1}`,
//       ) as HTMLInputElement | null;
//       nextInput?.focus();
//     }
//   };

//   const handleKeyDown = (
//     event: React.KeyboardEvent<HTMLInputElement>,
//     index: number,
//   ) => {
//     if (event.key === "Backspace" && !code[index] && index > 0) {
//       const nextCode = [...code];
//       nextCode[index - 1] = "";
//       setCode(nextCode);

//       const prevInput = document.getElementById(
//         `otp-${index - 1}`,
//       ) as HTMLInputElement | null;
//       prevInput?.focus();
//     }
//   };

//   const handleSubmit = () => {
//     const enteredCode = code.join("");
//     if (enteredCode === password) {
//       router.push("/admin/dashboardyenom");
//     } else {
//       alert("Incorrect password. Please try again.");
//     }
//   };

//   return (
//     <div className=" flex items-center justify-center bg-slate-50 px-4">
//       <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-4 mt-20 sm:p-8 shadow-lg">
//         <h1 className="mb-2 text-center text-lg sm:text-xl font-semibold text-blue-900">
//           Enter Password
//         </h1>

//         <p className="mb-5 sm:mb-6 text-center text-xs sm:text-sm text-slate-500">
//           Enter your 6-digit code
//         </p>

//         <div className="flex justify-center gap-2 sm:gap-3">
//           {code.map((digit, index) => (
//             <input
//               key={index}
//               id={`otp-${index}`}
//               type="text"
//               inputMode="numeric"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border border-slate-300 text-center text-lg sm:text-xl font-semibold text-blue-900 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200"
//             />
//           ))}
//         </div>

//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="mt-5 sm:mt-6 w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Page;

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function Page() {
  const password = "861181";
  const router = useRouter();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [shake, setShake] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (entered: string) => {
    if (entered === password) {
      router.push("/admin/dashboardyenom");
    } else {
      triggerShake();
      setCode(Array(6).fill(""));
    }
  };

  // ⚡ Auto-submit when all 6 digits are filled
  useEffect(() => {
    const enteredCode = code.join("");
    if (enteredCode.length === 6) {
      handleSubmit(enteredCode);
    }
  }, [code]);

  return (
    <div className=" flex items-center justify-center bg-slate-50 px-4">
      <div
        ref={containerRef}
        className={`w-full max-w-sm sm:max-w-md rounded-2xl mt-20 bg-white p-4 sm:p-8 shadow-lg ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h1 className="mb-2 text-center text-lg sm:text-xl font-semibold text-blue-900">
          Enter Password
        </h1>

        <p className="mb-5 sm:mb-6 text-center text-xs sm:text-sm text-slate-500">
          Enter your 6-digit code
        </p>

        <div className="flex justify-center gap-2 sm:gap-3">
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
              className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border border-slate-300 text-center text-lg sm:text-xl font-semibold text-blue-900 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200"
            />
          ))}
        </div>

        {/* <button
          type="button"
          onClick={() => handleSubmit(code.join(""))}
          className="mt-5 sm:mt-6 w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Submit
        </button> */}
      </div>

      {/* 🔥 Shake animation style */}
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-6px);
          }
          80% {
            transform: translateX(6px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Page;
