import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {LeaderboardEntry} from "../../types/dashboard.ts";

export const LeaderboardCard = (props: { leaderboards: LeaderboardEntry[] }) => {
    let {leaderboards} = props;
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Leaderboard</CardTitle>
                <p className="text-gray-400 text-sm">Top performers this month</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {leaderboards.map((participant, index) => (
                        <div
                            key={participant.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    index < 3 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gray-700'
                                }`}>
                                    <span className="text-white font-medium">#{index + 1}</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">{participant.name}</p>
                                    <p className="text-sm text-gray-400">{participant.solvedCount} solved</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-medium">{participant.averageTime}m</p>
                                <p className="text-sm text-gray-400">avg. time</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
