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
    if (!res.ok) {
      throw new Error("HTTP ERROR");
    }

    return await res.json();
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
