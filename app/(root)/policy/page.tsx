"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (!agreed) return;
    router.push("/order"); // change to your route
  };

  return (
    <main className="min-h-screen  text-white flex items-center justify-center mt-2 ">
      <div className="w-full  rounded-xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border-white/10  p-6 backdrop-blur-xl">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center">
          IST Jacket Pre-Order Policy
        </h1>

        <p className="text-xs text-slate-400 text-center mt-2">
          Please read carefully before continuing
        </p>

        {/* Content */}
        <div className="mt-6 space-y-4 text-sm text-slate-300 leading-6">
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="font-semibold text-white">💰 Price</h2>
            <p>39,500 Ks</p>
          </div>

          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="font-semibold text-white">📅 Pre-order Period</h2>
            <p>June 29 – July 6</p>
          </div>

          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="font-semibold text-white">
              👥 For Registered Members
            </h2>
            <p>
              Customers who paid 3,000 Ks registration fee only need to pay the
              remaining 36,500 Ks.
            </p>
          </div>

          {/* <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="font-semibold text-white">🏭 Production</h2>
            <p>Production time: 3 weeks</p>
            <p>MOQ: 50 pcs</p>
            <p>
              Production starts only after MOQ is reached and orders are
              confirmed.
            </p>
          </div> */}

          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="font-semibold text-white">🔁 Refund Policy</h2>
            <p>
              If MOQ(50 pcs) is not reached, a full refund will be issued to all
              customers.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="font-semibold text-white">📏 Size Information</h2>
            <div className="flex justify-between items-center gap-3">
              <div>
                <p className="mt-1 font-medium">50 Orders</p>
                <p>
                  Free Size <br></br>(100–165 lb)
                </p>
              </div>
              <div>
                <p className="mt-3 font-medium">100 Orders</p>
                <p>M, L, XL available</p>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-400 pt-2">
            Thank you for your support.
          </p>
        </div>

        {/* Checkbox */}
        <div className="mt-6 flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-indigo-500"
          />
          <label className="text-sm text-slate-300">
            I agree to the policy and understand all terms & conditions.
          </label>
        </div>

        {/* Button */}
        <button
          disabled={!agreed}
          onClick={handleContinue}
          className={`mt-6 w-full rounded-2xl py-3 font-semibold transition
            ${
              agreed
                ? "bg-white text-black hover:scale-[0.98]"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
        >
          Continue →
        </button>
      </div>
    </main>
  );
}
