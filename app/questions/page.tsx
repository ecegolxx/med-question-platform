import Link from "next/link";
import { supabase } from "../../lib/supabase/client";

type Choice = {
  id: number;
  label: string;
  body: string;
  is_correct: boolean;
};

type Topic = {
  id: number;
  name: string;
  slug: string;
};

type Question = {
  id: number;
  body: string;
  difficulty: string;
  explanation: string | null;
  topic_id: number;
  topics: Topic | Topic[] | null;
  choices: Choice[];
};

async function getQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      body,
      difficulty,
      explanation,
      topic_id,
      topics (
        id,
        name,
        slug
      ),
      choices (
        id,
        label,
        body,
        is_correct
      )
    `
    )
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return (data as Question[]) ?? [];
}

function getTopicName(topic: Topic | Topic[] | null): string {
  if (!topic) return "Konu yok";
  if (Array.isArray(topic)) {
    return topic[0]?.name ?? "Konu yok";
  }
  return topic.name;
}

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Soru Havuzu</h1>
            <p className="mt-2 text-slate-600">
              Veritabanından gelen örnek sorular burada listeleniyor.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
                  Soru {index + 1}
                </span>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                  {getTopicName(question.topics)}
                </span>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                  {question.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {question.body}
              </h2>

              <div className="mt-6 space-y-3">
                {question.choices?.map((choice) => (
                  <div
                    key={choice.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <span className="font-semibold">{choice.label}) </span>
                    <span>{choice.body}</span>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="mt-6 rounded-xl bg-slate-100 p-4">
                  <h3 className="font-semibold">Açıklama</h3>
                  <p className="mt-2 text-slate-700">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}