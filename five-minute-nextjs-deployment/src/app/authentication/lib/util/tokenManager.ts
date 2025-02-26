import crypto from "crypto";

function getPasswordResetToken(resetToken: string): string {
  return crypto.createHash("sha256").update(resetToken).digest("hex");
}

export { getPasswordResetToken };
