const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// ---------- helpers ----------

// Fisher-Yates, returns a NEW shuffled array of indices [0..n-1]
function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stripAnswers(quiz, questionOrder, optionOrderByQuestion) {
  // Build the question list the STUDENT sees: no correctOptionIndex,
  // ordered per questionOrder, options ordered per optionOrderByQuestion.
  const byId = new Map(quiz.questions.map((q) => [String(q._id), q]));

  return questionOrder.map((qid) => {
    const q = byId.get(String(qid));
    const optOrder = optionOrderByQuestion.get(String(qid)); // shuffled -> original
    const shuffledOptions = optOrder.map((origIdx) => q.options[origIdx]);
    return {
      questionId: q._id,
      questionText: q.questionText,
      options: shuffledOptions,
    };
  });
}

function deadline(attempt, quiz) {
  return new Date(attempt.startedAt.getTime() + quiz.durationMinutes * 60_000);
}

// ---------- faculty endpoints ----------

exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      questions,
      durationMinutes,
      startsAt,
      endsAt,
      shuffleQuestions,
      shuffleOptions,
      maxViolationsBeforeAutoSubmit,
      showResultsImmediately,
      status,
    } = req.body;

    if (!Array.isArray(questions) || questions.length !== 20) {
      return res.status(400).json({ message: 'Exactly 20 questions are required.' });
    }
    for (const q of questions) {
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ message: 'Every question needs exactly 4 options.' });
      }
      if (
        typeof q.correctOptionIndex !== 'number' ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex > 3
      ) {
        return res
          .status(400)
          .json({ message: 'Every question needs a valid correctOptionIndex.' });
      }
    }
    if (new Date(startsAt) >= new Date(endsAt)) {
      return res.status(400).json({ message: 'startsAt must be before endsAt.' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      department,
      createdBy: req.user.id,
      questions,
      durationMinutes,
      startsAt,
      endsAt,
      shuffleQuestions: shuffleQuestions ?? true,
      shuffleOptions: shuffleOptions ?? true,
      maxViolationsBeforeAutoSubmit: maxViolationsBeforeAutoSubmit ?? 2,
      showResultsImmediately: showResultsImmediately ?? true,
      status: status ?? 'draft',
    });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create quiz', error: err.message });
  }
};

exports.listQuizzesForFaculty = async (req, res) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id })
    .select('-questions.correctOptionIndex')
    .sort({ createdAt: -1 });
  res.json(quizzes);
};

// Faculty view of one quiz WITH answers (for editing)
exports.getQuizForFaculty = async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(quiz);
};

exports.getResultsForFaculty = async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  const attempts = await QuizAttempt.find({ quiz: quiz._id })
    .populate('student', 'name rollNumber email')
    .sort({ score: -1 });

  res.json(
    attempts.map((a) => ({
      student: a.student,
      score: a.score,
      maxScore: a.maxScore,
      status: a.status,
      autoSubmitted: a.autoSubmitted,
      lateSubmission: a.lateSubmission,
      flaggedForReview: a.flaggedForReview,
      violationCount: a.violations.length,
      violations: a.violations,
      startedAt: a.startedAt,
      submittedAt: a.submittedAt,
    }))
  );
};

// ---------- student endpoints ----------

// List quizzes a student is eligible to see (published, in their department, in window)
exports.listQuizzesForStudent = async (req, res) => {
  const now = new Date();
  const quizzes = await Quiz.find({
    department: req.user.department,
    status: 'published',
    endsAt: { $gte: now },
  })
    .select('title description durationMinutes startsAt endsAt')
    .sort({ startsAt: 1 });

  const attempts = await QuizAttempt.find({ student: req.user.id }).select(
    'quiz status score maxScore'
  );
  const attemptByQuiz = new Map(attempts.map((a) => [String(a.quiz), a]));

  res.json(
    quizzes.map((q) => ({
      ...q.toObject(),
      attemptStatus: attemptByQuiz.get(String(q._id))?.status ?? 'not_started',
    }))
  );
};

// Start (or resume) an attempt. This is the only place questions are ever
// sent to the browser, and they never include correctOptionIndex.
exports.startAttempt = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz || quiz.status !== 'published') {
    return res.status(404).json({ message: 'Quiz not available' });
  }
  const now = new Date();
  if (now < quiz.startsAt || now > quiz.endsAt) {
    return res.status(403).json({ message: 'Quiz is not open right now' });
  }

  let attempt = await QuizAttempt.findOne({ quiz: quiz._id, student: req.user.id });

  if (attempt && attempt.status === 'submitted') {
    return res.status(403).json({ message: 'You have already submitted this quiz' });
  }

  if (!attempt) {
    const questionOrder = quiz.shuffleQuestions
      ? shuffledIndices(quiz.questions.length).map((i) => quiz.questions[i]._id)
      : quiz.questions.map((q) => q._id);

    const optionOrderByQuestion = new Map();
    quiz.questions.forEach((q) => {
      optionOrderByQuestion.set(
        String(q._id),
        quiz.shuffleOptions ? shuffledIndices(4) : [0, 1, 2, 3]
      );
    });

    attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user.id,
      questionOrder,
      optionOrderByQuestion,
      answers: questionOrder.map((qid) => ({ questionId: qid, selectedOptionIndex: null })),
      startedAt: now,
      maxScore: quiz.questions.reduce((sum, q) => sum + q.marks, 0),
    });
  }

  const dl = deadline(attempt, quiz);
  if (now > dl) {
    // Time already up (e.g. they closed the browser) — auto-submit now.
    return gradeAndSubmit(attempt, quiz, { autoSubmitted: true, reason: 'timeout' }).then(
      (graded) =>
        res
          .status(403)
          .json({ message: 'Time is up, this attempt was auto-submitted', result: graded })
    );
  }

  res.json({
    attemptId: attempt._id,
    startedAt: attempt.startedAt,
    deadline: dl,
    durationMinutes: quiz.durationMinutes,
    maxViolationsBeforeAutoSubmit: quiz.maxViolationsBeforeAutoSubmit,
    violationCountSoFar: attempt.violations.length,
    questions: stripAnswers(quiz, attempt.questionOrder, attempt.optionOrderByQuestion),
    savedAnswers: attempt.answers, // so a refresh restores previous selections
  });
};

// Save a single answer as the student picks it (keeps progress if they crash/refresh)
exports.saveAnswer = async (req, res) => {
  const { questionId, selectedOptionShuffledIndex } = req.body;
  const attempt = await QuizAttempt.findOne({ _id: req.params.attemptId, student: req.user.id });
  if (!attempt || attempt.status !== 'in_progress') {
    return res.status(404).json({ message: 'Attempt not found or already submitted' });
  }

  const optOrder = attempt.optionOrderByQuestion.get(String(questionId));
  if (!optOrder) return res.status(400).json({ message: 'Unknown question for this attempt' });

  const originalIndex =
    selectedOptionShuffledIndex === null ? null : optOrder[selectedOptionShuffledIndex];

  const ans = attempt.answers.find((a) => String(a.questionId) === String(questionId));
  if (ans) ans.selectedOptionIndex = originalIndex;

  await attempt.save();
  res.json({ ok: true });
};

exports.logViolation = async (req, res) => {
  const { type } = req.body;
  const attempt = await QuizAttempt.findOne({ _id: req.params.attemptId, student: req.user.id });
  if (!attempt || attempt.status !== 'in_progress') {
    return res.status(404).json({ message: 'Attempt not found or already submitted' });
  }

  attempt.violations.push({ type });
  if (attempt.violations.length >= 2) attempt.flaggedForReview = true;

  const quiz = await Quiz.findById(attempt.quiz);
  const shouldAutoSubmit = attempt.violations.length >= quiz.maxViolationsBeforeAutoSubmit;

  await attempt.save();

  if (shouldAutoSubmit) {
    const graded = await gradeAndSubmit(attempt, quiz, {
      autoSubmitted: true,
      reason: 'violations',
    });
    return res.json({
      autoSubmitted: true,
      result: graded,
      violationCount: attempt.violations.length,
    });
  }

  res.json({
    autoSubmitted: false,
    violationCount: attempt.violations.length,
    maxViolations: quiz.maxViolationsBeforeAutoSubmit,
  });
};

exports.submitAttempt = async (req, res) => {
  const attempt = await QuizAttempt.findOne({ _id: req.params.attemptId, student: req.user.id });
  if (!attempt || attempt.status !== 'in_progress') {
    return res.status(404).json({ message: 'Attempt not found or already submitted' });
  }
  const quiz = await Quiz.findById(attempt.quiz);
  const graded = await gradeAndSubmit(attempt, quiz, { autoSubmitted: false });
  res.json(graded);
};

async function gradeAndSubmit(attempt, quiz, { autoSubmitted, reason = 'manual' }) {
  const now = new Date();
  const dl = deadline(attempt, quiz);
  const questionsById = new Map(quiz.questions.map((q) => [String(q._id), q]));

  let score = 0;
  for (const ans of attempt.answers) {
    const q = questionsById.get(String(ans.questionId));
    if (q && ans.selectedOptionIndex === q.correctOptionIndex) {
      score += q.marks;
    }
  }

  attempt.score = score;
  attempt.submittedAt = now;
  attempt.autoSubmitted = autoSubmitted;
  attempt.lateSubmission = now > new Date(dl.getTime() + 15_000); // 15s network grace
  attempt.status = 'submitted';
  if (attempt.lateSubmission) attempt.flaggedForReview = true;

  await attempt.save();

  return {
    score: attempt.score,
    maxScore: attempt.maxScore,
    autoSubmitted: attempt.autoSubmitted,
    lateSubmission: attempt.lateSubmission,
    reason, // 'manual' | 'timeout' | 'violations'
    showResultsImmediately: quiz.showResultsImmediately,
  };
}

exports.getMyResult = async (req, res) => {
  const attempt = await QuizAttempt.findOne({ quiz: req.params.id, student: req.user.id });
  if (!attempt) return res.status(404).json({ message: 'No attempt found' });
  if (attempt.status !== 'submitted') {
    return res.status(403).json({ message: 'Quiz not submitted yet' });
  }
  const quiz = await Quiz.findById(req.params.id).select('title showResultsImmediately');
  if (!quiz.showResultsImmediately) {
    return res.status(403).json({ message: 'Results are not released yet' });
  }
  res.json({
    title: quiz.title,
    score: attempt.score,
    maxScore: attempt.maxScore,
    submittedAt: attempt.submittedAt,
    autoSubmitted: attempt.autoSubmitted,
  });
};
