import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const CV_PATH = path.join(process.cwd(), "private", "Ziang_Li_CV.pdf");

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

  const cv = await readFile(CV_PATH);

  return new Response(cv, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": 'attachment; filename="Ziang_Li_CV.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
