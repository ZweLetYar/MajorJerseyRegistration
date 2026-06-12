"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RegisterForm() {
  const router = useRouter();

  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    rollNo: { rollPrefix: "", rollNumber: 1 },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("registration");

    if (!stored || stored === "undefined") return;

    try {
      setRegistration(JSON.parse(stored));
    } catch (err) {
      console.error("Invalid sessionStorage data:", err);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadMessage(file ? `Selected: ${file.name}` : "No file selected");
  };

  return (
    <div className="mb-4 mt-2 w-[90%] rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-blue-900">Upload Screenshot</p>
        <span className="text-[11px] text-slate-500">PNG, JPG, JPEG</span>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:border-blue-900 hover:bg-blue-50">
        <span className="flex items-center gap-2 text-sm font-medium text-blue-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-4.5 4.5-4.5m0 0 4.5 4.5m-4.5-4.5v12"
            />
          </svg>
          {selectedFile ? "Change image" : "Upload image"}
        </span>
        <span className="rounded-full bg-blue-900 px-2.5 py-1 text-[11px] font-semibold text-white">
          Browse
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <p className="mt-2 text-[11px] text-slate-500">
        {selectedFile ? uploadMessage : "Tap to add your payment screenshot"}
      </p>

      <button
        type="button"
        onClick={() => router.push("/success")}
        className="mt-3 w-full rounded-xl bg-blue-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        Register
      </button>
    </div>
  );
}

export default RegisterForm;
