import PaymentDetails from "@/components/PaymentDetails";
import RegisterForm from "@/components/RegisterForm";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 mt-10 flex flex-col  text-center items-center justify-center">
        <h1 className="text-xl font-bold text-blue-900 mb-4">
          Payment (3000 MMK)
        </h1>

        <PaymentDetails id={id} />
        <h1 className="text-xs  text-red-500 mt-2">
          *You need to upload a payment screenshot*
        </h1>
        <RegisterForm />
      </div>
      <p className="text-xs font-medium text-center text-blue-700 mt-6 w-[80%] max-w-sm leading-relaxed">
        Jacket pricing may range from 38,500 MMK to 43,500 MMK depending on the
        final registration quantity.
      </p>
    </div>
  );
}

export default page;
