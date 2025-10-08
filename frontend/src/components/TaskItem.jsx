import React from 'react';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import CalendarIcon from './icons/CalendarIcon';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
    if (!task) return null; // prevents crash if task is undefined

    const priorityClasses = {
        High: 'border-l-4 border-red-500 bg-red-50/80',
        Medium: 'border-l-4 border-yellow-500 bg-yellow-50/80',
        Low: 'border-l-4 border-green-500 bg-green-50/80',
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = task.dueDate && new Date(task.dueDate) < today && !task.completed;

    return (
        <div className={`p-4 rounded-xl shadow-md backdrop-blur-lg ${priorityClasses[task.priority] || ''} mb-4 flex flex-col`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() => onToggle && onToggle(task._id)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <div className="ml-4">
                        <h4 className={`font-bold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title || 'Untitled Task'}
                        </h4>
                        <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                            {task.description || 'No description'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                        onClick={() => onEdit && onEdit(task)}
                        className="text-gray-500 hover:text-purple-700 transition-colors"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => onDelete && onDelete(task?._id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
            {task.dueDate && (
                <div className="flex items-center mt-3 pt-2 border-t border-purple-100">
                    <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        <CalendarIcon />
                        <span>
                            {isOverdue ? 'Overdue: ' : 'Due: '}
                            {new Date(task.dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            )}
            {console.log(task)}
        </div>
    );
};

export default TaskItem;
