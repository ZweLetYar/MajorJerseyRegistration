import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex  items-center justify-center bg-slate-50 px-4  py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
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

        <h1 className="text-2xl font-semibold text-blue-900">
          Registration Successful
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Our team will review it and send you a confirmation email within 24
          hours. We have a plan to give a present to the registrants 🥳, so
          please wait for the announcement. Thank you for registering!
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            What happens next?
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>• Your payment proof has been received.</li>
            <li>• We will verify your submission.</li>
            <li>• You will be notified once approved.</li>
          </ul>
        </div>

        <Link
          href="/register"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
