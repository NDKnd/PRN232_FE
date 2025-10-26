import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { topic, grade, difficulty, count } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Generate ${count} math questions for the following:
Topic: ${topic}
Grade Level: ${grade}
Difficulty: ${difficulty}

For each question, provide:
1. The question text
2. Multiple choice options (4 options)
3. The correct answer
4. An explanation

Format as JSON array with objects containing: question, options, answer, explanation`,
    })

    return Response.json({ questions: text })
  } catch (error) {
    console.error("Question generation error:", error)
    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
