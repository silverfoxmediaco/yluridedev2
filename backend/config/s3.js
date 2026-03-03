// backend/config/s3.js
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const crypto = require('crypto');

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Configure multer-s3 storage for Driver's License uploads
const licenseStorage = multerS3({
  s3: s3Client,
  bucket: BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `licenses/${uniqueSuffix}${ext}`);
  },
});

// Multer upload middleware for license images
const uploadLicense = multer({
  storage: licenseStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
    }
  },
});

// Helper function to delete image from S3
const deleteImage = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const result = await s3Client.send(command);
    return result;
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};

// Helper function to get public URL for an S3 object
const getPublicUrl = (key) => {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = {
  s3Client,
  uploadLicense,
  deleteImage,
  getPublicUrl,
};
