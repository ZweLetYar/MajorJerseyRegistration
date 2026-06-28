"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getQR } from "@/lib/qr";
import { api } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "+95",
    year: "",
    size: "",
    rollNo: {
      rollPrefix: "",
      rollNumber: 1,
    },
    isRegistrant: false,
  });

  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSizeChart, setOpenSizeChart] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "rollNumber") {
      setForm((prev) => ({
        ...prev,
        rollNo: {
          ...prev.rollNo,
          rollNumber: Number(value),
        },
      }));
      return;
    }

    if (name === "year") {
      const map: Record<string, string> = {
        "1st year": "1IST",
        "2nd year": "2IST",
        "3rd year": "3IST",
        "4th year": "4IST",
        "5th year(first sem)": "5IST",
        "5th year(second sem)": "5IST",
        "6th year": "6IST",
      };

      setForm((prev) => ({
        ...prev,
        year: value,
        rollNo: {
          ...prev.rollNo,
          rollPrefix: map[value] || "",
        },
      }));
      return;
    }

    if (name === "phone") {
      setForm((prev) => ({
        ...prev,
        phone: value.startsWith("+95") ? value : "+95",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");

    try {
      setIsSubmitting(true);

      const response = await api.orders.validate({
        ...form,
        paymentProofUrl: "",
      });

      if (!response?.success) {
        setSubmitMessage(response?.message || "Unable to continue.");
        return;
      }

      const updatedForm = {
        ...form,
        isRegistrant: response?.isRegistrant ?? false,
      };

      setForm(updatedForm);

      sessionStorage.setItem("registration", JSON.stringify(updatedForm));

      const qr = getQR(updatedForm.year);
      router.push(`/payment/${qr}`);
    } catch (error) {
      console.error(error);
      setSubmitMessage("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-10">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0f172a] p-7 shadow-2xl backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-center text-white">
          Major Jacket Order
        </h1>

        <p className="text-sm text-slate-400 text-center mt-2 mb-6">
          Enter your details to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            required
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            required
          />

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            required
          >
            <option value="">Select Year</option>
            <option value="1st year">1st Year</option>
            <option value="2nd year">2nd Year</option>
            <option value="3rd year">3rd Year</option>
            <option value="4th year">4th Year</option>
            <option value="5th year(first sem)">5th Year (1st sem)</option>
            <option value="5th year(second sem)">5th Year (2nd sem)</option>
            <option value="6th year">6th Year</option>
          </select>

          <div className="flex gap-2">
            <input
              value={form.rollNo.rollPrefix}
              readOnly
              className="w-[60%] rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300"
              placeholder="Roll no."
            />

            <input
              name="rollNumber"
              type="number"
              min={1}
              max={150}
              onChange={handleChange}
              className="w-[40%] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              required
              placeholder="eg. 1, 38, 100"
            />
          </div>
          <div className="flex gap-2">
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              className="flex-1 w-[60%] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              required
            >
              <option value="">Select Size</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <button
              type="button"
              onClick={() => setOpenSizeChart(true)}
              className="rounded-xl w-[40%] border border-indigo-500 bg-indigo-500/10 px-2 py-2 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20"
            >
              Size Chart
            </button>
          </div>

          {openSizeChart && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Jacket Size Chart
                  </h2>

                  <button
                    type="button"
                    onClick={() => setOpenSizeChart(false)}
                    className="text-2xl text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm text-slate-300">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-2 text-left">Size</th>
                        <th className="p-2 text-center">Chest</th>
                        <th className="p-2 text-center">Length</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="p-2">M</td>
                        <td className="p-2 text-center">46"</td>
                        <td className="p-2 text-center">25"</td>
                      </tr>

                      <tr className="border-b border-white/10">
                        <td className="p-2">L</td>
                        <td className="p-2 text-center">48"</td>
                        <td className="p-2 text-center">26.5"</td>
                      </tr>

                      <tr>
                        <td className="p-2">XL</td>
                        <td className="p-2 text-center">50"</td>
                        <td className="p-2 text-center">28"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {submitMessage && (
            <p className="text-sm text-red-400">{submitMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white"
          >
            {isSubmitting ? "Checking..." : "Order & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
