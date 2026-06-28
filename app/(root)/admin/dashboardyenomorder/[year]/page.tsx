"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Student = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  size: string;
  rollNo: {
    rollPrefix: string;
    rollNumber: number;
  };
  paymentProofUrl?: string;
  isRegistrant: boolean;
  createdAt?: string;
  status?: "confirmed" | "unchecked" | "rejected";
};

function Page() {
  const params = useParams<{ year?: string }>();
  const yearParam = decodeURIComponent(params?.year ?? "");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/order");
        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load orders");
        }

        setStudents(data.students || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const yearStudents = useMemo(() => {
    return students.filter((student) => student.year === yearParam);
  }, [students, yearParam]);

  const confirmedCount = yearStudents.filter(
    (student) => student.status === "confirmed",
  ).length;
  const uncheckedCount = yearStudents.filter(
    (student) =>
      student.status !== "confirmed" && student.status !== "rejected",
  ).length;

  const handleStatusChange = async (
    studentId: string,
    nextStatus: "confirmed" | "rejected",
  ) => {
    setUpdatingId(studentId);

    try {
      const response = await fetch(`/api/order?id=${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to update status");
      }

      setStudents((current) =>
        current.map((student) =>
          student._id === studentId
            ? { ...student, status: nextStatus }
            : student,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const sendConfirmation = async (student: Student) => {
    const response = await fetch("/api/send-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: student.email,
        name: student.name,
        year: student.year,
        rollNo: `${student.rollNo.rollPrefix}-${student.rollNo.rollNumber}`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || "Failed to send confirmation email");
    }
  };

  const sendRejectionMail = async (student: Student) => {
    const response = await fetch("/api/send-rejection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: student.email,
        name: student.name,
        year: student.year,
        rollNo: `${student.rollNo.rollPrefix}-${student.rollNo.rollNumber}`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || "Failed to send rejection email");
    }
  };

  const handleConfirm = async (student: Student) => {
    try {
      await handleStatusChange(student._id, "confirmed");
      await sendConfirmation(student);
      toast.success(`Confirmation email sent to ${student.name}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to confirm student";
      setError(message);
      toast.error(message);
    }
  };

  const handleReject = async (student: Student) => {
    try {
      await handleStatusChange(student._id, "rejected");
      await sendRejectionMail(student);
      toast.success(`Rejection email sent to ${student.name}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reject student";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen  px-3 py-6 text-slate-200 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/admin/dashboardyenomorder"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
          >
            ← Back to overview
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            {yearStudents.length} registrants
          </span>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white">
            {yearParam || "Year Details"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Detailed list of students registered under this year group.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {yearStudents.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Confirmed
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {confirmedCount}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl   shadow-sm sm:p-6">
          {loading ? (
            <div className="text-sm text-slate-600">Loading orders...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : yearStudents.length === 0 ? (
            <div className="text-sm text-slate-600">
              No orders found for this year.
            </div>
          ) : (
            <div className="space-y-3">
              {yearStudents
                .sort((a, b) => a.rollNo.rollNumber - b.rollNo.rollNumber)
                .map((student) => (
                  <div
                    key={student._id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md transition hover:border-indigo-500/40 hover:bg-white/[0.07]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {student.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              student.status === "confirmed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : student.status === "rejected"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {student.status === "confirmed"
                              ? "Confirmed"
                              : student.status === "rejected"
                                ? "Rejected"
                                : "Unchecked"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {student.email}
                        </p>
                        <p className="text-sm text-slate-400">
                          {student.phone}
                        </p>
                        <p className="text-sm text-slate-400">
                          {student.rollNo.rollPrefix}
                          {"-"}
                          {student.rollNo.rollNumber}
                        </p>
                        <div className="pt-2">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide border transition ${
                              student.isRegistrant
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                : "bg-slate-500/10 text-slate-300 border-white/10"
                            }`}
                          >
                            {student.isRegistrant ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Registrant
                              </>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                Non-Registrant
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                        {/* Confirm Button */}
                        <button
                          type="button"
                          onClick={() => handleConfirm(student)}
                          disabled={updatingId === student._id}
                          className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <span className="relative flex items-center gap-2">
                            <span className="text-emerald-300 group-hover:scale-110 transition">
                              ✓
                            </span>
                            {updatingId === student._id
                              ? "Processing..."
                              : "Confirm"}
                          </span>

                          {/* glow effect */}
                          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-emerald-500/10 via-emerald-400/10 to-transparent" />
                        </button>

                        {/* Reject Button */}
                        <button
                          type="button"
                          onClick={() => handleReject(student)}
                          disabled={updatingId === student._id}
                          className="group relative overflow-hidden rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all duration-200 hover:border-rose-400/50 hover:bg-rose-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <span className="relative flex items-center gap-2">
                            <span className="text-rose-300 group-hover:scale-110 transition">
                              ✕
                            </span>
                            {updatingId === student._id
                              ? "Processing..."
                              : "Reject"}
                          </span>

                          {/* glow effect */}
                          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-rose-500/10 via-rose-400/10 to-transparent" />
                        </button>
                      </div>
                    </div>

                    {student.paymentProofUrl ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Payment Proof
                        </p>
                        <a
                          href={student.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-lg"
                        >
                          <img
                            src={student.paymentProofUrl}
                            alt={`${student.name} payment proof`}
                            className="h-48 w-full object-cover sm:h-56"
                          />
                        </a>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500 italic">
                        No payment proof uploaded.
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Page;
