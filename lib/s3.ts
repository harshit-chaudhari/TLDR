import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUrl(
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const key = `profile-pictures/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // Construct the file URL
  const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  const fileUrl = cloudFrontDomain
    ? `https://${cloudFrontDomain}/${key}`
    : `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}

export { s3Client };
