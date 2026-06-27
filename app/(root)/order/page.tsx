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
            <option value="5th year(first sem)">5th Year (1st)</option>
            <option value="5th year(second sem)">5th Year (2nd)</option>
            <option value="6th year">6th Year</option>
          </select>

          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            required
          >
            <option value="">Select Size</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <div className="flex gap-2">
            <input
              value={form.rollNo.rollPrefix}
              readOnly
              className="w-[60%] rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300"
            />

            <input
              name="rollNumber"
              type="number"
              min={1}
              max={150}
              onChange={handleChange}
              className="w-[40%] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              required
            />
          </div>

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
