import { ImageResponse } from "next/og";
import { handle } from "@/data/profile";
import { getLocalizedProfile } from "@/data/i18n/profile";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = siteConfig.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const profile = getLocalizedProfile("zh");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(145deg, #050508 0%, #0a1628 50%, #120818 100%)",
          color: "#e8e8f0",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#39ff14",
              boxShadow: "0 0 20px #39ff14",
            }}
          />
          <span style={{ fontSize: 22, color: "#00f0ff" }}>portfolio-os v2026</span>
        </div>

        <div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              background: "linear-gradient(90deg, #00f0ff, #a855f7, #ff00aa)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {profile.name}
          </div>
          <div style={{ marginTop: 16, fontSize: 30, color: "#94a3b8" }}>{profile.title}</div>
          <div style={{ marginTop: 12, fontSize: 22, color: "#64748b" }}>{profile.slogan}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#64748b" }}>
          <span>{handle}.dev</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
