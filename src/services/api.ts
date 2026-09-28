import { TutorExplanation, QuizQuestion } from '../types';
import { DEFAULT_TUTOR_NORMALIZATION, INITIAL_QUIZZES } from '../data/mockData';

export async function fetchTopicExplanation(
  topic: string,
  subject: string,
  noteContext?: string
): Promise<TutorExplanation> {
  try {
    const res = await fetch('/api/tutor/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject, noteContext }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.explanation) {
        return data.explanation;
      }
    }
  } catch (err) {
    console.warn('Fallback to local tutor engine', err);
  }
  return DEFAULT_TUTOR_NORMALIZATION;
}

export async function fetchCustomQuiz(
  topic: string,
  subject: string
): Promise<QuizQuestion[]> {
  try {
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions;
      }
    }
  } catch (err) {
    console.warn('Fallback to local quiz bank', err);
  }
  return INITIAL_QUIZZES[2].questions;
}

export async function fetchSyllabusAnalysis(
  syllabusText: string,
  subjectName: string
): Promise<any> {
  try {
    const res = await fetch('/api/syllabus/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syllabusText, subjectName }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.analysis) {
        return data.analysis;
      }
    }
  } catch (err) {
    console.warn('Fallback to local syllabus parser', err);
  }
  return null;
}
