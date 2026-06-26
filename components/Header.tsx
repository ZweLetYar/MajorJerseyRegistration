// import Image from "next/image";

// export default function Header() {
//   return (
//     <div className="w-full flex items-center justify-center py-4 bg-white shadow-sm">
//       <div className="flex items-center gap-3">
//         <Image src="/logo.jpg" alt="IST Logo" width={45} height={45} />

//         <div className="leading-tight">
//           <h1 className="text-sm font-bold text-blue-900">
//             Information Science and Technology
//           </h1>
//           <p className="text-xs text-gray-500">
//             University of Technology (Yatanarpon Cyber City)
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl">
      <div className="flex items-center justify-center px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="rounded-xl bg-white/5 p-1">
            <Image
              src="/logo.jpg"
              alt="IST Logo"
              width={42}
              height={42}
              className="rounded-lg"
            />
          </div>

          {/* Text */}
          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-white">
              Information Science and Technology
            </h1>
            <p className="text-xs text-slate-400">
              University of Technology (Yatanarpon Cyber City)
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
