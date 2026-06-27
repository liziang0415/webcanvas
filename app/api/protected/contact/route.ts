import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const EMAIL_ADDRESS = "qq2822856916@outlook.com";

export async function POST(request: Request) {
  let token: string | undefined;

  try {
    const body = (await request.json()) as { token?: string };
    token = body.token;
  } catch {
    return NextResponse.json(
      { error: "Invalid verification request." },
      { status: 400 },
    );
  }

  const verification = await verifyTurnstileToken(
    token,
    request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  );

  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.message },
      { status: verification.status },
    );
  }

  return NextResponse.json({
    label: "Email",
    href: `mailto:${EMAIL_ADDRESS}`,
  });
}
