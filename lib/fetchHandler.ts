import { handleErrorResponse } from "./response";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export default async function fetchHandler(
  url: string,
  options: FetchOptions = {},
) {
  const { timeout = 50000, headers: customHeaders, ...restOptions } = options;

  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...customHeaders,
    },
    signal: controller.signal,
  };

  try {
    const res = await fetch(url, config);
    clearTimeout(id);

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);

    if (!res.ok) {
      if (payload && typeof payload === "object") {
        return {
          success: false,
          ...(payload as Record<string, unknown>),
          status: (payload as { status?: number }).status ?? res.status,
        };
      }

      return {
        success: false,
        message: "Request failed",
        status: res.status,
      };
    }

    return payload ?? { success: true };
  } catch (e) {
    return handleErrorResponse(e);
  }

  // try {
  //   const res = await fetch(url, config);
  //   clearTimeout(id);

  //   const data = await res.json().catch(() => ({}));

  //   if (!res.ok) {
  //     return { success: false, status: res.status, data };
  //   }

  //   return { success: true, data };
  // } catch (e) {
  //   return handleErrorResponse(e);
  // }
}
