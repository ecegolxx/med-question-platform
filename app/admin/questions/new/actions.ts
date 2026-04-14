"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminSupabase } from "../../../../lib/supabase/admin";
import { createClient } from "../../../../lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createQuestion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yap.");
  }

  const subjectId = Number(formData.get("subjectId"));
  const topicId = Number(formData.get("topicId"));
  const body = getString(formData, "body");
  const difficulty = getString(formData, "difficulty");
  const explanation = getString(formData, "explanation");

  const choiceA = getString(formData, "choiceA");
  const choiceB = getString(formData, "choiceB");
  const choiceC = getString(formData, "choiceC");
  const choiceD = getString(formData, "choiceD");
  const choiceE = getString(formData, "choiceE");
  const correctAnswer = getString(formData, "correctAnswer");

  if (!subjectId || !topicId || !body || !difficulty) {
    throw new Error("Zorunlu alanlar eksik.");
  }

  if (!choiceA || !choiceB || !choiceC || !choiceD || !choiceE) {
    throw new Error("Tüm şıklar doldurulmalı.");
  }

  if (!["A", "B", "C", "D", "E"].includes(correctAnswer)) {
    throw new Error("Geçerli bir doğru cevap seç.");
  }

  const { data: insertedQuestion, error: questionError } = await adminSupabase
    .from("questions")
    .insert({
      subject_id: subjectId,
      topic_id: topicId,
      body,
      difficulty,
      explanation: explanation || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (questionError || !insertedQuestion) {
    throw new Error(questionError?.message ?? "Soru eklenemedi.");
  }

  const choices = [
    {
      question_id: insertedQuestion.id,
      label: "A",
      body: choiceA,
      is_correct: correctAnswer === "A",
    },
    {
      question_id: insertedQuestion.id,
      label: "B",
      body: choiceB,
      is_correct: correctAnswer === "B",
    },
    {
      question_id: insertedQuestion.id,
      label: "C",
      body: choiceC,
      is_correct: correctAnswer === "C",
    },
    {
      question_id: insertedQuestion.id,
      label: "D",
      body: choiceD,
      is_correct: correctAnswer === "D",
    },
    {
      question_id: insertedQuestion.id,
      label: "E",
      body: choiceE,
      is_correct: correctAnswer === "E",
    },
  ];

  const { error: choicesError } = await adminSupabase
    .from("choices")
    .insert(choices);

  if (choicesError) {
    throw new Error(choicesError.message);
  }

  revalidatePath("/questions");
  revalidatePath("/admin/questions");
  revalidatePath("/admin/questions/new");

  redirect("/admin/questions");
}

export async function deleteQuestion(formData: FormData) {
  const questionId = Number(formData.get("questionId"));

  if (!questionId) {
    throw new Error("Soru kimliği bulunamadı.");
  }

  const { error } = await adminSupabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/questions");
  revalidatePath("/admin/questions");
}

export async function updateQuestion(formData: FormData) {
  const questionId = Number(formData.get("questionId"));
  const subjectId = Number(formData.get("subjectId"));
  const topicId = Number(formData.get("topicId"));
  const body = getString(formData, "body");
  const difficulty = getString(formData, "difficulty");
  const explanation = getString(formData, "explanation");

  const choiceA = getString(formData, "choiceA");
  const choiceB = getString(formData, "choiceB");
  const choiceC = getString(formData, "choiceC");
  const choiceD = getString(formData, "choiceD");
  const choiceE = getString(formData, "choiceE");
  const correctAnswer = getString(formData, "correctAnswer");

  if (!questionId || !subjectId || !topicId || !body || !difficulty) {
    throw new Error("Zorunlu alanlar eksik.");
  }

  const { error: questionError } = await adminSupabase
    .from("questions")
    .update({
      subject_id: subjectId,
      topic_id: topicId,
      body,
      difficulty,
      explanation: explanation || null,
    })
    .eq("id", questionId);

  if (questionError) {
    throw new Error(questionError.message);
  }

  const updates = [
    { label: "A", body: choiceA, is_correct: correctAnswer === "A" },
    { label: "B", body: choiceB, is_correct: correctAnswer === "B" },
    { label: "C", body: choiceC, is_correct: correctAnswer === "C" },
    { label: "D", body: choiceD, is_correct: correctAnswer === "D" },
    { label: "E", body: choiceE, is_correct: correctAnswer === "E" },
  ];

  for (const item of updates) {
    const { error } = await adminSupabase
      .from("choices")
      .update({
        body: item.body,
        is_correct: item.is_correct,
      })
      .eq("question_id", questionId)
      .eq("label", item.label);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/questions");
  revalidatePath("/admin/questions");
  revalidatePath(`/admin/questions/${questionId}/edit`);

  redirect("/admin/questions");
}