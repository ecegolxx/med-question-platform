"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createQuestion } from "./actions";

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

type QuestionAdminFormProps = {
  subjects: Subject[];
  topics: Topic[];
};

export default function QuestionAdminForm({
  subjects,
  topics,
}: QuestionAdminFormProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0] ? String(subjects[0].id) : ""
  );

  const filteredTopics = useMemo(() => {
    return topics.filter(
      (topic) => String(topic.subject_id) === selectedSubjectId
    );
  }, [topics, selectedSubjectId]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  useEffect(() => {
    setSelectedTopicId(filteredTopics[0] ? String(filteredTopics[0].id) : "");
  }, [filteredTopics]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin · Yeni Soru Ekle</h1>
            <p className="mt-2 text-slate-600">
              Ders, konu, soru metni, açıklama ve 5 şıklı cevap yapısı ile yeni soru ekle.
            </p>
          </div>

          <Link
            href="/questions"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
          >
            Soru Havuzuna Dön
          </Link>
        </div>

        <form action={createQuestion} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
              defaultValue="medium"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Soruyu buraya yaz..."
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">A Şıkkı</label>
              <input name="choiceA" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">B Şıkkı</label>
              <input name="choiceB" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">C Şıkkı</label>
              <input name="choiceC" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">D Şıkkı</label>
              <input name="choiceD" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">E Şıkkı</label>
              <input name="choiceE" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Doğru Cevap</label>
            <select
              name="correctAnswer"
              defaultValue="A"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Doğru cevabın neden doğru olduğunu yaz..."
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:opacity-90"
          >
            Soruyu Kaydet
          </button>
        </form>
      </div>
    </main>
  );
}