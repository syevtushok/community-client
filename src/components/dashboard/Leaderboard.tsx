import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {LeaderboardEntry} from "../../types/dashboard.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {useState} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

export const LeaderboardCard = (props: { leaderboards: LeaderboardEntry[] }) => {
    const { leaderboards } = props;
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    const userIndex = leaderboards.findIndex(
        (entry) => entry.name === user?.claims.name
    );

    const getVisibleEntries = () => {
        if (isExpanded) return leaderboards;

        const visibleEntries = [];
        // Always show top 10
        visibleEntries.push(...leaderboards.slice(0, 10));

        // If user is beyond position 10 and not in visible entries, add them
        if (userIndex >= 10) {
            visibleEntries.push({
                id: 'separator',
                name: '...',
                solvedCount: -1,
                averageTime: -1
            });
            visibleEntries.push(leaderboards[userIndex]);
        }

        return visibleEntries;
    };

    const visibleEntries = getVisibleEntries();
    const hasMoreEntries = leaderboards.length > 10 && !isExpanded;

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Leaderboard</CardTitle>
                <p className="text-gray-400 text-sm">Top performers this month</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {visibleEntries.map((participant) => {
                        if (participant.id === 'separator') {
                            return (
                                <div key="separator" className="flex justify-center">
                                    <span className="text-gray-400 text-2xl">•••</span>
                                </div>
                            );
                        }

                        const isCurrentUser = participant.name === user?.claims.name;
                        const position = leaderboards.indexOf(participant) + 1;

                        return (
                            <div
                                key={participant.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                    isCurrentUser
                                        ? 'bg-gray-700/50 border-blue-500'
                                        : 'bg-gray-800/50 border-gray-700'
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            position <= 3
                                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                                : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className="text-white font-medium">#{position}</span>
                                    </div>
                                    <div>
                                        <p className={`font-medium ${
                                            isCurrentUser ? 'text-blue-400' : 'text-white'
                                        }`}>
                                            {participant.name}
                                            {isCurrentUser && " (You)"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {participant.solvedCount} solved
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-medium">
                                        {participant.averageTime}m
                                    </p>
                                    <p className="text-sm text-gray-400">avg. time</p>
                                </div>
                            </div>
                        );
                    })}

                    {hasMoreEntries && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-6 h-6" />
                            ) : (
                                <ChevronDown className="w-6 h-6" />
                            )}
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
