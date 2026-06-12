// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getQR } from "@/lib/qr";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "+95",
//     year: "",
//     rollNo: { rollPrefix: "", rollNumber: 1 },
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;

//     let updated = { ...form, [name]: value };

//     // Year → set prefix
//     if (name === "year") {
//       const map: any = {
//         "1st year": "1IST",
//         "2nd year": "2IST",
//         "3rd year": "3IST",
//         "4th year": "4IST",
//         "5th year(first sem)": "5IST",
//         "5th year(second sem)": "5IST",
//         "6th year": "6IST",
//       };

//       updated.rollNo.rollPrefix = map[value] || "";
//     }

//     // Phone validation (+95 only)
//     if (name === "phone") {
//       updated.phone = value.startsWith("+95") ? value : "+95";
//     }

//     setForm(updated);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     sessionStorage.setItem("registration", JSON.stringify(form));

//     let qr = getQR(form.year);
//     router.push(`/payment/${qr}`);

//     // const fullRollNo = `${form.rollPrefix}-${form.rollNumber}`;

//     // const payload = {
//     //   ...form,
//     //   rollNo: fullRollNo,
//     // };

//     // const res = await fetch("/api/register", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify(payload),
//     // });

//     // const data = await res.json();

//     // if (data?.id) {
//     //   router.push(`/payment/${data.id}`);
//     // }
//   };

//   if (form.rollNo.rollNumber > 150) {
//     alert("Roll number cannot exceed 150");
//     return;
//   }

//   return (
//     <div className="w-full h-full max-w-sm bg-white rounded-2xl shadow-lg p-6 mt-15 ">
//       <h1 className="text-xl font-bold text-center text-blue-900">
//         Major Jersey Registration
//       </h1>

//       <p className="text-sm text-gray-500 text-center mb-6">
//         Enter your details
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-3">
//         {/* Name */}
//         <input
//           name="name"
//           placeholder="Full Name"
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg text-sm"
//           required
//         />

//         {/* Email */}
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg text-sm"
//           required
//         />

//         {/* Phone */}
//         <input
//           name="phone"
//           type="tel"
//           value={form.phone}
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg text-sm"
//           required
//         />

//         {/* Year */}
//         <select
//           name="year"
//           onChange={handleChange}
//           className="w-full p-3 border rounded-lg text-sm"
//           required
//         >
//           <option value="">Select Year</option>
//           <option value="1st year">1st Year</option>
//           <option value="2nd year">2nd Year</option>
//           <option value="3rd year">3rd Year</option>
//           <option value="4th year">4th Year</option>

//           <option value="5th year(first sem)">5th Year (first sem)</option>
//           <option value="5th year(second sem)">5th Year (second sem)</option>
//           <option value="6th year">6th Year</option>
//         </select>

//         <div className="flex gap-2">
//           {/* Roll Prefix (auto) */}
//           <input
//             value={form.rollNo.rollPrefix}
//             placeholder="Roll No"
//             readOnly
//             className="w-[60%] p-3 border rounded-lg text-sm bg-gray-100"
//           />

//           {/* Roll Number (manual input) */}
//           <input
//             name="rollNumber"
//             type="number"
//             min={1}
//             max={150}
//             placeholder="(e.g. 1, 34, 99)"
//             onChange={handleChange}
//             className="w-[40%] p-3 border rounded-lg text-sm"
//             required
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full bg-blue-900 text-white p-3 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-800 transition-colors"
//         >
//           Register & Pay
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getQR } from "@/lib/qr";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.rollNo.rollNumber > 150) {
      alert("Roll number cannot exceed 150");
      return;
    }

    sessionStorage.setItem("registration", JSON.stringify(form));

    const qr = getQR(form.year);

    router.push(`/payment/${qr}`);
  };

  return (
    <div className="w-full h-full max-w-sm bg-white rounded-2xl shadow-lg p-6 mt-10">
      <h1 className="text-xl font-bold text-center text-blue-900">
        Major Jersey Registration
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

        <button
          type="submit"
          className="w-full bg-blue-900 text-white p-3 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-800"
        >
          Register & Pay
        </button>
      </form>
    </div>
  );
}
