"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  const lastTracked = useRef("");

  useEffect(() => {
    const key = `${locale}:${pathname}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        locale,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {
      /* non-blocking */
    });
  }, [pathname, locale]);

  return null;
}
