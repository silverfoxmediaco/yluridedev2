// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadLicense, deleteImage } = require('../config/cloudinary');

// POST /api/upload/license - Upload driver's license image
router.post('/license', uploadLicense.single('licenseImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the uploaded file details
    res.status(200).json({
      success: true,
      message: 'License uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
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

// DELETE /api/upload/license/:publicId - Delete a license image
router.delete('/license/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    // The publicId includes the folder path, so we need to construct the full path
    const fullPublicId = `ntx-luxury-vans/licenses/${publicId}`;
    await deleteImage(fullPublicId);

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
