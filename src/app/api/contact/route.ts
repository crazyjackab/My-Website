import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml, validateContactForm, type ContactFormData } from "@/lib/contact";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "发送过于频繁，请 15 分钟后再试" },
        { status: 429 },
      );
    }

    const body = (await request.json()) as ContactFormData & { website?: string };

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const validation = validateContactForm(body);
    if (!validation.success) {
      const firstError = Object.values(validation.errors ?? {})[0];
      return NextResponse.json({ error: firstError || "表单验证失败" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Resend 未配置：在 .env.local 添加 RESEND_API_KEY 和 CONTACT_TO_EMAIL，或改用 NEXT_PUBLIC_CONTACT_PROVIDER=emailjs",
        },
        { status: 503 },
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL;
    if (!toEmail) {
      return NextResponse.json(
        { error: "收件邮箱未配置，请设置 CONTACT_TO_EMAIL" },
        { status: 503 },
      );
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "陈鹏 Portfolio";
    const name = body.name.trim();
    const email = body.email.trim();
    const message = body.message.trim();

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `[${siteName}] 来自 ${name} 的消息`,
      text: `姓名: ${name}\n邮箱: ${email}\n\n${message}`,
      html: `
        <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
          <h2 style="color: #0891b2; margin-bottom: 24px;">📬 新的联系表单消息</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 72px;">姓名</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">邮箱</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a>
              </td>
            </tr>
          </table>
          <p style="color: #64748b; margin: 0 0 8px; font-size: 13px;">消息内容</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
            ${escapeHtml(message)}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">— 来自 ${escapeHtml(siteName)} 联系表单</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "邮件发送失败，请检查 Resend 配置或稍后重试" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 },
    );
  }
}
