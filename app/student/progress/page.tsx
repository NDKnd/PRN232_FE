 // "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
// import { TrendingUp, Target, BookOpen } from "lucide-react"

// const progressData = [
//   { week: "Week 1", score: 65 },
//   { week: "Week 2", score: 72 },
//   { week: "Week 3", score: 78 },
//   { week: "Week 4", score: 82 },
// ]

// const topicProgress = [
//   { topic: "Algebra", completed: 8, total: 10 },
//   { topic: "Geometry", completed: 5, total: 10 },
//   { topic: "Calculus", completed: 3, total: 10 },
//   { topic: "Statistics", completed: 7, total: 10 },
// ]

// export default function Progress() {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>
//         <p className="text-muted-foreground">Track your learning journey 123</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="text-3xl font-bold">78%</div>
//               <TrendingUp className="w-8 h-8 text-green-500/50" />
//             </div>
//             <p className="text-xs text-muted-foreground mt-2">+5% from last week</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Completed</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="text-3xl font-bold">24</div>
//               <Target className="w-8 h-8 text-primary/50" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Topics Mastered</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="text-3xl font-bold">2</div>
//               <BookOpen className="w-8 h-8 text-accent/50" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Score Trend */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Score Trend</CardTitle>
//           <CardDescription>Your average score over time</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={progressData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="week" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Topic Progress */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Topic Progress</CardTitle>
//           <CardDescription>Lessons completed by topic</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {topicProgress.map((topic) => (
//             <div key={topic.topic}>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-medium text-foreground">{topic.topic}</span>
//                 <span className="text-sm text-muted-foreground">
//                   {topic.completed}/{topic.total}
//                 </span>
//               </div>
//               <div className="w-full bg-muted rounded-full h-2">
//                 <div
//                   className="bg-primary h-2 rounded-full transition-all"
//                   style={{ width: `${(topic.completed / topic.total) * 100}%` }}
//                 />
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Weak Topics */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Areas for Improvement</CardTitle>
//           <CardDescription>Topics where you need more practice</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {[
//               { topic: "Calculus Limits", avgScore: 62, recommendation: "Review limit definition and properties" },
//               { topic: "Geometry Proofs", avgScore: 68, recommendation: "Practice more proof techniques" },
//             ].map((item, i) => (
//               <div key={i} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="font-medium text-foreground">{item.topic}</p>
//                   <span className="text-sm font-semibold text-yellow-700">{item.avgScore}%</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground">{item.recommendation}</p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// api
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, Target, BookOpen } from 'lucide-react';
import { progressApi } from '@/features/progress';
import type {
  ScoreTrend,
  TopicProgress,
  AreaForImprovement,
  OverallProgress,
} from '@/features/progress';
import { toast } from '@/components/ui/use-toast';

// === HOOK: Tách logic API ===
function useProgressDashboard() {
  const [overall, setOverall] = useState<OverallProgress | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrend[]>([]);
  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [improvements, setImprovements] = useState<AreaForImprovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [overallRes, trendRes, topicsRes, improvementRes] =
          await Promise.all([
            progressApi.getOverall(),
            progressApi.getScoreTrend(),
            progressApi.getTopics(),
            progressApi.getImprovement(),
          ]);

        if (overallRes.success && overallRes.data) setOverall(overallRes.data);
        else toast({ title: 'Error', description: overallRes.error?.message });

        if (trendRes.success && trendRes.data) setScoreTrend(trendRes.data);
        else toast({ title: 'Error', description: trendRes.error?.message });

        if (topicsRes.success && topicsRes.data) setTopics(topicsRes.data);
        else toast({ title: 'Error', description: topicsRes.error?.message });

        if (improvementRes.success && improvementRes.data) setImprovements(improvementRes.data);
        else toast({ title: 'Error', description: improvementRes.error?.message });
      } catch (err) {
        setError('Failed to load progress data');
        toast({ title: 'Error', description: 'Please try again later' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { overall, scoreTrend, topics, improvements, loading, error };
}

// === MAIN COMPONENT ===
export default function Progress() {
  const { overall, scoreTrend, topics, improvements, loading, error } =
    useProgressDashboard();

  // Fallback UI
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-8 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and improvement over time
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {overall?.averageScore != null
                  ? `${Math.round(overall.averageScore)}%`
                  : 'N/A'}
              </div>
              <TrendingUp className="w-8 h-8 text-green-500/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {overall?.completionRate != null
                ? `${overall.completionRate.toFixed(0)}% lessons completed`
                : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quizzes Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {overall?.completedLessons ?? 0}
              </div>
              <Target className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Topics in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{topics.length}</div>
              <BookOpen className="w-8 h-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
          <CardDescription>Your average score over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Topic Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Progress</CardTitle>
          <CardDescription>Lessons completed by topic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.topicName}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">
                  {topic.topicName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {topic.completed}/{topic.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${topic.progressPercent}%` }}
                />
              </div>
            </div>
          ))}
          {topics.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No topic data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Weak Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
          <CardDescription>
            Topics where you need more practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {improvements.length > 0 ? (
              improvements.map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">
                      {item.topicName}
                    </p>
                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                      {item.achievedPercent.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Great job! No major weak areas detected.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}