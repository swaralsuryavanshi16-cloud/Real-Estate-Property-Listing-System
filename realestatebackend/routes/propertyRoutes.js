const express = require('express');
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  deletePropertyImage,
  updateImageDetails,
  verifyDocuments,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImages, uploadDocuments } = require('../middleware/upload');
const multer = require('multer');

// All property routes require authentication
router.use(protect);

// Mixed upload: images + documents together
const { diskStorage } = require('multer');
const path = require('path');
const fs = require('fs');

const mixedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'properties';
    if (file.fieldname === 'documents') folder = 'documents';
    const dest = path.join(__dirname, `../uploads/${folder}`);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'documents' ? 'doc' : 'prop';
    cb(null, `${prefix}_${Date.now()}_${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`);
  },
});

const uploadMixed = multer({
  storage: mixedStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 5 },
]);

// ── Routes ──────────────────────────────────────────────────────────────────

// GET all properties — all roles
router.get('/', getAllProperties);

// GET single property — all roles
router.get('/:id', getProperty);

// POST create property — admin and agent only
router.post('/', authorize('admin', 'agent'), uploadMixed, createProperty);

// PUT update property — admin and agent (ownership checked in controller)
router.put('/:id', authorize('admin', 'agent'), uploadMixed, updateProperty);

// DELETE property — admin and agent (ownership checked in controller)
router.delete('/:id', authorize('admin', 'agent'), deleteProperty);

// PATCH approve property — admin only
router.patch('/:id/approve', authorize('admin'), approveProperty);

// DELETE single image — admin and agent
router.delete('/:id/images/:filename', authorize('admin', 'agent'), deletePropertyImage);

// PATCH photo details (caption, room tag, cover photo) — admin and agent
router.patch('/:id/images/:filename', authorize('admin', 'agent'), updateImageDetails);

// POST run AI document testing / verification — admin and agent
router.post('/:id/documents/verify', authorize('admin', 'agent'), verifyDocuments);

module.exports = router;
