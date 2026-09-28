import React, { useState } from 'react';
import { TopicQuiz, QuizQuestion } from '../types';
import { 
  Trophy, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import { fetchCustomQuiz } from '../services/api';

interface QuizMasteryProps {
  quizzes: TopicQuiz[];
  onCompleteQuiz: (topicId: string, score: number, nextTopicIdToUnlock?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const QuizMastery: React.FC<QuizMasteryProps> = ({
  quizzes,
  onCompleteQuiz,
  onNavigateTab,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>('dbms-norm-2'); // Level 3 active
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<boolean>(false);
  const [unlockedTopicName, setUnlockedTopicName] = useState<string>('');

  const currentQuiz = quizzes.find((q) => q.topicId === selectedQuizId) || quizzes[0];
  const questions = currentQuiz.questions;
  const currentQuestion = questions[activeQuestionIdx] || questions[0];

  const handleSelectQuiz = (quiz: TopicQuiz) => {
    if (!quiz.isUnlocked) return;
    setSelectedQuizId(quiz.topicId);
    setActiveQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
    setShowUnlockAnimation(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [activeQuestionIdx]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < questions.length - 1) {
      setActiveQuestionIdx((prev) => prev + 1);
      setSelectedOption(userAnswers[activeQuestionIdx + 1] ?? null);
      setIsAnswerSubmitted(userAnswers[activeQuestionIdx + 1] !== undefined);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
      const scorePercent = Math.round((correct / questions.length) * 100);
      setFinalScore(scorePercent);
      setQuizFinished(true);

      const passed = scorePercent >= currentQuiz.requiredPassingScore;
      if (passed && currentQuiz.unlocksNextTopicId) {
        const nextQuiz = quizzes.find((q) => q.topicId === currentQuiz.unlocksNextTopicId);
        if (nextQuiz) {
          setUnlockedTopicName(nextQuiz.topicName);
          setShowUnlockAnimation(true);
        }
      }

      onCompleteQuiz(currentQuiz.topicId, scorePercent, passed ? currentQuiz.unlocksNextTopicId : undefined);
    }
  };

  const handleRestartQuiz = () => {
    setActiveQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
    setShowUnlockAnimation(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Adaptive Quiz Engine
              </span>
              <span className="text-xs text-slate-500">Progressive Mastery & Unlock System</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
              Curriculum Mastery & Topic Unlocking
            </h1>
            <p className="text-xs text-slate-500">
              Each topic is locked until you achieve at least <strong className="text-slate-800">75%</strong> on the prerequisite level. Pass the quiz to unlock subsequent topics!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              Passing Mark: 75%
            </span>
          </div>
        </div>

        {/* Topic Mastery Ladder / Progression Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between overflow-x-auto gap-3 py-2 no-scrollbar">
            {quizzes.map((quiz, index) => {
              const isSelected = selectedQuizId === quiz.topicId;
              const isPassed = (quiz.score || 0) >= quiz.requiredPassingScore;

              return (
                <button
                  key={quiz.topicId}
                  onClick={() => handleSelectQuiz(quiz)}
                  disabled={!quiz.isUnlocked}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    !quiz.isUnlocked
                      ? 'bg-slate-50 text-slate-400 border-slate-200/60 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {!quiz.isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Unlock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                  )}
                  <span>Level {quiz.level}: {quiz.topicName.split(':')[1] || quiz.topicName}</span>
                  {quiz.score !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {quiz.score}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebratory Unlock Banner */}
      {showUnlockAnimation && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 shadow-sm animate-pulse-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  🎉 Congratulations! Milestone Reached
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-800">
                You unlocked "{unlockedTopicName}"!
              </h3>
              <p className="text-xs text-slate-600">
                Your syllabus coverage and study readiness have been automatically updated in your Dashboard.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('dashboard')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            View Updated Dashboard
          </button>
        </div>
      )}

      {/* Main Quiz Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Quiz Card */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Level {currentQuiz.level} Quiz
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  {currentQuiz.topicName}
                </h3>
              </div>

              {!quizFinished && (
                <div className="text-xs font-bold text-slate-500">
                  Question {activeQuestionIdx + 1} of {questions.length}
                </div>
              )}
            </div>

            {/* Quiz Finished View */}
            {quizFinished ? (
              <div className="py-8 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  finalScore >= currentQuiz.requiredPassingScore
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {finalScore >= currentQuiz.requiredPassingScore ? (
                    <Trophy className="w-8 h-8" />
                  ) : (
                    <RotateCcw className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-800">
                    {finalScore >= currentQuiz.requiredPassingScore
                      ? 'Topic Successfully Mastered! 🌟'
                      : 'Almost there! Review & Retake'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    You scored <strong className="text-slate-800 text-base">{finalScore}%</strong> (Requirement: {currentQuiz.requiredPassingScore}%)
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>

                  {finalScore >= currentQuiz.requiredPassingScore && currentQuiz.unlocksNextTopicId && (
                    <button
                      onClick={() => {
                        const nextQ = quizzes.find((q) => q.topicId === currentQuiz.unlocksNextTopicId);
                        if (nextQ) handleSelectQuiz(nextQ);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Proceed to Next Unlocked Topic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Active Question View */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let optionStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback after submit */}
                {isAnswerSubmitted && (
                  <div className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-200 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correct! Excellent relational intuition.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Incorrect. Let's inspect why:</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed text-slate-700">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 italic">
                    💡 Hint: {currentQuestion.hint}
                  </div>

                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>{activeQuestionIdx < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 Cols): Progression Tree Rules & Unlock Mechanics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Unlock Mechanics</span>
            </h3>

            <p className="text-xs text-slate-500">
              Mastering foundational concepts ensures you never hit a wall during complex university exam proofs.
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-800">Level 1 & 2: Mastered</span>
                <p className="text-[11px] text-slate-600">
                  Functional dependencies, Armstrong Axioms, 1NF and 2NF partial dependencies mastered.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1">
                <span className="font-bold text-indigo-800">Level 3 (Current): Third Normal Form</span>
                <p className="text-[11px] text-slate-600">
                  Pass this quiz (&ge; 75%) to unlock Level 4: Boyce-Codd Normal Form (BCNF).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 opacity-70">
                <span className="font-bold text-slate-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Level 4 & 5: Locked</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Requires passing Level 3 to unlock BCNF, Lossless Join and Dependency Preservation.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('tutor')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Review Notes with AI Tutor First</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
