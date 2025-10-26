import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { topic, grade, outline } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `You are an expert math teacher. Generate a comprehensive lesson plan for the following:
Topic: ${topic}
Grade Level: ${grade}
Outline: ${outline}

Please provide:
1. Learning objectives
2. Key concepts to cover
3. Real-world examples
4. Practice problems
5. Assessment strategies

Format the response in clear sections.`,
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error("AI generation error:", error)
    return Response.json({ error: "Failed to generate lesson content" }, { status: 500 })
  }
}
