import DynamicPaymentAmount from "@/components/DynamicPaymentAmount";
import PaymentDetails from "@/components/PaymentDetails";
import RegisterForm from "@/components/RegisterForm";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="min-h-screen w-full flex items-center justify-center  px-4 py-5">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 p-8">
        <div className="flex flex-col items-center text-center space-y-5">
          <DynamicPaymentAmount />

          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <PaymentDetails id={id} />
          </div>

          <div className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-xs font-medium text-red-400">
              * You need to upload a payment screenshot.
            </p>
          </div>

          <div className="w-full pt-2">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
