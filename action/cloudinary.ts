import { createHash } from "crypto";

export async function generateCloudinarySignature({
  timestamp,
}: {
  timestamp: number;
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!; 
  const uploadPreset = "claimmate_unsigned";

  const paramsToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;
  const signature = createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return { signature, timestamp };
}
