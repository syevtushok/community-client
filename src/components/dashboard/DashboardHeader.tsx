import {useMemo} from 'react';

export const DashboardHeader = (props: { startDate: Date }) => {
    let {startDate} = props;
    const calculateDayCount = useMemo(() => {
        // If startDate is a string, convert it to Date object
        const start = startDate;
        const today = new Date();

        // Reset hours to compare dates properly
        start.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        let dayCount = 0;
        let currentDate = new Date(start);

        // Count days excluding weekends
        while (currentDate <= today) {
            // getDay() returns 0 for Sunday and 6 for Saturday
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                dayCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dayCount;
    }, [startDate]);

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
                Day {calculateDayCount} of 100
            </h1>
            <p className="text-gray-400 mt-2">Track your daily algorithm practice</p>
        </div>
    );
};
