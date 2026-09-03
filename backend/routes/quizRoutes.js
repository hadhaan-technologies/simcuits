import express from 'express';

import {
  createQuiz,
  listQuizzesForFaculty,
  getQuizForFaculty,
  getResultsForFaculty,
  listQuizzesForStudent,
  startAttempt,
  saveAnswer,
  logViolation,
  submitAttempt,
  getMyResult,
} from '../controllers/quizController.js';

import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

/* =========================================================
   FACULTY
   ========================================================= */

router.post('/', verifyToken, requireRole('faculty'), createQuiz);

router.get('/faculty/mine', verifyToken, requireRole('faculty'), listQuizzesForFaculty);

router.get('/faculty/:id', verifyToken, requireRole('faculty'), getQuizForFaculty);

router.get('/faculty/:id/results', verifyToken, requireRole('faculty'), getResultsForFaculty);

/* =========================================================
   STUDENT
   ========================================================= */

router.get('/available', verifyToken, requireRole('student'), listQuizzesForStudent);

router.post('/:id/start', verifyToken, requireRole('student'), startAttempt);

router.post('/attempt/:attemptId/answer', verifyToken, requireRole('student'), saveAnswer);

router.post('/attempt/:attemptId/violation', verifyToken, requireRole('student'), logViolation);

router.post('/attempt/:attemptId/submit', verifyToken, requireRole('student'), submitAttempt);

router.get('/:id/my-result', verifyToken, requireRole('student'), getMyResult);

export default router;
