"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { updateQuestion } from "../../new/actions";

type Subject = {
  id: number;
  name: string;
  slug: string;
};

type Topic = {
  id: number;
  subject_id: number;
  name: string;
  slug: string;
};

type Choice = {
  id: number;
  label: string;
  body: string;
  is_correct: boolean;
};

type QuestionRecord = {
  id: number;
  body: string;
  difficulty: string;
  explanation: string | null;
  subject_id: number;
  topic_id: number;
  choices: Choice[];
};

type EditQuestionFormProps = {
  subjects: Subject[];
  topics: Topic[];
  question: QuestionRecord;
};

function getChoiceBody(choices: Choice[], label: string) {
  return choices.find((choice) => choice.label === label)?.body ?? "";
}

function getCorrectAnswer(choices: Choice[]) {
  return choices.find((choice) => choice.is_correct)?.label ?? "A";
}

export default function EditQuestionForm({
  subjects,
  topics,
  question,
}: EditQuestionFormProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    String(question.subject_id)
  );

  const filteredTopics = useMemo(() => {
    return topics.filter(
      (topic) => String(topic.subject_id) === selectedSubjectId
    );
  }, [topics, selectedSubjectId]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    String(question.topic_id)
  );

  useEffect(() => {
    const topicStillValid = filteredTopics.some(
      (topic) => String(topic.id) === selectedTopicId
    );

    if (!topicStillValid) {
      setSelectedTopicId(filteredTopics[0] ? String(filteredTopics[0].id) : "");
    }
  }, [filteredTopics, selectedTopicId]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin · Soruyu Düzenle</h1>
            <p className="mt-2 text-slate-600">
              Mevcut soru ve şık bilgilerini güncelle.
            </p>
          </div>

          <Link
            href="/admin/questions"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
          >
            Listeye Dön
          </Link>
        </div>

        <form
          action={updateQuestion}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="questionId" value={question.id} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Ders</label>
              <select
                name="subjectId"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Konu</label>
              <select
                name="topicId"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              >
                {filteredTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Zorluk</label>
            <select
              name="difficulty"
              defaultValue={question.difficulty}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            >
              <option value="easy">Kolay</option>
              <option value="medium">Orta</option>
              <option value="hard">Zor</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Soru Metni</label>
            <textarea
              name="body"
              rows={4}
              defaultValue={question.body}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">A Şıkkı</label>
              <input
                name="choiceA"
                defaultValue={getChoiceBody(question.choices, "A")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">B Şıkkı</label>
              <input
                name="choiceB"
                defaultValue={getChoiceBody(question.choices, "B")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">C Şıkkı</label>
              <input
                name="choiceC"
                defaultValue={getChoiceBody(question.choices, "C")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">D Şıkkı</label>
              <input
                name="choiceD"
                defaultValue={getChoiceBody(question.choices, "D")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">E Şıkkı</label>
              <input
                name="choiceE"
                defaultValue={getChoiceBody(question.choices, "E")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Doğru Cevap</label>
            <select
              name="correctAnswer"
              defaultValue={getCorrectAnswer(question.choices)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Açıklama</label>
            <textarea
              name="explanation"
              rows={4}
              defaultValue={question.explanation ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:opacity-90"
          >
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </main>
  );
}