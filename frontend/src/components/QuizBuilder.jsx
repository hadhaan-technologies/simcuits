import { useState } from 'react';
import axios from 'axios';

const EMPTY_QUESTION = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  marks: 1,
});

export default function QuizBuilder({ apiBaseUrl = '/api', authToken }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [questions, setQuestions] = useState(Array.from({ length: 20 }, EMPTY_QUESTION));
  // const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const updateQuestion = (index, patch) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options];
        options[optIndex] = value;
        return { ...q, options };
      })
    );
  };

  const validate = () => {
    if (!title.trim()) return 'Title is required.';
    if (!department.trim()) return 'Department is required.';
    if (!startsAt || !endsAt) return 'Start and end time are required.';
    if (new Date(startsAt) >= new Date(endsAt)) return 'Start time must be before end time.';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1} is missing text.`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option.`;
    }
    return '';
  };

  const handleSubmit = async (publish) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSaving(true);
    try {
      await axios.post(
        `${apiBaseUrl}/quizzes`,
        {
          title,
          description,
          department,
          durationMinutes: Number(durationMinutes),
          startsAt,
          endsAt,
          questions,
          status: publish ? 'published' : 'draft',
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setSuccessMsg(publish ? 'Quiz published to students.' : 'Draft saved.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
      <h2>Create Quiz</h2>

      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        <input placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Department (e.g. EEE)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <label>
          Duration (minutes)
          <input
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </label>
        <label>
          Opens at
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </label>
        <label>
          Closes at
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </label>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="glass-panel" style={{ padding: 16, marginBottom: 16 }}>
          <strong>Question {qi + 1}</strong>
          <textarea
            placeholder="Question text"
            value={q.questionText}
            onChange={(e) => updateQuestion(qi, { questionText: e.target.value })}
            style={{ width: '100%', marginTop: 8 }}
          />
          {q.options.map((opt, oi) => (
            <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <input
                type="radio"
                name={`correct-${qi}`}
                checked={q.correctOptionIndex === oi}
                onChange={() => updateQuestion(qi, { correctOptionIndex: oi })}
                title="Mark as correct answer"
              />
              <input
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          ))}
          <label style={{ display: 'block', marginTop: 8 }}>
            Marks
            <input
              type="number"
              min={0}
              value={q.marks}
              onChange={(e) => updateQuestion(qi, { marks: Number(e.target.value) })}
              style={{ width: 60, marginLeft: 8 }}
            />
          </label>
        </div>
      ))}

      {error && <p style={{ color: '#e05555' }}>{error}</p>}
      {successMsg && <p style={{ color: '#4caf7d' }}>{successMsg}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button disabled={saving} onClick={() => handleSubmit(false)}>
          Save as draft
        </button>
        <button disabled={saving} onClick={() => handleSubmit(true)}>
          Publish to students
        </button>
      </div>
    </div>
  );
}
