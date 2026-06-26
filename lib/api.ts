import fetchHandler from "./fetchHandler";

const API_URL = "/api";

type StudentStatus = "confirmed" | "unchecked" | "rejected";

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  year: string;
  rollNo: {
    rollPrefix: string;
    rollNumber: number;
  };
  paymentProofUrl?: string;
  validateOnly?: boolean;
  status?: StudentStatus;
}
interface OrderPayload {
  name: string;
  email: string;
  phone: string;
  year: string;
  size: string;
  rollNo: {
    rollPrefix: string;
    rollNumber: number;
  };
  paymentProofUrl?: string;
  validateOnly?: boolean;
  status?: StudentStatus;
}

export const api = {
  //-----------------user session--------------------

  registrants: {
    //to use api.registrants.getAll()
    getAll: () =>
      fetchHandler(`${API_URL}/register`, {
        method: "GET",
      }),

    //to use api.registrants.create()
    create: (data: RegisterPayload) =>
      fetchHandler(`${API_URL}/register`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    validate: (data: RegisterPayload) =>
      fetchHandler(`${API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ ...data, validateOnly: true }),
      }),
  },

  orders: {
    //to use api.orders.getAll()
    getAll: () =>
      fetchHandler(`${API_URL}/order`, {
        method: "GET",
      }),

    //to use api.orders.create()
    create: (data: OrderPayload) =>
      fetchHandler(`${API_URL}/order`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    validate: (data: OrderPayload) =>
      fetchHandler(`${API_URL}/order`, {
        method: "POST",
        body: JSON.stringify({ ...data, validateOnly: true }),
      }),
  },
};
