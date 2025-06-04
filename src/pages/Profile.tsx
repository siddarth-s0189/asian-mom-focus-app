
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, User, Calendar, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import Navbar from "@/components/Navbar";

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
    // Generate mock study statistics
    const generateMockData = () => {
      const dailyData = [];
      const weeklyData = [];
      const monthlyData = [];

      // Generate daily data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyData.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          hours: Math.random() * 8 + 1,
          sessions: Math.floor(Math.random() * 5) + 1
        });
      }

      // Generate weekly data for the last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        weeklyData.push({
          week: `Week ${4 - i}`,
          hours: Math.random() * 40 + 20,
          sessions: Math.floor(Math.random() * 25) + 10
        });
      }

      // Generate monthly data for the last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      for (let i = 0; i < 6; i++) {
        monthlyData.push({
          month: months[i],
          hours: Math.random() * 120 + 80,
          sessions: Math.floor(Math.random() * 80) + 40
        });
      }

      setStudyStats({
        totalHours: 234.5,
        sessionsCompleted: 87,
        currentStreak: 5,
        dailyData,
        weeklyData,
        monthlyData
      });
    };

    generateMockData();
  }, []);

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
