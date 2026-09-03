import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/Quizattemps.js';

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function stripAnswers(quiz, questionOrder, optionOrderByQuestion) {
  const byId = new Map(quiz.questions.map((q) => [String(q._id), q]));

  return questionOrder
    .map((qid) => {
      const q = byId.get(String(qid));

      if (!q) {
        return null;
      }

      const optOrder = optionOrderByQuestion.get(String(qid));

      if (!optOrder) {
        return null;
      }

      const shuffledOptions = optOrder.map((origIdx) => q.options[origIdx]);

      return {
        questionId: q._id,
        questionText: q.questionText,
        options: shuffledOptions,
      };
    })
    .filter(Boolean);
}

function deadline(attempt, quiz) {
  return new Date(attempt.startedAt.getTime() + quiz.durationMinutes * 60_000);
}

/* =========================================================
   FACULTY ENDPOINTS
   ========================================================= */

export const createQuiz = async (req, res) => {
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
      return res.status(400).json({
        message: 'Exactly 20 questions are required.',
      });
    }

    for (const q of questions) {
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({
          message: 'Every question needs exactly 4 options.',
        });
      }

      if (
        typeof q.correctOptionIndex !== 'number' ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex > 3
      ) {
        return res.status(400).json({
          message: 'Every question needs a valid correctOptionIndex.',
        });
      }
    }

    if (new Date(startsAt) >= new Date(endsAt)) {
      return res.status(400).json({
        message: 'startsAt must be before endsAt.',
      });
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

    return res.status(201).json(quiz);
  } catch (err) {
    console.error('createQuiz error:', err);

    return res.status(500).json({
      message: 'Failed to create quiz',
      error: err.message,
    });
  }
};

export const listQuizzesForFaculty = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      createdBy: req.user.id,
    })
      .select('-questions.correctOptionIndex')
      .sort({ createdAt: -1 });

    return res.json(quizzes);
  } catch (err) {
    console.error('listQuizzesForFaculty error:', err);

    return res.status(500).json({
      message: 'Failed to fetch quizzes',
      error: err.message,
    });
  }
};

/* Faculty view of one quiz WITH answers for editing */
export const getQuizForFaculty = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found',
      });
    }

    return res.json(quiz);
  } catch (err) {
    console.error('getQuizForFaculty error:', err);

    return res.status(500).json({
      message: 'Failed to fetch quiz',
      error: err.message,
    });
  }
};

export const getResultsForFaculty = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found',
      });
    }

    const attempts = await QuizAttempt.find({
      quiz: quiz._id,
    })
      .populate('student', 'name rollNumber email')
      .sort({ score: -1 });

    return res.json(
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
  } catch (err) {
    console.error('getResultsForFaculty error:', err);

    return res.status(500).json({
      message: 'Failed to fetch quiz results',
      error: err.message,
    });
  }
};

/* =========================================================
   STUDENT ENDPOINTS
   ========================================================= */

export const listQuizzesForStudent = async (req, res) => {
  try {
    const now = new Date();

    const quizzes = await Quiz.find({
      department: req.user.department,
      status: 'published',
      endsAt: { $gte: now },
    })
      .select('title description durationMinutes startsAt endsAt')
      .sort({ startsAt: 1 });

    const attempts = await QuizAttempt.find({
      student: req.user.id,
    }).select('quiz status score maxScore');

    const attemptByQuiz = new Map(attempts.map((a) => [String(a.quiz), a]));

    return res.json(
      quizzes.map((q) => ({
        ...q.toObject(),
        attemptStatus: attemptByQuiz.get(String(q._id))?.status ?? 'not_started',
      }))
    );
  } catch (err) {
    console.error('listQuizzesForStudent error:', err);

    return res.status(500).json({
      message: 'Failed to fetch quizzes',
      error: err.message,
    });
  }
};

/*
  Start or resume an attempt.

  This is the only place questions are sent to the browser.
  correctOptionIndex is NEVER sent to the student.
*/
export const startAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz || quiz.status !== 'published') {
      return res.status(404).json({
        message: 'Quiz not available',
      });
    }

    const now = new Date();

    if (now < quiz.startsAt || now > quiz.endsAt) {
      return res.status(403).json({
        message: 'Quiz is not open right now',
      });
    }

    let attempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user.id,
    });

    if (attempt && attempt.status === 'submitted') {
      return res.status(403).json({
        message: 'You have already submitted this quiz',
      });
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
        answers: questionOrder.map((qid) => ({
          questionId: qid,
          selectedOptionIndex: null,
        })),
        startedAt: now,
        maxScore: quiz.questions.reduce((sum, q) => sum + q.marks, 0),
      });
    }

    const dl = deadline(attempt, quiz);

    if (now > dl) {
      const graded = await gradeAndSubmit(attempt, quiz, {
        autoSubmitted: true,
        reason: 'timeout',
      });

      return res.status(403).json({
        message: 'Time is up, this attempt was auto-submitted',
        result: graded,
      });
    }

    return res.json({
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      deadline: dl,
      durationMinutes: quiz.durationMinutes,
      maxViolationsBeforeAutoSubmit: quiz.maxViolationsBeforeAutoSubmit,
      violationCountSoFar: attempt.violations.length,
      questions: stripAnswers(quiz, attempt.questionOrder, attempt.optionOrderByQuestion),
      savedAnswers: attempt.answers,
    });
  } catch (err) {
    console.error('startAttempt error:', err);

    return res.status(500).json({
      message: 'Failed to start quiz attempt',
      error: err.message,
    });
  }
};

/* Save a single answer */
export const saveAnswer = async (req, res) => {
  try {
    const { questionId, selectedOptionShuffledIndex } = req.body;

    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      student: req.user.id,
    });

    if (!attempt || attempt.status !== 'in_progress') {
      return res.status(404).json({
        message: 'Attempt not found or already submitted',
      });
    }

    const optOrder = attempt.optionOrderByQuestion.get(String(questionId));

    if (!optOrder) {
      return res.status(400).json({
        message: 'Unknown question for this attempt',
      });
    }

    const originalIndex =
      selectedOptionShuffledIndex === null ? null : optOrder[selectedOptionShuffledIndex];

    const ans = attempt.answers.find((a) => String(a.questionId) === String(questionId));

    if (ans) {
      ans.selectedOptionIndex = originalIndex;
    }

    await attempt.save();

    return res.json({
      ok: true,
    });
  } catch (err) {
    console.error('saveAnswer error:', err);

    return res.status(500).json({
      message: 'Failed to save answer',
      error: err.message,
    });
  }
};

export const logViolation = async (req, res) => {
  try {
    const { type } = req.body;

    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      student: req.user.id,
    });

    if (!attempt || attempt.status !== 'in_progress') {
      return res.status(404).json({
        message: 'Attempt not found or already submitted',
      });
    }

    attempt.violations.push({ type });

    if (attempt.violations.length >= 2) {
      attempt.flaggedForReview = true;
    }

    const quiz = await Quiz.findById(attempt.quiz);

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found',
      });
    }

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

    return res.json({
      autoSubmitted: false,
      violationCount: attempt.violations.length,
      maxViolations: quiz.maxViolationsBeforeAutoSubmit,
    });
  } catch (err) {
    console.error('logViolation error:', err);

    return res.status(500).json({
      message: 'Failed to log violation',
      error: err.message,
    });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      student: req.user.id,
    });

    if (!attempt || attempt.status !== 'in_progress') {
      return res.status(404).json({
        message: 'Attempt not found or already submitted',
      });
    }

    const quiz = await Quiz.findById(attempt.quiz);

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found',
      });
    }

    const graded = await gradeAndSubmit(attempt, quiz, {
      autoSubmitted: false,
    });

    return res.json(graded);
  } catch (err) {
    console.error('submitAttempt error:', err);

    return res.status(500).json({
      message: 'Failed to submit quiz',
      error: err.message,
    });
  }
};

/* =========================================================
   GRADING
   ========================================================= */

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

  attempt.lateSubmission = now > new Date(dl.getTime() + 15_000);

  attempt.status = 'submitted';

  if (attempt.lateSubmission) {
    attempt.flaggedForReview = true;
  }

  await attempt.save();

  return {
    score: attempt.score,
    maxScore: attempt.maxScore,
    autoSubmitted: attempt.autoSubmitted,
    lateSubmission: attempt.lateSubmission,
    reason,
    showResultsImmediately: quiz.showResultsImmediately,
  };
}

/* =========================================================
   STUDENT RESULTS
   ========================================================= */

export const getMyResult = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      quiz: req.params.id,
      student: req.user.id,
    });

    if (!attempt) {
      return res.status(404).json({
        message: 'No attempt found',
      });
    }

    if (attempt.status !== 'submitted') {
      return res.status(403).json({
        message: 'Quiz not submitted yet',
      });
    }

    const quiz = await Quiz.findById(req.params.id).select('title showResultsImmediately');

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found',
      });
    }

    if (!quiz.showResultsImmediately) {
      return res.status(403).json({
        message: 'Results are not released yet',
      });
    }

    return res.json({
      title: quiz.title,
      score: attempt.score,
      maxScore: attempt.maxScore,
      submittedAt: attempt.submittedAt,
      autoSubmitted: attempt.autoSubmitted,
    });
  } catch (err) {
    console.error('getMyResult error:', err);

    return res.status(500).json({
      message: 'Failed to fetch result',
      error: err.message,
    });
  }
};
