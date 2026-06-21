export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type ContactProvider = "resend" | "emailjs" | "mailto";

export interface ContactValidationResult {
  success: boolean;
  errors?: Partial<Record<keyof ContactFormData, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: ContactFormData): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (!name || name.length < 2) {
    errors.name = "姓名至少需要 2 个字符";
  } else if (name.length > 100) {
    errors.name = "姓名不能超过 100 个字符";
  }

  if (!email || !EMAIL_RE.test(email)) {
    errors.email = "请输入有效的邮箱地址";
  }

  if (!message || message.length < 10) {
    errors.message = "消息至少需要 10 个字符";
  } else if (message.length > 2000) {
    errors.message = "消息不能超过 2000 个字符";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

export function isEmailJsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  );
}

/** 客户端：根据环境变量决定邮件发送方式 */
export function getContactProvider(): ContactProvider {
  const explicit = process.env.NEXT_PUBLIC_CONTACT_PROVIDER?.toLowerCase();

  if (explicit === "mailto") return "mailto";
  if (explicit === "emailjs") return "emailjs";
  if (explicit === "resend") return "resend";

  if (isEmailJsConfigured()) return "emailjs";

  return "resend";
}

export function getContactProviderLabel(provider: ContactProvider): string {
  switch (provider) {
    case "emailjs":
      return "EmailJS";
    case "resend":
      return "Resend";
    default:
      return "邮件客户端";
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
