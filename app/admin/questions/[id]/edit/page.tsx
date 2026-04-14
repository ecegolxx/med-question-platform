import { notFound } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import EditQuestionForm from "./EditQuestionForm";

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

async function getEditPageData(id: number) {
  const supabase = await createClient();

  const [
    { data: subjects, error: subjectsError },
    { data: topics, error: topicsError },
    { data: question, error: questionError },
  ] = await Promise.all([
    supabase.from("subjects").select("*").order("name", { ascending: true }),
    supabase.from("topics").select("*").order("name", { ascending: true }),
    supabase
      .from("questions")
      .select(
        `
        id,
        body,
        difficulty,
        explanation,
        subject_id,
        topic_id,
        choices (
          id,
          label,
          body,
          is_correct
        )
      `
      )
      .eq("id", id)
      .single(),
  ]);

  if (subjectsError) {
    throw new Error(subjectsError.message);
  }

  if (topicsError) {
    throw new Error(topicsError.message);
  }

  if (questionError) {
    return null;
  }

  return {
    subjects: (subjects ?? []) as Subject[],
    topics: (topics ?? []) as Topic[],
    question: question as QuestionRecord,
  };
}

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!id) {
    notFound();
  }

  const data = await getEditPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <EditQuestionForm
      subjects={data.subjects}
      topics={data.topics}
      question={data.question}
    />
  );
}