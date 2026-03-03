// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadLicense, uploadVanImages, uploadOwnerDocument, deleteImage } = require('../config/s3');
const { protect, authorize } = require('../middleware/auth');

// POST /api/upload/license - Upload driver's license image
router.post('/license', uploadLicense.single('licenseImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the uploaded file details (same response shape as before)
    res.status(200).json({
      success: true,
      message: 'License uploaded successfully',
      data: {
        url: req.file.location,
        publicId: req.file.key,
        originalName: req.file.originalname,
      },
    });
  } catch (error) {
    console.error('License upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload license',
    });
  }
});

// POST /api/upload/van-images - Upload van images (up to 25)
router.post('/van-images', protect, authorize('owner', 'admin'), uploadVanImages.array('vanImages', 25), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.location,
      key: file.key,
      originalName: file.originalname,
    }));

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} image(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error('Van images upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload van images',
    });
  }
});

// POST /api/upload/owner-document - Upload a single owner document
router.post('/owner-document', protect, authorize('owner', 'admin'), uploadOwnerDocument.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: req.file.location,
        key: req.file.key,
        originalName: req.file.originalname,
        docType: req.body.docType || 'general',
      },
    });
  } catch (error) {
    console.error('Owner document upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload document',
    });
  }
});

// DELETE /api/upload/license/:key(*) - Delete a license image
router.delete('/license/:key(*)', async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'S3 key is required',
      });
    }

    await deleteImage(key);

    res.status(200).json({
      success: true,
      message: 'License image deleted successfully',
    });
  } catch (error) {
    console.error('License delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete license image',
    });
  }
});

// DELETE /api/upload/image/:key(*) - Delete any S3 image (owner/admin)
router.delete('/image/:key(*)', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'S3 key is required',
      });
    }

    await deleteImage(key);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image',
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 15MB.',
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum is 25 images.',
    });
  }

  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

module.exports = router;
