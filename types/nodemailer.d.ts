declare module "nodemailer" {
  interface SendMailOptions {
    from?: string;
    to: string;
    replyTo?: string;
    subject: string;
    text?: string;
    html: string;
  }

  interface Transporter {
    sendMail(options: SendMailOptions): Promise<unknown>;
  }

  interface NodemailerStatic {
    createTransport(config: Record<string, unknown>): Transporter;
  }

  const nodemailer: NodemailerStatic;
  export default nodemailer;
}
