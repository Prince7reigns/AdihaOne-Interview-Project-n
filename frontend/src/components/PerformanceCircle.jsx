
import React, { useMemo } from 'react';

const PerformanceCircle = ({ tasks }) => {
    const completedTasks = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
    const totalTasks = tasks.length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-800 mb-4">Your Performance</h3>
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle className="text-purple-200" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                    <circle className="text-purple-600" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 60 60)" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-purple-800">{percentage}%</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{completedTasks} of {totalTasks} tasks completed</p>
        </div>
    );
};
export default PerformanceCircle;
