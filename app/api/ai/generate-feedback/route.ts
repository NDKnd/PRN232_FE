import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { question, studentAnswer, correctAnswer, topic } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `As a math tutor, provide constructive feedback for a student's answer:
Question: ${question}
Topic: ${topic}
Student's Answer: ${studentAnswer}
Correct Answer: ${correctAnswer}

Please provide:
1. Whether the answer is correct or incorrect
2. Explanation of the correct approach
3. Common mistakes to avoid
4. Tips for improvement
5. Related concepts to review`,
    })

    return Response.json({ feedback: text })
  } catch (error) {
    console.error("Feedback generation error:", error)
    return Response.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}
