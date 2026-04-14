import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { deleteQuestion } from "./new/actions";

type QuestionRow = {
  id: number;
  body: string;
  difficulty: string;
  subjects: { name: string } | { name: string }[] | null;
  topics: { name: string } | { name: string }[] | null;
};

function getName(
  item: { name: string } | { name: string }[] | null,
  fallback: string
) {
  if (!item) return fallback;
  if (Array.isArray(item)) return item[0]?.name ?? fallback;
  return item.name;
}

async function getAdminQuestions(): Promise<QuestionRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      body,
      difficulty,
      subjects (
        name
      ),
      topics (
        name
      )
    `
    )
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as QuestionRow[]) ?? [];
}

export default async function AdminQuestionsPage() {
  const questions = await getAdminQuestions();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin · Soru Listesi</h1>
            <p className="mt-2 text-slate-600">
              Tüm soruları görüntüle, düzenle veya sil.
            </p>
          </div>

          <Link
            href="/admin/questions/new"
            className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:opacity-90"
          >
            Yeni Soru Ekle
          </Link>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
                  ID {question.id}
                </span>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                  {getName(question.subjects, "Ders yok")}
                </span>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                  {getName(question.topics, "Konu yok")}
                </span>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                  {question.difficulty}
                </span>
              </div>

              <h2 className="text-lg font-semibold leading-7">
                {question.body}
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/admin/questions/${question.id}/edit`}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
                >
                  Düzenle
                </Link>

                <form action={deleteQuestion}>
                  <input type="hidden" name="questionId" value={question.id} />
                  <button
                    type="submit"
                    className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-red-700 transition hover:bg-red-100"
                  >
                    Sil
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}