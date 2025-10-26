export async function POST(request: Request) {
  try {
    const { quizId, answers, timeSpent } = await request.json()

    // Calculate score
    const correctAnswers = {
      "1": "x = 2 or x = 3",
      "2": "4",
      "3": "6x",
    }

    let score = 0
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (correctAnswers[questionId as keyof typeof correctAnswers] === answer) {
        score++
      }
    })

    const percentage = Math.round((score / Object.keys(correctAnswers).length) * 100)

    return Response.json({
      quizId,
      score,
      totalQuestions: Object.keys(correctAnswers).length,
      percentage,
      timeSpent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Quiz submission error:", error)
    return Response.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
