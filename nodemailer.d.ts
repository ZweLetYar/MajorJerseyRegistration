declare module "nodemailer" {
  export interface SendMailOptions {
    from?: string;
    to: string;
    subject: string;
    html: string;
  }

  export interface Transporter {
    sendMail(options: SendMailOptions): Promise<unknown>;
  }

  export interface NodemailerStatic {
    createTransport(config: Record<string, unknown>): Transporter;
  }

  const nodemailer: NodemailerStatic;
  export default nodemailer;
}
