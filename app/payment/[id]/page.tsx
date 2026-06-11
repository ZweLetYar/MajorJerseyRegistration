import Image from "next/image";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 mt-15 text-center items-center justify-center">
        <h1 className="text-xl font-bold text-blue-900 mb-4">Payment</h1>
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={`/${id}`}
            alt={`${id}`}
            width={200}
            height={100}
            className="mt-10"
          />
        </div>
      </div>
    </div>
  );
}

export default page;
