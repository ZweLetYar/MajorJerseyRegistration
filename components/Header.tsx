import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-center py-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Image src="/logo.jpg" alt="IST Logo" width={45} height={45} />

        <div className="leading-tight">
          <h1 className="text-sm font-bold text-blue-900">
            Information Science and Technology
          </h1>
          <p className="text-xs text-gray-500">
            University of Technology (Yatanarpon Cyber City)
          </p>
        </div>
      </div>
    </div>
  );
}
