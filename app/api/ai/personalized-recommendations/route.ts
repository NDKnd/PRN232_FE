import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { weakTopics, strongTopics, recentScores } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Based on a student's learning profile, provide personalized study recommendations:
Weak Topics: ${weakTopics.join(", ")}
Strong Topics: ${strongTopics.join(", ")}
Recent Scores: ${recentScores.join(", ")}

Please provide:
1. Priority topics to focus on
2. Recommended practice problems
3. Study strategies
4. Resources to review
5. Estimated time to mastery`,
    })

    return Response.json({ recommendations: text })
  } catch (error) {
    console.error("Recommendations error:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
