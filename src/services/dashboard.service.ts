import { api } from './api.service.ts';
import { ComparisonStatsType, Stats, Task, SolutionData } from '../types/dashboard';

export const dashboardService = {
    getTasks: () => api.get<Task[]>('/dashboard/tasks/today'),
    getStats: () => api.get<Stats>('/dashboard/stats'),
    getLeaderboard: () => api.get<any[]>('/dashboard/leaderboard'),
    getComparison: () => api.get<ComparisonStatsType>('/comparison/all'),
    submitSolution: (taskId: string, data: SolutionData) =>
        api.post<void>(`/dashboard/tasks/${taskId}/solution`, data)
};
