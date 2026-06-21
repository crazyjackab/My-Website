"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/animations/Reveal";
import { email, handle, social } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { fetchContactStatus, submitContactForm, type ContactStatus } from "@/lib/contact-client";
import { getContactProvider, getContactProviderLabel, validateContactForm } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { AlertCircle, CheckCircle2, Github, Loader2, Mail, Send } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const t = useTranslations("contact");
  const { recruiterMode } = useTheme();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [contactStatus, setContactStatus] = useState<ContactStatus | null>(null);

  const provider = getContactProvider();
  const providerLabel = getContactProviderLabel(provider);
  const backendReady =
    contactStatus?.ready ?? (provider === "mailto" || provider === "emailjs");

  useEffect(() => {
    fetchContactStatus().then(setContactStatus);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg("");

    if (honeypot) return;

    const validation = validateContactForm(formState);
    if (!validation.success) {
      setFieldErrors(validation.errors ?? {});
      setStatus("error");
      setErrorMsg(t("formError"));
      return;
    }

    setStatus("loading");

    try {
      await submitContactForm(formState);
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("sendFailed"));
    }
  };

  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(`Portfolio 联系 - ${formState.name || "Visitor"}`);
    const body = encodeURIComponent(
      `来自: ${formState.name}\n邮箱: ${formState.email}\n\n${formState.message}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const buttonLabel =
    status === "loading"
      ? t("sending")
      : status === "success"
        ? "Message Sent ✓"
        : status === "error" && errorMsg
          ? "Retry Send"
          : t("send");

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <p className="section-label">{t("label")}</p>
          <h2 className="section-title mt-2 gradient-text">{t("title")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal delay={100}>
            <div className="cyber-panel rounded-xl border border-neon-green/20 bg-black/50 p-6 font-mono text-sm backdrop-blur-sm">
              <div className="mb-4 flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <p className={cn("font-mono text-sm", recruiterMode ? "text-green-800" : "text-neon-green/80")}>
                <span className={recruiterMode ? "text-slate-500" : "text-text-muted"}>$</span> ssh contact@{handle}.dev
              </p>
              <p className={cn("mt-1", recruiterMode ? "text-green-700" : "text-neon-green/60")}>&gt; Authenticating...</p>
              <p className={recruiterMode ? "text-green-700" : "text-neon-green/60"}>&gt; Connection established.</p>

              <ul className={cn("mt-6 space-y-3", recruiterMode ? "text-slate-600" : "text-text-muted")}>
                <li className="flex items-center gap-2">
                  <Mail size={14} className={recruiterMode ? "text-blue-600" : "text-neon-cyan"} />
                  {email}
                </li>
                <li>
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center gap-2", recruiterMode ? "hover:text-blue-700" : "hover:text-neon-cyan")}
                  >
                    <Github size={14} />
                    github.com/{handle}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6" noValidate>
              <h3 className={cn("font-mono text-sm", recruiterMode ? "text-blue-700" : "text-neon-cyan")}>
                {t("sendMessage")}
              </h3>
              <p className={cn("mt-1 text-xs", recruiterMode ? "text-slate-500" : "text-text-muted")}>
                {provider === "mailto"
                  ? t("mailtoHint")
                  : backendReady
                    ? t("providerHint", { provider: providerLabel })
                    : t("providerNotReady", { provider: providerLabel })}
              </p>

              {contactStatus && !contactStatus.ready && provider !== "mailto" && (
                <p className={cn("mt-2 rounded border px-3 py-2 font-mono text-[10px] leading-relaxed", recruiterMode ? "border-amber-200 bg-amber-50 text-amber-800" : "border-neon-amber/30 bg-neon-amber/5 text-neon-amber/90")}>
                  {contactStatus.message || t("envHint")}
                </p>
              )}

              {/* Honeypot — hidden from users, catches bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className={cn("font-mono text-[10px] tracking-wider uppercase", recruiterMode ? "text-slate-500" : "text-text-muted")}>
                    {t("name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className={cn(
                      "mt-1 w-full rounded border px-4 py-2.5 font-mono text-sm outline-none",
                      recruiterMode
                        ? "border-slate-200 bg-white text-slate-900 focus:border-blue-500"
                        : "border-white/10 bg-black/40 text-white focus:border-neon-cyan/50",
                      fieldErrors.name ? "border-red-500/50" : "",
                    )}
                    placeholder="Your name"
                    disabled={status === "loading"}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 font-mono text-[10px] text-red-400">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={cn("font-mono text-[10px] tracking-wider uppercase", recruiterMode ? "text-slate-500" : "text-text-muted")}>
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className={cn(
                      "mt-1 w-full rounded border px-4 py-2.5 font-mono text-sm outline-none",
                      recruiterMode
                        ? "border-slate-200 bg-white text-slate-900 focus:border-blue-500"
                        : "border-white/10 bg-black/40 text-white focus:border-neon-cyan/50",
                      fieldErrors.email ? "border-red-500/50" : "",
                    )}
                    placeholder="your@email.com"
                    disabled={status === "loading"}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 font-mono text-[10px] text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className={cn("font-mono text-[10px] tracking-wider uppercase", recruiterMode ? "text-slate-500" : "text-text-muted")}>
                    {t("message")}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className={cn(
                      "mt-1 w-full resize-none rounded border px-4 py-2.5 font-mono text-sm outline-none",
                      recruiterMode
                        ? "border-slate-200 bg-white text-slate-900 focus:border-blue-500"
                        : "border-white/10 bg-black/40 text-white focus:border-neon-cyan/50",
                      fieldErrors.message ? "border-red-500/50" : "",
                    )}
                    placeholder="Hello..."
                    disabled={status === "loading"}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 font-mono text-[10px] text-red-400">{fieldErrors.message}</p>
                  )}
                </div>
              </div>

              {status === "success" && (
                <div className={cn("mt-4 flex items-center gap-2 font-mono text-xs", recruiterMode ? "text-green-700" : "text-neon-green")}>
                  <CheckCircle2 size={14} />
                  {provider === "mailto" ? t("successMailto") : t("successSent")}
                </div>
              )}

              {status === "error" && errorMsg && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-red-400">
                    <AlertCircle size={14} />
                    {errorMsg}
                  </div>
                  {provider !== "mailto" && (
                    <button
                      type="button"
                      onClick={handleMailtoFallback}
                      className={cn(
                        "font-mono text-[10px] underline underline-offset-2",
                        recruiterMode ? "text-blue-700" : "text-neon-cyan",
                      )}
                    >
                      {t("useMailClient")}
                    </button>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="mt-6 w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {provider === "mailto" ? t("openMailClient") : buttonLabel}
              </Button>

              {provider !== "mailto" && !backendReady && (
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-3 w-full"
                  onClick={handleMailtoFallback}
                >
                  <Mail size={14} />
                  {t("useMailNoConfig")}
                </Button>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
