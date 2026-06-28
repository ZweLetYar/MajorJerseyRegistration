import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className=" flex items-center justify-center  px-4 py-3">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-white">
          Pre-Order Successful
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Your submission has been received. Our team will review it and send
          confirmation within 24 hours.{" "}
          <span className="text-emerald-400">
            Please also check your spam folder.
          </span>{" "}
          Thank you for participating.
        </p>

        {/* Info box */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            What happens next
          </p>

          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>• Payment proof received successfully</li>
            <li>• Verification will be completed by admin</li>
            <li>• You’ll receive an email once approved</li>
          </ul>
        </div>

        {/* Button */}
        <Link
          href="/design"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
