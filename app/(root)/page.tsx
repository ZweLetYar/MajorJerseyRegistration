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
    rollNo: {
      rollPrefix: "",
      rollNumber: 1,
    },
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Roll Number
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

    // Year
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

    // Phone
    if (name === "phone") {
      setForm((prev) => ({
        ...prev,
        phone: value.startsWith("+95") ? value : "+95",
      }));
      return;
    }

    // Other fields
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");

    if (form.rollNo.rollNumber > 150) {
      setSubmitMessage("Roll number cannot exceed 150");
      return;
    }

    if (!form.rollNo.rollPrefix) {
      setSubmitMessage("Please select your year first.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.registrants.validate({
        ...form,
        paymentProofUrl: "",
      });

      if (!response?.success) {
        setSubmitMessage(response?.message || "Unable to continue.");
        return;
      }

      sessionStorage.setItem("registration", JSON.stringify(form));

      const qr = getQR(form.year);

      router.push(`/payment/${qr}`);
    } catch (error) {
      console.error(error);
      setSubmitMessage("Something went wrong while checking your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center ">
      <div className="w-full h-full max-w-sm bg-white rounded-2xl shadow-lg p-7 mt-10">
        <h1 className="text-xl font-bold text-center text-blue-900">
          Major Jacket Registration
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your details
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm"
            required
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm"
            required
          />

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm"
            required
          >
            <option value="">Select Year</option>
            <option value="1st year">1st Year</option>
            <option value="2nd year">2nd Year</option>
            <option value="3rd year">3rd Year</option>
            <option value="4th year">4th Year</option>
            <option value="5th year(first sem)">5th Year (first sem)</option>
            <option value="5th year(second sem)">5th Year (second sem)</option>
            <option value="6th year">6th Year</option>
          </select>

          <div className="flex gap-2">
            <input
              value={form.rollNo.rollPrefix}
              placeholder="Roll No."
              readOnly
              className="w-[60%] p-3 border rounded-lg text-sm bg-gray-100"
            />

            <input
              name="rollNumber"
              type="number"
              min={1}
              max={150}
              // value={form.rollNo.rollNumber}
              onChange={handleChange}
              placeholder="(e.g. 1, 34, 99)"
              className="w-[40%] p-3 border rounded-lg text-sm"
              required
            />
          </div>

          {submitMessage ? (
            <p className="text-sm text-red-500">{submitMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white p-3 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-700"
          >
            {isSubmitting ? "Checking..." : "Register & Pay"}
          </button>
        </form>
      </div>
      <p className="text-xs font-medium text-center text-blue-700 mt-6 w-[90%] max-w-sm leading-relaxed">
        Jacket pricing may range from 38,500 MMK to 43,500 MMK depending on the
        final registration quantity.
      </p>
    </div>
  );
}
