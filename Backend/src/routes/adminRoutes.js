// ─────────────────────────────────────────────────────────────────────────────
//  adminRoutes.js — Admin-Only Routes
//  All routes require: Clerk auth + admin role (publicMetadata.role === 'admin')
// ─────────────────────────────────────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();
const { requireAuth } = require('@clerk/express');
const { body } = require('express-validator');
const isAdmin  = require('../middleware/isAdmin');
const upload   = require('../middleware/upload');
const adminController = require('../controllers/adminController');

// ── Validation Middlewares ────────────────────────────────────────────────────
const validateTourPost = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('tourType').trim().notEmpty().withMessage('Tour type is required'),
  body('image').isString().withMessage('Valid image is required'),
];

const validateTourPatch = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('duration').optional().trim().notEmpty().withMessage('Duration cannot be empty'),
  body('tourType').optional().trim().notEmpty().withMessage('Tour type cannot be empty'),
  body('image').optional().isString().withMessage('Valid image is required'),
];

// Apply auth + admin check to ALL admin routes
router.use(requireAuth(), isAdmin);

// ── Routes ────────────────────────────────────────────────────────────────────

router.post('/upload', upload.single('image'), adminController.uploadImage);
router.get('/stats', adminController.getDashboardStats);
router.get('/tours', adminController.getAllTours);
router.post('/tours', validateTourPost, adminController.createTour);
router.put('/tours/:id', validateTourPatch, adminController.updateTour);
router.delete('/tours/:id', adminController.deleteTour);
router.get('/bookings', adminController.getAllBookings);
router.get('/contacts', adminController.getAllContacts);
router.put('/settings/:key', adminController.updateSetting);

module.exports = router;
