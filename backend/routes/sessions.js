const express = require('express');
const { check } = require('express-validator');
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', sessionController.getPublicSessions);

// Protected routes
router.use(auth.protect);

// @route   GET /api/my-sessions
// @desc    Get all sessions for logged in user
// @access  Private
router.get('/my-sessions', sessionController.getMySessions);

// @route   GET /api/my-sessions/:id
// @desc    Get single session
// @access  Private
router.get('/my-sessions/:id', sessionController.getSession);

// @route   POST /api/my-sessions/save-draft
// @desc    Create or update draft session
// @access  Private
router.post(
  '/my-sessions/save-draft',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('jsonFileUrl', 'Please provide a valid URL for the session content').optional({ checkFalsy: true }).isURL(),
  ],
  sessionController.saveDraft
);

// @route   POST /api/my-sessions/publish
// @desc    Publish a session
// @access  Private
router.post(
  '/my-sessions/publish',
  [check('id', 'Session ID is required').not().isEmpty()],
  sessionController.publishSession
);

// @route   DELETE /api/my-sessions/:id
// @desc    Delete a session
// @access  Private
router.delete('/my-sessions/:id', sessionController.deleteSession);

module.exports = router;
