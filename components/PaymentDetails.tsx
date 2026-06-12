"use client";

import Image from "next/image";
import { useState } from "react";

export default function PaymentDetails({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const phoneNumberMap: Record<string, string> = {
    "qr1.jpg": "09881603226",
    "qr2.jpg": "09255255930",
    "qr3.jpg": "09682765965",
  };

  const phoneNumber = phoneNumberMap[id] || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col items-center justify-center gap-3">
        <Image src={`/${id}`} alt={id} width={150} height={70} className="" />

        <a
          href={`/${id}`}
          download={id}
          className="inline-flex w-[85%] items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Save QR
        </a>
      </div>
      <div className="h-px w-[90%] mx-auto bg-slate-200" />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left w-[90%] mx-auto">
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-blue-900 ms-2">
            {phoneNumber}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex rounded-md border items-center justify-center border-blue-900 h-8 p-2 text-xs font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
          >
            {copied ? (
              "Copied!"
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
