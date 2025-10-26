import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { content, style } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Rephrase the following math lesson content in a ${style} style. Make it clearer and more engaging for students:

${content}

Maintain all the mathematical accuracy and key concepts.`,
    })

    return Response.json({ rephrased: text })
  } catch (error) {
    console.error("Rephrase error:", error)
    return Response.json({ error: "Failed to rephrase content" }, { status: 500 })
  }
}
