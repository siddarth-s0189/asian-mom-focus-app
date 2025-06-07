
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, User, Calendar, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import Navbar from "@/components/Navbar";

interface SessionData {
  id: string;
  userId: string;
  sessionTitle: string;
  goal: string;
  duration: number; // in minutes
  timeSpent: number; // in seconds
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [studyStats, setStudyStats] = useState({
    totalHours: 0,
    sessionsCompleted: 0,
    currentStreak: 0,
    dailyData: [],
    weeklyData: [],
    monthlyData: []
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const calculateRealStats = () => {
      // Get user sessions from localStorage
      const userSessions: SessionData[] = JSON.parse(localStorage.getItem('userSessions') || '[]')
        .filter((session: SessionData) => session.userId === user.id);

      // Calculate total hours (from all sessions including incomplete ones)
      const totalSeconds = userSessions.reduce((sum, session) => sum + session.timeSpent, 0);
      const totalHours = totalSeconds / 3600;

      // Calculate sessions completed (only completed sessions)
      const completedSessions = userSessions.filter(session => session.completed);
      const sessionsCompleted = completedSessions.length;

      // Calculate current streak (consecutive days with completed sessions)
      const currentStreak = calculateCurrentStreak(completedSessions);

      // Generate daily data for the last 7 days
      const dailyData = generateDailyData(userSessions);

      // Generate weekly data for the last 4 weeks
      const weeklyData = generateWeeklyData(userSessions);

      // Generate monthly data for the last 6 months
      const monthlyData = generateMonthlyData(userSessions);

      setStudyStats({
        totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
        sessionsCompleted,
        currentStreak,
        dailyData,
        weeklyData,
        monthlyData
      });
    };

    calculateRealStats();
  }, [user]);

  const calculateCurrentStreak = (completedSessions: SessionData[]) => {
    if (completedSessions.length === 0) return 0;

    // Group sessions by date
    const sessionsByDate = new Map<string, SessionData[]>();
    completedSessions.forEach(session => {
      const date = new Date(session.completedAt!).toDateString();
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Get unique dates with sessions and sort them
    const datesWithSessions = Array.from(sessionsByDate.keys())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (datesWithSessions.length === 0) return 0;

    // Calculate streak from today backwards
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // Start checking from today or yesterday
    let currentDate = sessionsByDate.has(today) ? today : 
                     sessionsByDate.has(yesterday) ? yesterday : null;

    if (!currentDate) return 0;

    // Count consecutive days
    for (let i = 0; i < datesWithSessions.length; i++) {
      if (datesWithSessions[i] === currentDate) {
        streak++;
        // Move to the previous day
        const prevDay = new Date(new Date(currentDate).getTime() - 24 * 60 * 60 * 1000);
        currentDate = prevDay.toDateString();
      } else {
        break;
      }
    }

    return streak;
  };

  const generateDailyData = (sessions: SessionData[]) => {
    const dailyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dailySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startedAt).toDateString();
        return sessionDate === dateString;
      });

      const hours = dailySessions.reduce((sum, session) => sum + (session.timeSpent / 3600), 0);
      const completedSessionsCount = dailySessions.filter(s => s.completed).length;

      dailyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: Math.round(hours * 10) / 10,
        sessions: completedSessionsCount
      });
    }

    return dailyData;
  };

  const generateWeeklyData = (sessions: SessionData[]) => {
    const weeklyData = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weeklySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startedAt);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      const hours = weeklySessions.reduce((sum, session) => sum + (session.timeSpent / 3600), 0);
      const completedSessionsCount = weeklySessions.filter(s => s.completed).length;

      weeklyData.push({
        week: `Week ${4 - i}`,
        hours: Math.round(hours * 10) / 10,
        sessions: completedSessionsCount
      });
    }

    return weeklyData;
  };

  const generateMonthlyData = (sessions: SessionData[]) => {
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthlySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startedAt);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const hours = monthlySessions.reduce((sum, session) => sum + (session.timeSpent / 3600), 0);
      const completedSessionsCount = monthlySessions.filter(s => s.completed).length;

      monthlyData.push({
        month: months[monthDate.getMonth()],
        hours: Math.round(hours * 10) / 10,
        sessions: completedSessionsCount
      });
    }

    return monthlyData;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const chartConfig = {
    hours: {
      label: "Hours",
      color: "#ef4444",
    },
    sessions: {
      label: "Sessions",
      color: "#f97316",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50 flex items-center justify-center shadow-xl shadow-red-500/30">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
              Profile
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track your study progress and achievements
            </p>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="text-white">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <div className="text-white">{user.user_metadata?.full_name || 'Not provided'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
                  <div className="text-white">{new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Study Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Total Hours</label>
                  <div className="text-2xl font-bold text-red-400">{studyStats.totalHours}h</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sessions Completed</label>
                  <div className="text-2xl font-bold text-orange-400">{studyStats.sessionsCompleted}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Current Streak</label>
                  <div className="text-2xl font-bold text-green-400">{studyStats.currentStreak} days</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Hours Studied</label>
                  <div className="text-2xl font-bold text-blue-400">
                    {studyStats.dailyData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sessions</label>
                  <div className="text-2xl font-bold text-purple-400">
                    {studyStats.dailyData.reduce((sum, day) => sum + day.sessions, 0)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Daily Average</label>
                  <div className="text-2xl font-bold text-cyan-400">
                    {(studyStats.dailyData.reduce((sum, day) => sum + day.hours, 0) / 7).toFixed(1)}h
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="space-y-8">
            {/* Daily Stats */}
            <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Daily Study Hours (Last 7 Days)</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your daily study patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={studyStats.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Weekly Progress (Last 4 Weeks)</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor your weekly study consistency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={studyStats.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={3} dot={{ fill: "var(--color-hours)", strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <Card className="bg-gray-900/80 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Monthly Overview (Last 6 Months)</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Long-term study trends and growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={studyStats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
