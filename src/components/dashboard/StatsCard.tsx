import React from "react";
import {CardColor} from "../../types/dashboard.ts";
import {Card, CardContent} from "../ui/card.tsx";

export const StatsCard = (props: {
    title: string;
    statsValue: number | string;
    icon: React.ReactNode;
    color: CardColor;
}) => {
    let {title, statsValue, icon, color} = props;
    const colorVariants = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        cyan: 'from-cyan-500 to-cyan-600'
    };

    return (
        <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-400">{title}</p>
                        <p className="text-2xl font-bold text-white mt-2">{statsValue}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colorVariants[color]} bg-opacity-10`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
