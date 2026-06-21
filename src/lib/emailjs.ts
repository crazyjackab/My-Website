import emailjs from "@emailjs/browser";
import { profile } from "@/data/profile";
import type { ContactFormData } from "./contact";
import { isEmailJsConfigured } from "./contact";

let initialized = false;

function ensureEmailJsInit(publicKey: string) {
  if (!initialized) {
    emailjs.init({ publicKey });
    initialized = true;
  }
}

export async function sendViaEmailJs(data: ContactFormData): Promise<void> {
  if (!isEmailJsConfigured()) {
    throw new Error(
      "EmailJS 未配置：请在 .env.local 中设置 NEXT_PUBLIC_EMAILJS_SERVICE_ID、TEMPLATE_ID、PUBLIC_KEY",
    );
  }

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  ensureEmailJsInit(publicKey);

  const templateParams = {
    from_name: data.name.trim(),
    from_email: data.email.trim(),
    reply_to: data.email.trim(),
    message: data.message.trim(),
    to_name: profile.name,
    user_email: data.email.trim(),
    user_message: data.message.trim(),
  };

  const result = await emailjs.send(serviceId, templateId, templateParams);

  if (result.status !== 200) {
    throw new Error("EmailJS 发送失败，请稍后重试");
  }
}
