import { supabase } from "../../lib/supabase/client";
import QuestionsClient from "./questions-client";

export type Choice = {
  id: number;
  label: string;
  body: string;
  is_correct: boolean;
};

export type Topic = {
  id: number;
  name: string;
  slug: string;
};

export type Question = {
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

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return <QuestionsClient questions={questions} />;
}