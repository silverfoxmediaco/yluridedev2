// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadLicense, deleteImage } = require('../config/s3');

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

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 10MB.',
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
