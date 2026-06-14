"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Student = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  rollNo: {
    rollPrefix: string;
    rollNumber: number;
  };
  paymentProofUrl?: string;
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
        const response = await fetch("/api/register");
        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load registrants");
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
      const response = await fetch(`/api/register?id=${studentId}`, {
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

  const sendMail = async (student: Student) => {
    await fetch("/api/send-confirmation", {
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
  };

  const handleConfirm = async (student: Student) => {
    await handleStatusChange(student._id, "confirmed");
    await sendMail(student);
  };

  return (
    <div className="min-h-screen  px-3 py-4 text-slate-800 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/admin/dashboardyenom"
            className="text-sm font-medium text-blue-900 hover:underline"
          >
            ← Back to overview
          </Link>
          <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
            {yearStudents.length} registrants
          </span>
        </div>

        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-xl font-semibold text-blue-900 sm:text-2xl">
            {yearParam || "Year Details"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Detailed list of students registered under this year group.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-blue-900">
                {yearStudents.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Confirmed
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {confirmedCount}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="text-sm text-slate-600">Loading registrants...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : yearStudents.length === 0 ? (
            <div className="text-sm text-slate-600">
              No registrants found for this year.
            </div>
          ) : (
            <div className="space-y-3">
              {yearStudents
                .sort((a, b) => a.rollNo.rollNumber - b.rollNo.rollNumber)
                .map((student) => (
                  <div
                    key={student._id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-800">
                            {student.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              student.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : student.status === "rejected"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {student.status === "confirmed"
                              ? "Confirmed"
                              : student.status === "rejected"
                                ? "Rejected"
                                : "Unchecked"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {student.email}
                        </p>
                        <p className="text-sm text-slate-600">
                          {student.phone}
                        </p>
                        <p className="text-sm text-slate-600">
                          {student.rollNo.rollPrefix}
                          {"-"}
                          {student.rollNo.rollNumber}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                        <button
                          type="button"
                          onClick={() => handleConfirm(student)}
                          disabled={updatingId === student._id}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(student._id, "rejected")
                          }
                          disabled={updatingId === student._id}
                          className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {student.paymentProofUrl ? (
                      <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white p-2">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                      <p className="mt-3 text-sm text-slate-400">
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
