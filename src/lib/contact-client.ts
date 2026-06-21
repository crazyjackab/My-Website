import { email } from "@/data/profile";
import type { ContactFormData } from "./contact";
import { getContactProvider } from "./contact";
import { sendViaEmailJs } from "./emailjs";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

export interface ContactStatus {
  provider: "resend" | "emailjs" | "mailto";
  ready: boolean;
  message?: string;
}

function submitViaMailto(data: ContactFormData): void {
  const subject = encodeURIComponent(`Portfolio 联系 - ${data.name.trim()}`);
  const body = encodeURIComponent(
    `来自: ${data.name.trim()}\n邮箱: ${data.email.trim()}\n\n${data.message.trim()}`,
  );
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

export async function fetchContactStatus(): Promise<ContactStatus> {
  try {
    const res = await fetch("/api/contact/status", { cache: "no-store" });
    if (!res.ok) throw new Error("status unavailable");
    return (await res.json()) as ContactStatus;
  } catch {
    const provider = getContactProvider();
    return {
      provider,
      ready: provider === "mailto" || provider === "emailjs",
    };
  }
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const provider = getContactProvider();

  if (provider === "mailto") {
    submitViaMailto(data);
    return;
  }

  if (provider === "emailjs") {
    await sendViaEmailJs(data);
    return;
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "发送失败，请稍后重试");
  }
}
