"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Question, Topic } from "./page";

type QuestionsClientProps = {
  questions: Question[];
};

function getTopicName(topic: Topic | Topic[] | null): string {
  if (!topic) return "Konu yok";
  if (Array.isArray(topic)) {
    return topic[0]?.name ?? "Konu yok";
  }
  return topic.name;
}

export default function QuestionsClient({
  questions,
}: QuestionsClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];

  const correctChoice = useMemo(() => {
    return currentQuestion?.choices?.find((choice) => choice.is_correct) ?? null;
  }, [currentQuestion]);

  if (!questions.length) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Soru Havuzu</h1>
          <p className="mt-4 text-slate-600">Henüz soru bulunamadı.</p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  function handleCheckAnswer() {
    if (selectedChoiceId === null || !correctChoice || isChecked) return;

    if (selectedChoiceId === correctChoice.id) {
      setCorrectCount((prev) => prev + 1);
    }

    setIsChecked(true);
  }

  function handleNextQuestion() {
    if (currentIndex === questions.length - 1) return;

    setCurrentIndex((prev) => prev + 1);
    setSelectedChoiceId(null);
    setIsChecked(false);
    setShowExplanation(false);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedChoiceId(null);
    setIsChecked(false);
    setShowExplanation(false);
    setCorrectCount(0);
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const selectedIsCorrect =
    isChecked && correctChoice && selectedChoiceId === correctChoice.id;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Soru Çözme Modu</h1>
            <p className="mt-2 text-slate-600">
              Tek tek soru çöz, cevabını kontrol et ve açıklamayı incele.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">İlerleme</p>
            <p className="mt-2 text-2xl font-bold">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Doğru Sayısı</p>
            <p className="mt-2 text-2xl font-bold">{correctCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Konu</p>
            <p className="mt-2 text-lg font-semibold">
              {getTopicName(currentQuestion.topics)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
              Soru {currentIndex + 1}
            </span>

            <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-2xl font-semibold leading-9">
            {currentQuestion.body}
          </h2>

          <div className="mt-6 space-y-3">
            {currentQuestion.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const isCorrectChoice = isChecked && choice.is_correct;
              const isWrongSelected =
                isChecked && isSelected && !choice.is_correct;

              let choiceClassName =
                "w-full rounded-xl border p-4 text-left transition ";

              if (isCorrectChoice) {
                choiceClassName +=
                  "border-green-600 bg-green-50 text-slate-900";
              } else if (isWrongSelected) {
                choiceClassName += "border-red-600 bg-red-50 text-slate-900";
              } else if (isSelected) {
                choiceClassName +=
                  "border-slate-900 bg-slate-100 text-slate-900";
              } else {
                choiceClassName +=
                  "border-slate-200 bg-white hover:border-slate-400";
              }

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    if (!isChecked) {
                      setSelectedChoiceId(choice.id);
                    }
                  }}
                  disabled={isChecked}
                  className={choiceClassName}
                >
                  <span className="font-semibold">{choice.label}) </span>
                  <span>{choice.body}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={selectedChoiceId === null || isChecked}
              className="rounded-xl bg-slate-900 px-5 py-3 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cevabı Kontrol Et
            </button>

            <button
              type="button"
              onClick={() => setShowExplanation((prev) => !prev)}
              disabled={!isChecked}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {showExplanation ? "Açıklamayı Gizle" : "Açıklamayı Göster"}
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!isChecked}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sonraki Soru
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 transition hover:bg-slate-100"
              >
                Başa Dön
              </button>
            )}
          </div>

          {isChecked && (
            <div
              className={`mt-6 rounded-xl p-4 ${
                selectedIsCorrect
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {selectedIsCorrect
                ? "Doğru cevap verdin."
                : `Yanlış cevap. Doğru cevap: ${correctChoice?.label}) ${correctChoice?.body}`}
            </div>
          )}

          {isChecked && showExplanation && currentQuestion.explanation && (
            <div className="mt-6 rounded-xl bg-slate-100 p-4">
              <h3 className="font-semibold">Açıklama</h3>
              <p className="mt-2 text-slate-700">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}