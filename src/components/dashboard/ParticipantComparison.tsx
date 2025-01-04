import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {api} from "../../services/api.service.ts"; //++
import {DataPoint, ParticipantProgress} from "../../types/dashboard.ts";

const ParticipantComparison = () => {
    const [comparisonData, setComparisonData] = useState<ParticipantProgress[]>([]);

    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                const data = await api.get<ParticipantProgress[]>('/comparison/participants');//++
                setComparisonData(data);
            } catch (error) {
                console.error('Error fetching comparison data:', error);
            }
        };
        void fetchComparisonData();
    }, []);


    const prepareChartData = () => {
        const runningTotals = new Map(comparisonData.map(p => [p.participantName, 0]));

        return comparisonData[0]?.dailyProgress.map(day => {
            const dataPoint: DataPoint = {
                date: day.date,
            };
            comparisonData.forEach(participant => {
                const dayData = participant.dailyProgress.find(d => d.date === day.date);
                const dailyCount = dayData?.solvedCount || 0;
                const currentTotal = (runningTotals.get(participant.participantName) ?? 0) + dailyCount;
                runningTotals.set(participant.participantName, currentTotal);
                dataPoint[participant.participantName] = currentTotal;
            });

            return dataPoint;
        });

    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Participant Comparison</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepareChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                            <XAxis
                                dataKey={'date'}
                                stroke="#9CA3AF"
                            />
                            <YAxis stroke="#9CA3AF"/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    color: '#fff'
                                }}
                            />
                            <Legend/>
                            {comparisonData.map((participant, index) => (
                                <Line
                                    key={participant.participantName}
                                    type="monotone"
                                    dataKey={participant.participantName}
                                    stroke={`hsl(${index * 50}, 70%, 50%)`}
                                    strokeWidth={2}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export {ParticipantComparison};