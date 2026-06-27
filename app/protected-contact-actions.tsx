"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MagneticAnchor } from "./portfolio-motion";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile";

type SensitiveAction = "email" | "cv";
type TurnstileWidget = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      theme: "dark" | "light" | "auto";
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileWidget;
  }
}

export function ProtectedContactActions() {
  const [activeAction, setActiveAction] = useState<SensitiveAction | null>(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const resetVerification = useCallback(() => {
    setToken("");
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!activeAction || !SITE_KEY) {
      return;
    }

    let cancelled = false;

    function renderWidget() {
      if (
        cancelled ||
        !SITE_KEY ||
        !turnstileContainerRef.current ||
        !window.turnstile ||
        widgetIdRef.current
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: SITE_KEY,
          theme: "dark",
          callback: (nextToken) => {
            setToken(nextToken);
            setMessage("");
          },
          "error-callback": () => {
            setToken("");
            setMessage("Verification had trouble loading. Please try again.");
          },
          "expired-callback": () => {
            setToken("");
            setMessage("Verification expired. Please complete it again.");
          },
        },
      );
    }

    if (!document.getElementById(TURNSTILE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      cancelled = true;
    };
  }, [activeAction]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  function openAction(action: SensitiveAction) {
    setActiveAction(action);
    setMessage("");
    resetVerification();
  }

  async function submitAction() {
    if (!activeAction) {
      return;
    }

    if (!SITE_KEY) {
      setMessage("Verification is not configured yet.");
      return;
    }

    if (!token) {
      setMessage("Complete the verification first.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      if (activeAction === "email") {
        const response = await fetch("/api/protected/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const payload = (await response.json()) as {
          href?: string;
          error?: string;
        };

        if (!response.ok || !payload.href) {
          throw new Error(payload.error ?? "Could not reveal the email link.");
        }

        window.location.href = payload.href;
        return;
      }

      const response = await fetch("/api/protected/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Could not download the CV.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Ziang_Li_CV.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("CV download started.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      resetVerification();
    } finally {
      setIsLoading(false);
    }
  }

  const actionLabel = activeAction === "cv" ? "Download CV" : "Email";

  return (
    <div className="mt-8 min-w-0">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => openAction("email")}
          className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-signal active:translate-y-px"
        >
          Email
        </button>
        <MagneticAnchor
          href="https://github.com/liziang0415"
          className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-signal hover:text-signal active:translate-y-px"
        >
          GitHub
        </MagneticAnchor>
        <button
          type="button"
          onClick={() => openAction("cv")}
          className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-signal hover:text-signal active:translate-y-px"
        >
          CV
        </button>
      </div>

      {activeAction ? (
        <div className="mt-5 min-w-0 border border-border bg-surface/60 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">
                Verification required
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Complete the check to access {activeAction === "cv" ? "my CV" : "my email"}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveAction(null);
                setMessage("");
                resetVerification();
              }}
              className="self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-signal hover:text-signal"
            >
              Close
            </button>
          </div>

          <div className="mt-4 min-h-[65px] overflow-hidden">
            {SITE_KEY ? (
              <div ref={turnstileContainerRef} />
            ) : (
              <p className="text-sm text-muted">
                Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to enable this.
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={submitAction}
              disabled={isLoading || !token}
              className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-signal disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isLoading ? "Checking..." : actionLabel}
            </button>
            {message ? (
              <p className="text-wrap-safe text-sm leading-6 text-muted">{message}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
