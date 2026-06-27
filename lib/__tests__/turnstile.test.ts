import { verifyTurnstileToken } from "../turnstile";

const originalSecret = process.env.TURNSTILE_SECRET_KEY;

describe("verifyTurnstileToken", () => {
  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = originalSecret;
    jest.restoreAllMocks();
  });

  it("requires the Turnstile server secret", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;

    await expect(verifyTurnstileToken("token")).resolves.toEqual({
      ok: false,
      message: "Turnstile is not configured on the server.",
      status: 503,
    });
  });

  it("rejects missing verification tokens", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";

    await expect(verifyTurnstileToken("")).resolves.toEqual({
      ok: false,
      message: "Complete the verification before continuing.",
      status: 400,
    });
  });

  it("accepts successful Turnstile responses", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await expect(verifyTurnstileToken("token", "127.0.0.1")).resolves.toEqual({
      ok: true,
    });
  });
});
