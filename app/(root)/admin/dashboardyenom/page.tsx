"use client";

import Link from "next/link";
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

  const groupedStudents = useMemo(() => {
    return students.reduce<Record<string, Student[]>>((acc, student) => {
      const year = student.year || "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(student);
      return acc;
    }, {});
  }, [students]);

  const yearEntries = useMemo(() => {
    return Object.entries(groupedStudents).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [groupedStudents]);

  const totalRegistrants = students.length;
  const confirmedRegistrants = students.filter(
    (student) => student.status === "confirmed",
  ).length;
  const uncheckedRegistrants = students.filter(
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

  //first 30 registrants

  const oldest30Students = useMemo(() => {
    return [...students]
      .sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime(),
      )
      .slice(0, 30);
  }, [students]);

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const paginatedStudents = useMemo(() => {
    const reversed = [...oldest30Students].reverse();
    const start = (page - 1) * pageSize;
    return reversed.slice(start, start + pageSize);
  }, [oldest30Students, page]);

  const totalPages = Math.ceil(oldest30Students.length / pageSize);

  return (
    <div className="min-h-screen  px-3 py-4 text-slate-800 sm:px-4 sm:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <aside className="w-full lg:w-72 lg:shrink-0">
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Year Navigation
            </h2>
            <nav className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-2">
              {yearEntries.map(([year, yearStudents]) => (
                <Link
                  key={year}
                  href={`/admin/dashboardyenom/${encodeURIComponent(year)}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-900 hover:bg-blue-50 hover:text-blue-900"
                >
                  <span>{year}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {yearStudents.length}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <h1 className="text-xl font-semibold text-blue-900 sm:text-2xl">
              Registrants Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Overview of all registered students and quick access to each
              year’s detail page.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-semibold text-blue-900">
                  {totalRegistrants}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Confirmed
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-600">
                  {confirmedRegistrants}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Unchecked
                </p>
                <p className="mt-1 text-2xl font-semibold text-amber-600">
                  {uncheckedRegistrants}
                </p>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm sm:p-6">
              Loading registrants...
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 shadow-sm sm:p-6">
              {error}
            </div>
          ) : yearEntries.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm sm:p-6">
              No registrants found yet.
            </div>
          ) : (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-900">
                  Year Overview
                </h2>
                <span className="text-sm text-slate-500">
                  Tap a year for details
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {yearEntries.map(([year, yearStudents]) => (
                  <Link
                    key={year}
                    href={`/admin/dashboardyenom/${encodeURIComponent(year)}`}
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-900 hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">{year}</h3>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-900">
                        {yearStudents.length}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {
                        yearStudents.filter(
                          (student) => student.status === "confirmed",
                        ).length
                      }{" "}
                      confirmed •{" "}
                      {
                        yearStudents.filter(
                          (student) =>
                            student.status !== "confirmed" &&
                            student.status !== "rejected",
                        ).length
                      }{" "}
                      unchecked
                    </p>
                  </Link>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 mt-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-blue-900">
                    Recent Registrants
                  </h2>

                  <span className="text-xs text-slate-500">
                    the first 30 registrants
                  </span>
                </div>

                {/* List */}
                <div className="space-y-2">
                  {paginatedStudents.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Year: {student.year}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-900">
                          {student.rollNo?.rollPrefix}-
                          {student.rollNo?.rollNumber}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-xs text-slate-500">
                    Page {page} of {totalPages || 1}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Page;
