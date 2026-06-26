"use client";
export default function page() {
  return (
    <main className="relative flex  items-center justify-center overflow-hidden bg-[#0B1120] px-6 py-10">
      {/* Background */}
      {/* <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div> */}

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        {/* Animated Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/20">
          <svg
            className="h-10 w-10 text-red-900 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v5m0 4h.01M10.29 3.86L1.82 18A2 2 0 003.53 21h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Maintenance Mode
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-blue-700">
            We'll be back soon.
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            We're improving the registration system to provide a better
            experience. Thank you for your patience.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="text-green-400 font-medium">● Updating</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Estimated completion: Soon
            </p>
          </div>

          <button
            onClick={() => location.reload()}
            className="mt-8 w-full rounded-2xl bg-white py-3 font-semibold text-slate-900 transition-all duration-300 hover:scale-[0.98] active:scale-95"
          >
            Refresh Page
          </button>

          <p className="mt-8 text-xs text-slate-500">
            Thank you for your understanding ❤️
          </p>
        </div>
      </div>
    </main>
  );
}
