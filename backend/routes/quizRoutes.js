const express = require('express');
const router = express.Router();
const quiz = require('../controllers/quizController');

// requireRole('faculty') / requireRole('student') should 403 on mismatch.
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// ---- Faculty ----
router.post('/', verifyToken, requireRole('faculty'), quiz.createQuiz);
router.get('/faculty/mine', verifyToken, requireRole('faculty'), quiz.listQuizzesForFaculty);
router.get('/faculty/:id', verifyToken, requireRole('faculty'), quiz.getQuizForFaculty);
router.get('/faculty/:id/results', verifyToken, requireRole('faculty'), quiz.getResultsForFaculty);

// ---- Student ----
router.get('/available', verifyToken, requireRole('student'), quiz.listQuizzesForStudent);
router.post('/:id/start', verifyToken, requireRole('student'), quiz.startAttempt);
router.post('/attempt/:attemptId/answer', verifyToken, requireRole('student'), quiz.saveAnswer);
router.post(
  '/attempt/:attemptId/violation',
  verifyToken,
  requireRole('student'),
  quiz.logViolation
);
router.post('/attempt/:attemptId/submit', verifyToken, requireRole('student'), quiz.submitAttempt);
router.get('/:id/my-result', verifyToken, requireRole('student'), quiz.getMyResult);

module.exports = router;
