import DynamicPaymentAmount from "@/components/DynamicPaymentAmount";
import PaymentDetails from "@/components/PaymentDetails";
import RegisterForm from "@/components/RegisterForm";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 mt-10 flex flex-col text-center items-center justify-center">
        <DynamicPaymentAmount />
        <PaymentDetails id={id} />

        <h1 className="text-xs text-red-500 mt-2">
          *You need to upload a payment screenshot*
        </h1>

        <RegisterForm />
      </div>
    </div>
  );
}
