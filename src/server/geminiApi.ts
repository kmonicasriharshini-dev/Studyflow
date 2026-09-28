import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function explainTopicWithGemini(
  topic: string,
  subject: string,
  noteContext?: string
) {
  const ai = getAI();
  if (!ai) return null;

  try {
    const prompt = `You are a world-class university computer science professor and interactive tutor.
Topic: "${topic}"
Subject: "${subject}"
${noteContext ? `Uploaded Student Lecture Notes Context:\n"${noteContext}"` : ''}

Generate a clear, intuitive, and structured explanation for a college student preparing for their semester examination.
Return valid JSON matching this schema:
{
  "topic": "${topic}",
  "subject": "${subject}",
  "simpleIntuition": "A relatable, real-world everyday analogy explaining the core idea in plain English (2-3 sentences)",
  "formalDefinition": "The precise academic/theoretical definition tested in university exams",
  "stepByStepPoints": [
    {
      "step": 1,
      "title": "Short title",
      "detail": "Clear explanation",
      "exampleOrCode": "Concrete schema, table, or code snippet"
    }
  ],
  "examPitfalls": ["3 common mistakes students make on this question in exams"],
  "practiceQuestions": [
    {
      "question": "A realistic university exam problem",
      "difficulty": "Easy" | "Medium" | "Hard",
      "hint": "Helpful hint",
      "solution": "Step by step answer"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (err) {
    console.error('Gemini explanation error:', err);
  }
  return null;
}

export async function generateQuizWithGemini(topic: string, subject: string) {
  const ai = getAI();
  if (!ai) return null;

  try {
    const prompt = `Generate a 3-question multiple choice mastery quiz for college students on the topic: "${topic}" in "${subject}".
Make questions test real conceptual understanding, schema design, and university exam tricks.
Return valid JSON array of objects:
[
  {
    "id": "q1",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this is correct and why other options are wrong",
    "hint": "Clue without giving away answer"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (err) {
    console.error('Gemini quiz error:', err);
  }
  return null;
}

export async function analyzeSyllabusWithGemini(rawSyllabusText: string, subjectName: string) {
  const ai = getAI();
  if (!ai) return null;

  try {
    const prompt = `You are an academic curriculum analyzer agent.
Analyze this university syllabus for "${subjectName}":
"""
${rawSyllabusText}
"""

Extract and organize into structured Units and Topics with difficulty and estimated hours.
Return valid JSON:
{
  "subjectName": "${subjectName}",
  "totalUnits": 5,
  "units": [
    {
      "unitNumber": 1,
      "title": "Unit Title",
      "weightageMarks": 15,
      "topics": [
        {
          "name": "Topic name",
          "difficulty": "Easy" | "Medium" | "Hard",
          "estimatedHours": 3,
          "summary": "Brief summary of what is covered",
          "highYield": true | false
        }
      ]
    }
  ],
  "recommendations": "2 sentences on high-yield exam areas"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (err) {
    console.error('Gemini syllabus error:', err);
  }
  return null;
}
