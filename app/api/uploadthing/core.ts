import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  paymentImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Payment image uploaded:", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
