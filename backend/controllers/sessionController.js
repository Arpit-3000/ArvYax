const Session = require('../models/Session');
const { validationResult } = require('express-validator');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all public sessions
// @route   GET /api/sessions
// @access  Public
exports.getPublicSessions = asyncHandler(async (req, res, next) => {
  const sessions = await Session.find({ status: 'published' })
    .populate('user', ['email'])
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: sessions.length,
    data: sessions,
  });
});

// @desc    Get all sessions for logged in user
// @route   GET /api/my-sessions
// @access  Private
exports.getMySessions = asyncHandler(async (req, res, next) => {
  const sessions = await Session.find({ user: req.user.id }).sort({ updatedAt: -1 });

  res.json({
    success: true,
    count: sessions.length,
    data: sessions,
  });
});

// @desc    Get single session
// @route   GET /api/my-sessions/:id
// @access  Private
exports.getSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!session) {
    return next(new ErrorResponse(`Session not found with id of ${req.params.id}`, 404));
  }

  res.json({
    success: true,
    data: session,
  });
});

// @desc    Create or update draft session
// @route   POST /api/my-sessions/save-draft
// @access  Private
exports.saveDraft = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, tags, jsonFileUrl, id, description, duration, level } = req.body;
  const sessionFields = {
    user: req.user.id, // Always set the user from the token
    title,
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(tag => tag.trim()),
    jsonFileUrl,
    description,
    duration,
    level,
    status: 'draft',
  };

  let session;

  if (id) {
    session = await Session.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: sessionFields },
      { new: true, runValidators: true }
    );

    if (!session) {
      return next(new ErrorResponse(`Session not found with id of ${id}`, 404));
    }
  } else {
    session = await Session.create(sessionFields);
  }

  res.json({
    success: true,
    data: session,
  });
});

// @desc    Publish session
// @route   POST /api/my-sessions/publish
// @access  Private
exports.publishSession = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  const session = await Session.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: { status: 'published' } },
    { new: true }
  );

  if (!session) {
    return next(new ErrorResponse(`Session not found with id of ${id}`, 404));
  }

  res.json({
    success: true,
    data: session,
  });
});

// @desc    Delete session
// @route   DELETE /api/my-sessions/:id
// @access  Private
exports.deleteSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findOne({ _id: req.params.id, user: req.user.id });

  if (!session) {
    return next(
      new ErrorResponse(`Session not found with id of ${req.params.id}`, 404)
    );
  }

  await session.remove();

  res.json({ success: true, data: {} });
});
