"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "+95",
    year: "",
    rollPrefix: "",
    rollNumber: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    // Year → set prefix
    if (name === "year") {
      const map: any = {
        "1st": "1IST",
        "2nd": "2IST",
        "3rd": "3IST",
        "4th": "4IST",
        "5th1": "5IST",
        "5th2": "5IST",
        "6th": "6IST",
      };

      updated.rollPrefix = map[value] || "";
    }

    // Phone validation (+95 only)
    if (name === "phone") {
      updated.phone = value.startsWith("+95") ? value : "+95";
    }

    setForm(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullRollNo = `${form.rollPrefix}-${form.rollNumber}`;

    const payload = {
      ...form,
      rollNo: fullRollNo,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.id) {
      router.push(`/payment/${data.id}`);
    }
  };

  if (form.rollNumber > 150) {
    alert("Roll number cannot exceed 150");
    return;
  }

  return (
    <div className="w-full h-full max-w-sm bg-white rounded-2xl shadow-lg p-6 mt-15 ">
      <h1 className="text-xl font-bold text-center text-blue-900">
        Major Jersey Registration
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your details
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg text-sm"
          required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg text-sm"
          required
        />

        {/* Phone */}
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg text-sm"
          required
        />

        {/* Year */}
        <select
          name="year"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg text-sm"
          required
        >
          <option value="">Select Year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>

          <option value="5th1">5th Year (first sem)</option>
          <option value="5th2">5th Year (second sem)</option>
          <option value="6th">6th Year</option>
        </select>

        <div className="flex gap-2">
          {/* Roll Prefix (auto) */}
          <input
            value={form.rollPrefix}
            placeholder="Roll No"
            readOnly
            className="w-[60%] p-3 border rounded-lg text-sm bg-gray-100"
          />

          {/* Roll Number (manual input) */}
          <input
            name="rollNumber"
            type="number"
            min={1}
            max={150}
            placeholder="(e.g. 1, 34, 99)"
            onChange={handleChange}
            className="w-[40%] p-3 border rounded-lg text-sm"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white p-3 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-800 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}
