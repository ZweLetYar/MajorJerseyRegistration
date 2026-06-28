"use client";

import useSessionData from "./useSessionData";

function DynamicPaymentAmount() {
  const sessionData = useSessionData();

  return (
    <div>
      <h1 className="text-xl font-bold text-white mt-4 mb-2">
        Payment (
        {sessionData?.storedData?.isRegistrant === false ? "39,500" : "36,500"}{" "}
        MMK)
      </h1>
    </div>
  );
}

export default DynamicPaymentAmount;
