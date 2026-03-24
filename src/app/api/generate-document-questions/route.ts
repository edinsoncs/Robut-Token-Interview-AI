import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const LANGUAGE_PROMPTS: Record<string, { name: string; instruction: string }> = {
  es: {
    name: "Espanol",
    instruction: "Genera las preguntas en espanol.",
  },
  en: {
    name: "English",
    instruction: "Generate the questions in English.",
  },
  pt: {
    name: "Portugues",
    instruction: "Gere as perguntas em portugues.",
  },
  fr: {
    name: "Francais",
    instruction: "Generez les questions en francais.",
  },
  de: {
    name: "Deutsch",
    instruction: "Generieren Sie die Fragen auf Deutsch.",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      documentContent,
      language = "es",
      numQuestions = 5,
      interviewerName = "AI Interviewer",
    } = body;

    if (!documentContent) {
      return NextResponse.json(
        { error: "Document content is required" },
        { status: 400 }
      );
    }

    // Truncate document content if too long
    const maxContentLength = 8000;
    const truncatedContent =
      documentContent.length > maxContentLength
        ? documentContent.substring(0, maxContentLength) + "..."
        : documentContent;

    const langConfig = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.es;

    const systemPrompt = `You are ${interviewerName}, an expert AI interviewer. Your task is to analyze the provided document and generate thoughtful, relevant interview questions based on its content.

${langConfig.instruction}

Guidelines:
- Generate exactly ${numQuestions} questions
- Questions should be open-ended and encourage detailed responses
- Focus on key topics, concepts, and skills mentioned in the document
- Include a mix of technical and behavioral questions when appropriate
- Questions should help assess the candidate's understanding and experience
- Categorize each question (e.g., "Technical", "Experience", "Problem Solving", "Behavioral")

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "question": "Your question here",
    "category": "Category name"
  }
]

Do not include any other text, explanations, or markdown formatting.`;

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: `Analyze this document and generate ${numQuestions} interview questions:\n\n${truncatedContent}`,
    });

    // Parse the response
    let questions: Array<{ question: string; category?: string }> = [];

    try {
      // Try to extract JSON from the response
      const responseText = result.text.trim();
      
      // Handle potential markdown code blocks
      let jsonString = responseText;
      if (responseText.includes("```")) {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
        }
      }
      
      questions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: try to extract questions from text
      const lines = result.text.split("\n").filter((line) => line.trim());
      questions = lines
        .filter((line) => line.includes("?"))
        .slice(0, numQuestions)
        .map((line) => ({
          question: line.replace(/^\d+\.\s*/, "").trim(),
          category: "General",
        }));
    }

    // Add unique IDs to questions
    const questionsWithIds = questions.map((q) => ({
      id: uuidv4(),
      question: q.question,
      category: q.category || "General",
    }));

    return NextResponse.json({
      success: true,
      questions: questionsWithIds,
      language: langConfig.name,
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
