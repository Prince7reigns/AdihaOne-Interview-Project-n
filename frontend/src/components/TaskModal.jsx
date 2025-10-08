import React, { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Populate formData if editing
        setFormData(task ? {
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 'medium',
            dueDate: task.dueDate || ''
        } : { title: '', description: '', priority: 'medium', dueDate: '' });

        setErrorMessage(''); // Reset errors on open/close
    }, [task, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            if (onSave) {
                const result = await onSave({ ...task, ...formData });
                // onSave should return { success, error }
                if (!result?.success) {
                    // Keep modal open and show backend error
                    setErrorMessage(result?.error || 'Something went wrong. Please try again.');
                } else {
                    // Success closes modal
                    if (onClose) onClose();
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">
                    {task ? 'Edit Task' : 'Create New Task'}
                </h2>

                {errorMessage && (
                    <div className="mb-4 text-red-600 font-semibold text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
                            rows="3"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1 font-semibold">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1 font-semibold">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-xl font-semibold transition ${
                                loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800 text-white'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
