"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Question, Subject, Topic } from "./page";

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

function getTopicSlug(topic: Topic | Topic[] | null): string {
  if (!topic) return "unknown";
  if (Array.isArray(topic)) {
    return topic[0]?.slug ?? "unknown";
  }
  return topic.slug;
}

function getSubjectName(subject: Subject | Subject[] | null): string {
  if (!subject) return "Ders yok";
  if (Array.isArray(subject)) {
    return subject[0]?.name ?? "Ders yok";
  }
  return subject.name;
}

function getSubjectSlug(subject: Subject | Subject[] | null): string {
  if (!subject) return "unknown";
  if (Array.isArray(subject)) {
    return subject[0]?.slug ?? "unknown";
  }
  return subject.slug;
}

export default function QuestionsClient({
  questions,
}: QuestionsClientProps) {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const subjectOptions = useMemo(() => {
    const map = new Map<string, string>();

    questions.forEach((question) => {
      const slug = getSubjectSlug(question.subjects);
      const name = getSubjectName(question.subjects);

      if (!map.has(slug)) {
        map.set(slug, name);
      }
    });

    return Array.from(map.entries()).map(([slug, name]) => ({
      slug,
      name,
    }));
  }, [questions]);

  const subjectFilteredQuestions = useMemo(() => {
    if (selectedSubject === "all") return questions;

    return questions.filter(
      (question) => getSubjectSlug(question.subjects) === selectedSubject
    );
  }, [questions, selectedSubject]);

  const topicOptions = useMemo(() => {
    const map = new Map<string, string>();

    subjectFilteredQuestions.forEach((question) => {
      const slug = getTopicSlug(question.topics);
      const name = getTopicName(question.topics);

      if (!map.has(slug)) {
        map.set(slug, name);
      }
    });

    return Array.from(map.entries()).map(([slug, name]) => ({
      slug,
      name,
    }));
  }, [subjectFilteredQuestions]);

  const filteredQuestions = useMemo(() => {
    if (selectedTopic === "all") return subjectFilteredQuestions;

    return subjectFilteredQuestions.filter(
      (question) => getTopicSlug(question.topics) === selectedTopic
    );
  }, [subjectFilteredQuestions, selectedTopic]);

  useEffect(() => {
    setSelectedTopic("all");
  }, [selectedSubject]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedChoiceId(null);
    setIsChecked(false);
    setShowExplanation(false);
    setCorrectCount(0);
    setWrongQuestions([]);
    setQuizFinished(false);
  }, [selectedSubject, selectedTopic]);

  const currentQuestion = filteredQuestions[currentIndex];

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

  if (!filteredQuestions.length) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Soru Çözme Modu</h1>
              <p className="mt-2 text-slate-600">
                Seçilen filtrede henüz soru bulunamadı.
              </p>
            </div>

            <Link
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Ders Seç
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
              >
                <option value="all">Tüm Dersler</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.slug} value={subject.slug}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Konu Seç
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
              >
                <option value="all">Tüm Konular</option>
                {topicOptions.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function handleCheckAnswer() {
    if (selectedChoiceId === null || !correctChoice || isChecked) return;

    const isCorrect = selectedChoiceId === correctChoice.id;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      const alreadyExists = wrongQuestions.some(
        (question) => question.id === currentQuestion.id
      );

      if (!alreadyExists) {
        setWrongQuestions((prev) => [...prev, currentQuestion]);
      }
    }

    setIsChecked(true);
  }

  function handleNextQuestion() {
    if (!isChecked) return;

    if (currentIndex === filteredQuestions.length - 1) {
      setQuizFinished(true);
      return;
    }

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
    setWrongQuestions([]);
    setQuizFinished(false);
  }

  const isLastQuestion = currentIndex === filteredQuestions.length - 1;
  const selectedIsCorrect =
    isChecked && correctChoice && selectedChoiceId === correctChoice.id;

  const scorePercent =
    filteredQuestions.length > 0
      ? Math.round((correctCount / filteredQuestions.length) * 100)
      : 0;

  if (quizFinished) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Ders Seç
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
              >
                <option value="all">Tüm Dersler</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.slug} value={subject.slug}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Konu Seç
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
              >
                <option value="all">Tüm Konular</option>
                {topicOptions.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold">Test Tamamlandı</h1>
            <p className="mt-2 text-slate-600">
              Sonuçlarını aşağıda görebilirsin.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Toplam Soru</p>
                <p className="mt-2 text-3xl font-bold">
                  {filteredQuestions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Doğru Sayısı</p>
                <p className="mt-2 text-3xl font-bold">{correctCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Başarı Oranı</p>
                <p className="mt-2 text-3xl font-bold">%{scorePercent}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:opacity-90"
              >
                Testi Yeniden Başlat
              </button>

              <Link
                href="/"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 transition hover:bg-slate-100"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Yanlış Yapılan Sorular</h2>

            {wrongQuestions.length === 0 ? (
              <p className="mt-4 text-green-700">
                Tebrikler, hiç yanlış yapmadın.
              </p>
            ) : (
              <div className="mt-6 space-y-6">
                {wrongQuestions.map((question, index) => {
                  const rightChoice = question.choices.find(
                    (choice) => choice.is_correct
                  );

                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
                          Yanlış Soru {index + 1}
                        </span>

                        <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                          {getSubjectName(question.subjects)}
                        </span>

                        <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                          {getTopicName(question.topics)}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold">{question.body}</h3>

                      <div className="mt-4 space-y-2">
                        {question.choices.map((choice) => (
                          <div
                            key={choice.id}
                            className={`rounded-xl border p-3 ${
                              choice.is_correct
                                ? "border-green-600 bg-green-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <span className="font-semibold">{choice.label}) </span>
                            <span>{choice.body}</span>
                          </div>
                        ))}
                      </div>

                      {rightChoice && (
                        <p className="mt-4 font-medium text-green-700">
                          Doğru cevap: {rightChoice.label}) {rightChoice.body}
                        </p>
                      )}

                      {question.explanation && (
                        <div className="mt-4 rounded-xl bg-white p-4">
                          <h4 className="font-semibold">Açıklama</h4>
                          <p className="mt-2 text-slate-700">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Soru Çözme Modu</h1>
            <p className="mt-2 text-slate-600">
              Ders ve konu seçerek tek tek soru çözebilirsin.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ders Seç
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            >
              <option value="all">Tüm Dersler</option>
              {subjectOptions.map((subject) => (
                <option key={subject.slug} value={subject.slug}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Konu Seç
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            >
              <option value="all">Tüm Konular</option>
              {topicOptions.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">İlerleme</p>
            <p className="mt-2 text-2xl font-bold">
              {currentIndex + 1} / {filteredQuestions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Doğru Sayısı</p>
            <p className="mt-2 text-2xl font-bold">{correctCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Ders</p>
            <p className="mt-2 text-lg font-semibold">
              {getSubjectName(currentQuestion.subjects)}
            </p>
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

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={!isChecked}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLastQuestion ? "Testi Bitir" : "Sonraki Soru"}
            </button>
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