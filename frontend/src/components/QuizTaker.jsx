import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const RULES = [
  'The test opens in fullscreen the moment you click "Begin test", and the timer starts immediately.',
  'Do not switch tabs, minimize the window, or move to another app. This is detected.',
  'Right-click, copy, cut, and common devtools shortcuts are disabled and logged if attempted.',
  'You get exactly one warning. A second violation of any kind ends your test immediately and submits it as-is.',
  'Make sure you have a stable internet connection before you begin - the timer does not pause.',
];

export default function QuizTaker({ quizId, API_BASE_URL = '/api', authToken, onFinished }) {
  const [phase, setPhase] = useState('instructions'); // instructions | starting | in_progress | submitted | error
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // questionId -> shuffled option index
  const [current, setCurrent] = useState(0);
  const [deadline, setDeadlineState] = useState(null);
  const [remainingSec, setRemainingSec] = useState(0);
  const [maxViolations, setMaxViolations] = useState(2);
  const [violationCount, setViolationCount] = useState(0);
  const [warning, setWarning] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const attemptIdRef = useRef(null);
  const submittedRef = useRef(false);
  const containerRef = useRef(null);

  const authHeaders = { headers: { Authorization: `Bearer ${authToken}` } };

  const submit = useCallback(async () => {
    if (submittedRef.current || !attemptIdRef.current) return;
    submittedRef.current = true;
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/quiz/attempt/${attemptIdRef.current}/submit`,
        {},
        authHeaders
      );
      setResult(data);
      setPhase('submitted');
      onFinished?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed.');
      setPhase('error');
    }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportViolation = useCallback(async (type) => {
    if (submittedRef.current || !attemptIdRef.current) return;
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/quiz/attempt/${attemptIdRef.current}/violation`,
        { type },
        authHeaders
      );
      setViolationCount(data.violationCount);
      if (data.autoSubmitted) {
        submittedRef.current = true;
        setResult(data.result);
        setPhase('submitted');
        onFinished?.(data.result);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      } else {
        setWarning(
          `Warning ${data.violationCount}/${data.maxViolations}: this action is not allowed and has been recorded. One more violation will end your test.`
        );
      }
    } catch {
      /* best-effort logging; don't block the student on a logging failure */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- click handler for "Begin test": fullscreen must be requested
  // synchronously in this handler, not in a useEffect on mount, or most
  // browsers silently refuse the request. ----------
  const beginTest = async () => {
    setPhase('starting');
    try {
      await containerRef.current?.requestFullscreen?.();
    } catch {
      // Some browsers/policies can block fullscreen; the test still runs,
      // just without that layer of deterrence. Fullscreen-exit detection
      // below simply won't fire in that case.
    }
    try {
      const { data } = await axios.post(`${API_BASE_URL}/quiz/${quizId}/start`, {}, authHeaders);
      setAttemptId(data.attemptId);
      attemptIdRef.current = data.attemptId;
      setQuestions(data.questions);
      setDeadlineState(new Date(data.deadline));
      setMaxViolations(data.maxViolationsBeforeAutoSubmit);
      setViolationCount(data.violationCountSoFar);
      setPhase('in_progress');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start the quiz.');
      setPhase('error');
    }
  };

  // ---------- countdown, driven by server deadline ----------
  useEffect(() => {
    if (phase !== 'in_progress' || !deadline) return;
    const tick = () => {
      const secs = Math.max(0, Math.round((deadline.getTime() - Date.now()) / 1000));
      setRemainingSec(secs);
      if (secs <= 0) submit();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, deadline, submit]);

  // ---------- lock-down listeners, active only once the test is running ----------
  useEffect(() => {
    if (phase !== 'in_progress') return;

    const onVisibility = () => {
      if (document.hidden) reportViolation('tab_hidden');
    };
    const onBlur = () => reportViolation('window_blur');
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !submittedRef.current) {
        reportViolation('fullscreen_exit');
      }
    };
    const blockCopy = (e) => {
      e.preventDefault();
      reportViolation('copy_attempt');
    };
    const blockContextMenu = (e) => {
      e.preventDefault();
      reportViolation('right_click');
    };
    const blockDevtoolsKeys = (e) => {
      const blocked =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U');
      if (blocked) {
        e.preventDefault();
        reportViolation('devtools_shortcut');
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('copy', blockCopy);
    document.addEventListener('cut', blockCopy);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockDevtoolsKeys);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('cut', blockCopy);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockDevtoolsKeys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const selectOption = async (questionId, shuffledIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: shuffledIndex }));
    try {
      await axios.post(
        `${API_BASE_URL}/quiz/attempt/${attemptId}/answer`,
        { questionId, selectedOptionShuffledIndex: shuffledIndex },
        authHeaders
      );
    } catch {
      /* keep the local selection even if the autosave call fails */
    }
  };

  // ---------- render ----------
  if (phase === 'instructions') {
    return (
      <div className="glass-panel" style={{ maxWidth: 560, margin: '40px auto', padding: 24 }}>
        <h2>Before you begin</h2>
        <ul style={{ lineHeight: 1.7 }}>
          {RULES.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <button onClick={beginTest} style={{ marginTop: 12 }}>
          Begin test
        </button>
      </div>
    );
  }

  if (phase === 'starting') return <p>Starting your test…</p>;
  if (phase === 'error') return <p style={{ color: '#e05555' }}>{error}</p>;

  if (phase === 'submitted') {
    const reasonText = {
      violations: 'Your test was ended automatically after repeated rule violations.',
      timeout: 'Time was up, so your test was submitted automatically.',
      manual: null,
    }[result?.reason];

    return (
      <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
        <h2>Quiz submitted</h2>
        {reasonText && <p style={{ color: '#e0a555' }}>{reasonText}</p>}
        {result?.showResultsImmediately ? (
          <p>
            Score: {result.score} / {result.maxScore}
          </p>
        ) : (
          <p>Your response has been recorded. Results will be released by your faculty.</p>
        )}
      </div>
    );
  }

  const q = questions[current];
  const mins = String(Math.floor(remainingSec / 60)).padStart(2, '0');
  const secs = String(remainingSec % 60).padStart(2, '0');

  return (
    <div
      ref={containerRef}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <strong>
          Question {current + 1} / {questions.length}
        </strong>
        <strong style={{ fontFamily: 'monospace' }}>
          {mins}:{secs}
        </strong>
      </div>

      {warning && (
        <div style={{ background: '#3a2a10', color: '#e0a555', padding: 10, marginBottom: 16 }}>
          {warning}
        </div>
      )}

      {q && (
        <div className="glass-panel" style={{ padding: 20 }}>
          <p>{q.questionText}</p>
          {q.options.map((opt, oi) => (
            <label key={oi} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
              <input
                type="radio"
                name={q.questionId}
                checked={answers[q.questionId] === oi}
                onChange={() => selectOption(q.questionId, oi)}
              />{' '}
              {opt}
            </label>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => c + 1)}>Next</button>
        ) : (
          <button onClick={() => submit()}>Submit quiz</button>
        )}
      </div>

      <p style={{ marginTop: 24, fontSize: 12, opacity: 0.6 }}>
        Violations logged: {violationCount} / {maxViolations} before your test is ended.
      </p>
    </div>
  );
}
