import { createClient } from "../../../../lib/supabase/server";
import QuestionAdminForm from "./QuestionAdminForm";

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

async function getFormData() {
  const supabase = await createClient();

  const [{ data: subjects, error: subjectsError }, { data: topics, error: topicsError }] =
    await Promise.all([
      supabase.from("subjects").select("*").order("name", { ascending: true }),
      supabase
        .from("topics")
        .select("id, subject_id, name, slug")
        .order("name", { ascending: true }),
    ]);

  if (subjectsError) {
    throw new Error(subjectsError.message);
  }

  if (topicsError) {
    throw new Error(topicsError.message);
  }

  return {
    subjects: (subjects ?? []) as Subject[],
    topics: (topics ?? []) as Topic[],
  };
}

export default async function NewQuestionAdminPage() {
  const { subjects, topics } = await getFormData();

  return <QuestionAdminForm subjects={subjects} topics={topics} />;
}