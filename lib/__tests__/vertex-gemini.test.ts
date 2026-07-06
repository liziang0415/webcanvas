import { getGoogleAuthOptions } from "../vertex-gemini";

const originalServiceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

describe("getGoogleAuthOptions", () => {
  afterEach(() => {
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = originalServiceAccountJson;
  });

  it("uses ADC when service account JSON is not configured", () => {
    delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    expect(getGoogleAuthOptions()).toEqual({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  });

  it("uses service account JSON credentials when configured", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      type: "service_account",
      project_id: "portfolio-project",
      private_key: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
      client_email: "vertex@portfolio-project.iam.gserviceaccount.com",
    });

    expect(getGoogleAuthOptions()).toEqual({
      credentials: {
        type: "service_account",
        project_id: "portfolio-project",
        private_key:
          "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
        client_email: "vertex@portfolio-project.iam.gserviceaccount.com",
      },
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  });

  it("throws a clear error when service account JSON is invalid", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = "{not-json";

    expect(() => getGoogleAuthOptions()).toThrow(
      "GOOGLE_SERVICE_ACCOUNT_JSON must be valid service account JSON.",
    );
  });
});
