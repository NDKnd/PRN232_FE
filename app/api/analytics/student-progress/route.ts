export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    // Mock analytics data
    const analyticsData = {
      studentId,
      totalQuizzesCompleted: 24,
      averageScore: 78,
      practiceStreak: 7,
      topicsCompleted: 2,
      weakTopics: ["Calculus", "Geometry Proofs"],
      strongTopics: ["Algebra", "Statistics"],
      weeklyProgress: [
        { week: "Week 1", score: 65 },
        { week: "Week 2", score: 72 },
        { week: "Week 3", score: 78 },
        { week: "Week 4", score: 82 },
      ],
      topicBreakdown: [
        { topic: "Algebra", completed: 8, total: 10 },
        { topic: "Geometry", completed: 5, total: 10 },
        { topic: "Calculus", completed: 3, total: 10 },
        { topic: "Statistics", completed: 7, total: 10 },
      ],
    }

    return Response.json(analyticsData)
  } catch (error) {
    console.error("Analytics error:", error)
    return Response.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
