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

      if (!response?.success && response?.message !== "Registrant") {
        setSubmitMessage(response?.message || "Unable to continue.");
        return;
      }

      // Create the updated object before saving
      const updatedForm = {
        ...form,
        isRegistrant: response?.message === "Registrant",
      };

      // Update React state
      setForm(updatedForm);

      // Save the updated data
      sessionStorage.setItem("registration", JSON.stringify(updatedForm));

      console.log(updatedForm);

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
        {/* Title */}
        <h1 className="text-xl font-semibold text-center text-white">
          Major Jacket Order
        </h1>

        <p className="text-sm text-slate-400 text-center mt-2 mb-6">
          Enter your details to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* INPUTS */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            required
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
            required
          />

          {/* YEAR */}
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
            required
          >
            <option value="" className="text-black">
              Select Year
            </option>
            <option value="1st year" className="text-black">
              1st Year
            </option>
            <option value="2nd year" className="text-black">
              2nd Year
            </option>
            <option value="3rd year" className="text-black">
              3rd Year
            </option>
            <option value="4th year" className="text-black">
              4th Year
            </option>
            <option value="5th year(first sem)" className="text-black">
              5th Year (first sem)
            </option>
            <option value="5th year(second sem)" className="text-black">
              5th Year (second sem)
            </option>
            <option value="6th year" className="text-black">
              6th Year
            </option>
          </select>

          {/* SIZE */}
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
            required
          >
            <option value="" className="text-black">
              Select Size
            </option>
            <option value="M" className="text-black">
              M
            </option>
            <option value="L" className="text-black">
              L
            </option>
            <option value="XL" className="text-black">
              XL
            </option>
          </select>

          {/* ROLL */}
          <div className="flex gap-2">
            <input
              value={form.rollNo.rollPrefix}
              readOnly
              placeholder="Roll No."
              className="w-[60%] rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300"
            />

            <input
              name="rollNumber"
              type="number"
              min={1}
              max={150}
              onChange={handleChange}
              placeholder="(e.g. 1, 34, 99)"
              className="w-[40%] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* ERROR */}
          {submitMessage && (
            <p className="text-sm text-red-400">{submitMessage}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:bg-indigo-800"
          >
            {isSubmitting ? "Checking..." : "Order & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
