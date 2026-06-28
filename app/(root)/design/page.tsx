"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className=" flex items-center justify-center ">
      <div className="w-full  rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl">
        {/* Image Section */}
        <div className="overflow-hidden rounded-2xl bg-black/20">
          <Image
            src="/jacket4.JPG"
            alt="jacket design"
            width={500}
            height={700}
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>

        {/* Info */}
        <div className="mt-5 text-center">
          <h1 className="text-xl font-semibold text-white">
            Modern Jacket Design
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Premium student jacket concept with clean minimal styling.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => router.push("/policy")}
          className="mt-6 w-full rounded-2xl bg-white py-3 font-semibold text-slate-900 transition active:scale-95 hover:bg-slate-200"
        >
          Go to Next Page →
        </button>
      </div>
    </main>
  );
}
