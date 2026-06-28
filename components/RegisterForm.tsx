"use client";

import { api } from "@/lib/api";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type StudentStatus = "confirmed" | "unchecked" | "rejected";

type RegistrationData = {
  name: string;
  email: string;
  phone: string;
  year: string;
  size: string;
  rollNo: { rollPrefix: string; rollNumber: number };
  status?: StudentStatus;
};

function RegisterForm() {
  const router = useRouter();

  const [registration, setRegistration] = useState<RegistrationData>({
    name: "",
    email: "",
    phone: "",
    year: "",
    size: "",
    rollNo: { rollPrefix: "", rollNumber: 1 },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const { startUpload, isUploading } = useUploadThing("paymentImage", {
    onUploadBegin: () => {
      setUploadMessage("Uploading...");
    },
    onUploadProgress: (progress) => {
      setUploadMessage(`Uploading... ${progress}%`);
    },
    onClientUploadComplete: (res) => {
      const uploadedFile = res?.[0];

      if (uploadedFile?.url) {
        setUploadedUrl(uploadedFile.url);
        setUploadMessage(`✓ ${uploadedFile.name ?? "Image uploaded"}`);
        return;
      }

      setUploadedUrl("");
      setUploadMessage("Upload completed but no file URL was returned.");
    },
    onUploadError: (error) => {
      setUploadedUrl("");
      setUploadMessage("Upload failed");
      setSubmitMessage(error.message || "Image upload failed.");
    },
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("registration");

    if (!stored || stored === "undefined") return;

    try {
      setRegistration(JSON.parse(stored) as RegistrationData);
    } catch (err) {
      console.error("Invalid sessionStorage data:", err);
    }
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      setUploadedUrl("");
      setUploadMessage("");
      setSubmitMessage("");
      return;
    }

    setSelectedFile(file);
    setUploadedUrl("");
    setUploadMessage(`Preparing ${file.name}...`);
    setSubmitMessage("");

    try {
      await startUpload([file]);
    } catch (error) {
      console.error(error);
      setUploadedUrl("");
      setUploadMessage("Upload failed");
      setSubmitMessage("Image upload failed.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !uploadedUrl) {
      setSubmitMessage("Please upload a payment screenshot first.");
      return;
    }

    if (isUploading) {
      setSubmitMessage("Upload is still in progress. Please wait.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      const stored = sessionStorage.getItem("registration");

      const payloadData =
        stored && stored !== "undefined"
          ? (JSON.parse(stored) as RegistrationData)
          : registration;

      const response = await api.orders.create({
        ...payloadData,
        paymentProofUrl: uploadedUrl,
        status: "unchecked",
      });

      if (response?.success) {
        router.push("/success");
        return;
      }

      setSubmitMessage(response?.message || "Registration failed.");
    } catch (err) {
      console.error(err);
      setSubmitMessage("Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Payment Screenshot
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Upload your payment proof to complete registration.
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-zinc-400">
          PNG • JPG • JPEG
        </span>
      </div>

      {/* Upload Box */}
      <label className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900/60 px-4 py-4 transition-all duration-300 hover:border-blue-500 hover:bg-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-4.5 4.5-4.5m0 0 4.5 4.5m-4.5-4.5v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {selectedFile ? "Change Screenshot" : "Choose Screenshot"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {selectedFile
                ? selectedFile.name
                : "Click here to browse your payment proof"}
            </p>
          </div>
        </div>

        <span className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition group-hover:from-blue-500 group-hover:to-indigo-500">
          Browse
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Upload Status */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
        <p className="text-xs text-zinc-400">
          {selectedFile ? uploadMessage : "No screenshot selected."}
        </p>
      </div>

      {/* Error */}
      {submitMessage && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3">
          <p className="text-xs font-medium text-red-400">{submitMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || isUploading}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting
          ? "Submitting..."
          : isUploading
            ? "Uploading..."
            : "Complete Registration"}
      </button>
    </div>
  );
}

export default RegisterForm;
