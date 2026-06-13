import { NextResponse } from "next/server";
import { ZodError } from "zod";

//define function
const handleSuccessResponse = (data: unknown, status: number = 200) => {
  const total = Array.isArray(data) ? data.length : 1; //coz data.length can't be used in metadata
  return NextResponse.json(
    {
      meta: {
        total,
      },
      data,
      success: true,
    },
    { status },
  );
};
//define function
const handleErrorResponse = (e: unknown) => {
  let message = "Internal server error";
  let status = 500;
  let details = null;

  if (
    e &&
    (e as { constructor?: { name?: string } }).constructor?.name === "ZodError"
  ) {
    const zodError = e as ZodError;
    details = zodError.flatten().fieldErrors;
    status = 400;
    message = "Validation error";
  } else if (e instanceof Error) {
    message = e.message;
  }

  return NextResponse.json({ details, message, success: false }, { status });
};
//define function
const actionError = (e: unknown) => {
  let message = "Internal server error";

  let details = null;

  if (
    e &&
    (e as { constructor?: { name?: string } }).constructor?.name === "ZodError"
  ) {
    const zodError = e as ZodError;
    details = zodError.flatten().fieldErrors;

    message = "Validation error";
  } else if (e instanceof Error) {
    message = e.message;
  }

  return { details, message, success: false };
};

export { handleSuccessResponse, handleErrorResponse, actionError };
