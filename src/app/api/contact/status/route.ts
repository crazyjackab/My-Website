import { NextResponse } from "next/server";
import {
  getContactProvider,
  isEmailJsConfigured,
  type ContactProvider,
} from "@/lib/contact";

function resolveServerProvider(): ContactProvider {
  const explicit = process.env.NEXT_PUBLIC_CONTACT_PROVIDER?.toLowerCase();
  if (explicit === "mailto") return "mailto";
  if (explicit === "emailjs") return "emailjs";
  if (explicit === "resend") return "resend";
  if (isEmailJsConfigured()) return "emailjs";
  return "resend";
}

function isResendReady(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

export async function GET() {
  const provider = resolveServerProvider();

  if (provider === "mailto") {
    return NextResponse.json({
      provider,
      ready: true,
      message: "使用 mailto 打开本地邮件客户端",
    });
  }

  if (provider === "emailjs") {
    const ready = isEmailJsConfigured();
    return NextResponse.json({
      provider,
      ready,
      message: ready
        ? "EmailJS 已配置"
        : "请在 .env.local 配置 NEXT_PUBLIC_EMAILJS_* 三个变量",
    });
  }

  const ready = isResendReady();
  return NextResponse.json({
    provider: "resend",
    ready,
    message: ready
      ? "Resend 已配置"
      : "请在 .env.local 配置 RESEND_API_KEY 和 CONTACT_TO_EMAIL",
  });
}
