// scripts/uploadAssetsToS3.js
// Uploads all files from frontend/src/assets/ to s3://ntxvanrentals/siteimages/
// Usage: node scripts/uploadAssetsToS3.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const ASSETS_DIR = path.join(__dirname, '..', 'frontend', 'src', 'assets');
const S3_PREFIX = 'siteimages';

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
};

function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({ fullPath, relativePath });
    }
  }

  return files;
}

async function uploadFile(filePath, s3Key) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
  return url;
}

async function main() {
  console.log(`Uploading assets from ${ASSETS_DIR} to s3://${BUCKET_NAME}/${S3_PREFIX}/\n`);

  const files = getAllFiles(ASSETS_DIR);
  console.log(`Found ${files.length} files to upload.\n`);

  for (const file of files) {
    const s3Key = `${S3_PREFIX}/${file.relativePath}`;
    try {
      const url = await uploadFile(file.fullPath, s3Key);
      console.log(`Uploaded: ${url}`);
    } catch (error) {
      console.error(`Failed to upload ${file.relativePath}: ${error.message}`);
    }
  }

  console.log('\nDone!');
}

main();
