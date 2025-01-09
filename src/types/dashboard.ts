export interface Task {
    id: string;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    completed: boolean;
    link: string;
}

interface TopicProgress {
    topic: string;
    completed: number;
    total: number;
}

export interface Stats {
    totalSolved: number;
    currentStreak: number;
    averageTime: number;
    topicsProgress: Record<string, TopicProgress>;
    challengeStartDate?: string;
}

export interface ComparisonStatsType {
    userStats: any;
    globalStats: any;
}

export interface SolutionData {
    timeSpent: number;
    userDifficulty: number;
    solution?: string;
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    solvedCount: number;
    averageTime: number;
}

export interface ComparisonEntry {
    userStats: UserStats;
    globalStats: GlobalStats;
}

export interface UserStats {
    difficultyDistribution: Record<number, number>;
    timeHistory: TimeHistory[];
    fastSolutions: number;
    avgDifficulty: number;
    avgTimeSpent: number;

}

export interface GlobalStats {
    avgTimeSpent: number;
    avgDifficulty: number;
}

export interface TimeHistory {
    day: number;
    userTime: number;
    avgTime: number;
}

export type CardColor = 'blue' | 'green' | 'purple' | 'cyan';

export interface ParticipantProgress {
    participantName: string;
    dailyProgress: Array<{ date: string; solvedCount: number }>;
    solutionsByDifficulty: Record<string, number>;
}

export interface Solution {
    id: number;
    taskName: string;
    difficulty: string;
    completedAt: string;
    timeSpent: number;
    solution: string;
}

export interface ParticipantSolutions {
    participantId: number;
    participantName: string;
    solutions: Solution[];
}

export interface DataPoint {
    date: string;
    [participantName: string]: number | string;
}

export interface AccumulatedCounts {
    [participantName: string]: number;
}

