const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export type TurnstileResult =
  | { ok: true }
  | { ok: false; message: string; status: number };

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      ok: false,
      message: "Turnstile is not configured on the server.",
      status: 503,
    };
  }

  if (!token) {
    return {
      ok: false,
      message: "Complete the verification before continuing.",
      status: 400,
    };
  }

  const formData = new FormData();
  formData.set("secret", secret);
  formData.set("response", token);

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return {
      ok: false,
      message: "Verification service is temporarily unavailable.",
      status: 502,
    };
  }

  const result = (await response.json()) as TurnstileVerifyResponse;

  if (!result.success) {
    return {
      ok: false,
      message: "Verification failed. Please try again.",
      status: 403,
    };
  }

  return { ok: true };
}
