import fetchHandler from "./fetchHandler";

const API_URL = "/api";

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
};
