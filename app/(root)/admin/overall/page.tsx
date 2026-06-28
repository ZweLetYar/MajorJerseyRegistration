"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  _id: string;
  name: string;
  phone: string;
  size: string;
  status?: "confirmed" | "rejected" | "unchecked";
  rollNo: {
    rollPrefix: string;
    rollNumber: number;
  };
  year: string;
};

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order");
        const data = await res.json();

        if (data?.success) {
          setStudents(data.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ ONLY CONFIRMED ORDERS
  const confirmedStudents = useMemo(() => {
    return students.filter((s) => s.status === "confirmed");
  }, [students]);

  // Size counts (confirmed only)
  const sizeStats = useMemo(() => {
    return confirmedStudents.reduce(
      (acc, s) => {
        const size = s.size?.toUpperCase();
        if (size === "M") acc.M++;
        else if (size === "L") acc.L++;
        else if (size === "XL") acc.XL++;
        return acc;
      },
      { M: 0, L: 0, XL: 0 },
    );
  }, [confirmedStudents]);

  return (
    <div className="min-h-screen px-4 py-6 text-slate-200">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white">Confirmed Orders</h1>

          <p className="mt-1 text-sm text-slate-400">
            Only confirmed students are shown here
          </p>

          {/* Size Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">Size M</p>
              <p className="text-xl font-bold text-white">{sizeStats.M}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">Size L</p>
              <p className="text-xl font-bold text-white">{sizeStats.L}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">Size XL</p>
              <p className="text-xl font-bold text-white">{sizeStats.XL}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <h2 className="text-lg font-semibold text-white">
              Confirmed Students
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-slate-400">Loading orders...</div>
          ) : confirmedStudents.length === 0 ? (
            <div className="p-6 text-slate-400">No confirmed orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Roll No</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Size</th>
                  </tr>
                </thead>

                <tbody>
                  {confirmedStudents.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 font-medium text-white">{s.name}</td>

                      <td className="p-4 text-slate-300">
                        {s.rollNo.rollPrefix}-{s.rollNo.rollNumber}
                      </td>

                      <td className="p-4 text-slate-300">{s.phone}</td>

                      <td className="p-4">
                        <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          {s.size}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
