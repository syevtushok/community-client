import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {CustomTooltip} from "../ui/CustomTooltip.tsx";
import {Legend, Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis} from "recharts";
import {Component} from "react";
import {GlobalStats, UserStats} from "../../types/dashboard.ts";

export class ComparisonStats extends Component<{ userStats: UserStats, globalStats: GlobalStats }> {
    render() {
        let {userStats, globalStats} = this.props;
        return (
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Performance Analysis</CardTitle>
                    <p className="text-gray-400 text-sm">How you compare to other participants</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Key Performance Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                <CustomTooltip
                                    content="Average time taken to solve problems. Lower times generally indicate better understanding and problem-solving efficiency.">
                                    <p className="text-gray-400 text-sm">Avg. Solution Time</p>
                                </CustomTooltip>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {(userStats?.avgTimeSpent || 0).toFixed(1)}m
                                </p>
                                <p className="text-xs text-gray-400 mt-1">vs
                                    global {(globalStats?.avgTimeSpent || 0).toFixed(1)}m
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                <CustomTooltip content="Your average rating of problem difficulty compared to others">
                                    <p className="text-gray-400 text-sm">Perceived Difficulty</p>
                                </CustomTooltip>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {(userStats?.avgDifficulty || 0).toFixed(1)}/5
                                </p>
                                <p className="text-xs text-gray-400 mt-1">vs
                                    global {(globalStats?.avgDifficulty || 0).toFixed(1)}/5
                                </p>
                            </div>
                        </div>

                        {/* Time Analysis */}
                        <div>
                            <p className="text-white font-medium mb-4">Time Analysis</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <CustomTooltip
                                        content="Number of problems solved in under 30 minutes. Quick solutions often indicate strong problem-solving patterns.">
                                        <span className="text-gray-300">Fast Solutions (under 30m)</span>
                                    </CustomTooltip>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white font-medium">{userStats?.fastSolutions || 0}</span>
                                        <span className="text-sm text-gray-400">solutions</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <CustomTooltip
                                content="Your solution time trends compared to the global average. Shows how your speed changes over time.">
                                <p className="text-white font-medium mb-4">Solution Time Trend</p>
                            </CustomTooltip>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={userStats?.timeHistory || []}>
                                        <XAxis
                                            dataKey="day"
                                            stroke="#9CA3AF"
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            label={{
                                                value: 'Time (minutes)',
                                                angle: -90,
                                                position: 'insideLeft',
                                                style: {fill: '#9CA3AF'}
                                            }}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                color: '#fff'
                                            }}
                                        />
                                        <Legend/>
                                        <Line
                                            type="monotone"
                                            dataKey="userTime"
                                            name="Your Time"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{r: 4}}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avgTime"
                                            name="Global Average"
                                            stroke="#6B7280"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Difficulty Analysis */}
                        <div className="space-y-4">
                            <CustomTooltip
                                content="Distribution of how difficult you found problems (1-5). Shows your comfort level with different challenge levels.">
                                <p className="text-white font-medium">Difficulty Perception</p>
                            </CustomTooltip>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((level) => {
                                    const distribution = userStats?.difficultyDistribution || {};
                                    const percentage = (distribution[level] || 0) * 100;

                                    return (
                                        <div key={level} className="text-center">
                                            <div
                                                className="h-24 bg-gray-800/50 border border-gray-700 rounded-lg relative">
                                                <div
                                                    className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300 rounded-b-lg"
                                                    style={{
                                                        height: `${percentage}%`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-400 mt-2">Level {level}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
}
