import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {LeaderboardCard} from "../components/dashboard/Leaderboard.tsx";
import {DashboardHeader} from "../components/dashboard/DashboardHeader.tsx";
import {ParticipantComparison} from "../components/dashboard/ParticipantComparison.tsx";
import {ComparisonEntry, LeaderboardEntry, Stats, Task} from "../types/dashboard.ts";
import {BrainIcon, CalendarIcon, ClockIcon, LogOutIcon, TrophyIcon} from "lucide-react";
import {TaskCard} from "../components/dashboard/TaskCard.tsx";
import {StatsCard} from "../components/dashboard/StatsCard.tsx";
import {api} from "../services/api.service.ts"; //++
import {ComparisonStats} from "../components/dashboard/ComparisonStats.tsx";
import {SolutionsExplorer} from "../components/dashboard/SolutionsExplorer.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const Dashboard = () => {
        const startDate = new Date('January 15, 2025');
        const {logout, user} = useAuth();
        const [loading, setLoading] = useState(true);
        const [tasks, setTasks] = useState<Task[]>([]);
        const [stats, setStats] = useState<Stats>({
            totalSolved: 0,
            currentStreak: 0,
            averageTime: 0,
            topicsProgress: {}
        });
        const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
        const [comparisonStats, setComparisonStats] = useState<ComparisonEntry>(
            {
                userStats: {
                    difficultyDistribution: {},
                    timeHistory: [],
                    fastSolutions: 0,
                    avgDifficulty: 0,
                    avgTimeSpent: 0
                },
                globalStats: {
                    avgTimeSpent: 0,
                    avgDifficulty: 0,
                }
            }
        );

        useEffect(() => {
            void fetchDashboardData();
        }, []);

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [tasks, stats, leaderboard, comparison] = await Promise.all([
                    api.get<Task[]>('/dashboard/tasks/today'),
                    api.get<Stats>('/dashboard/stats'),
                    api.get<LeaderboardEntry[]>('/dashboard/leaderboard'),
                    api.get<ComparisonEntry>('/comparison/all')
                ]);

                setTasks(tasks);
                setStats(stats);
                setLeaderboard(leaderboard);
                setComparisonStats(comparison);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
            return Promise.resolve();
        };
        if (loading) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-900">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading your progress...</p>
                    </div>
                </div>
            );
        }

        const handleLogout = () => {
            logout();
            window.location.href = '/login';
        };
console.log("1993",user)

        return (
            <div className="min-h-screen bg-gray-900">
                <nav className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                            <span
                                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                                Algorithm Tracker
                            </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    <LogOutIcon className="h-5 w-5 mr-2"/>
                                    Logout
                                </button>
                                {user?.claims.name ? (
                                        <p className="text-gray-300">{user.claims.name}</p>
                                    ) : (
                                        <div
                                            className="h-8 w-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-gray-300">
                                            {user?.subject}
                                        </div>
                                    )}
                                {user?.claims.picture ? (
                                    <img
                                        src={user.claims.picture}
                                        alt={user.claims.name}
                                        className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
                                    />
                                ) : (
                                    <div
                                        className="h-8 w-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-gray-300">
                                        {user?.claims.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>


                <main className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header section */}
                    <DashboardHeader startDate={startDate}/>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Problems Solved"
                            statsValue={stats.totalSolved}
                            icon={<TrophyIcon/>}
                            color="blue"
                        />
                        <StatsCard
                            title="Current Streak"
                            statsValue={stats.currentStreak}
                            icon={<CalendarIcon/>}
                            color="green"
                        />
                        <StatsCard
                            title="Avg. Time"
                            statsValue={`${(stats.averageTime).toFixed(0)}m`}
                            icon={<ClockIcon/>}
                            color="purple"
                        />
                        <StatsCard
                            title="Topics"
                            statsValue={Object.keys(stats.topicsProgress).length}
                            icon={<BrainIcon/>}
                            color="cyan"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tasks Section */}
                        <div className="lg:col-span-2">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Today's Problems</CardTitle>
                                    <p className="text-gray-400 text-sm">Complete these problems to maintain your
                                        streak</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {tasks.map((task: Task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Topics Progress */}
                        <div>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Topics Progress</CardTitle>
                                    <p className="text-gray-400 text-sm">Your learning coverage</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {Object.values(stats.topicsProgress).map((progress) => (
                                            <div key={progress.topic}>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-300">{progress.topic}</span>
                                                    <span
                                                        className="text-gray-400">{progress.completed}/{progress.total} problems</span>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                                        style={{width: `${(progress.completed / progress.total) * 100}%`}}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LeaderboardCard leaderboards={leaderboard}/>
                        {comparisonStats.userStats && (
                            <ComparisonStats
                                userStats={comparisonStats.userStats}
                                globalStats={comparisonStats.globalStats}
                            />
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6">
                        <ParticipantComparison/>
                        <SolutionsExplorer/>
                    </div>

                </main>

            </div>
        );
    }
;


export default Dashboard;