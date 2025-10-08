import React, { useState, useEffect, useMemo } from 'react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import ProfileModal from '../components/ProfileModal';
import PerformanceCircle from '../components/PerformanceCircle';
import UserIcon from '../components/icons/UserIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import PlusIcon from '../components/icons/PlusIcon';
import { taskService } from '../api/task';
import { authService } from '../api/auth';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState({ fullName: 'User', username: 'user', email: 'user@example.com' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const getToken = () => localStorage.getItem('accessToken');

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const token = getToken();
            const response = await taskService.getTasks({ token });
            if (response.success) setTasks(response.data);
            else console.error('Fetch Tasks Error:', response.error?.general || response.message);
        } catch (err) {
            console.error('Unexpected fetchTasks error:', err);
        }
    };

    // Fetch current user
    const getCurrentUser = async () => {
        try {
            const token = getToken();
            const response = await authService.getCurrentUser({ token });
            if (response.success) setCurrentUser(response.data);
            else console.error('Fetch User Error:', response.error?.general || response.message);
        } catch (err) {
            console.error('Unexpected fetchUser error:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
        getCurrentUser();
    }, []);

    const handleAddTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        setLoadingAction(true);
        try {
            const token = getToken();
            const response = await taskService.deleteTask({ id: taskId, token });
            if (response.success) {
                setTasks(tasks.filter(task => task._id !== taskId));
            } else {
                console.error('Delete Task Error:', response.error?.general || response.message);
                alert(response.error?.general || response.message || 'Failed to delete task');
            }
        } catch (err) {
            console.error('Unexpected deleteTask error:', err);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleToggleComplete = async (taskId) => {
        setLoadingAction(true);
        try {
            const token = getToken();
            const response = await taskService.toggleCompleteTask({ id: taskId, token });
            if (response.success) {
                setTasks(tasks.map(task => task._id === taskId ? { ...task, completed: !task.completed } : task));
            } else {
                console.error('Toggle Complete Error:', response.error?.general || response.message);
                alert(response.error?.general || response.message || 'Failed to update task');
            }
        } catch (err) {
            console.error('Unexpected toggleComplete error:', err);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleSaveTask = async (taskData) => {
        setLoadingAction(true);
        try {
            const token = getToken();
            let response;

            if (taskData._id) {
                response = await taskService.updateTask({ ...taskData, token, id: taskData._id });
                if (response.success) {
                    setTasks(tasks.map(task => task._id === taskData._id ? response.data : task));
                    return { success: true };
                }
            } else {
                response = await taskService.createTask({ ...taskData, token });
                if (response.success) {
                    setTasks([...tasks, response.data]);
                    return { success: true };
                }
            }

            console.error('Save Task Error:', response.error?.general || response.message);
            return { success: false, error: response.error?.general || response.message };
        } catch (err) {
            console.error('Unexpected saveTask error:', err);
            return { success: false, error: err.message || 'Something went wrong' };
        } finally {
            setLoadingAction(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        window.location.reload();
    };

    const filteredTasks = useMemo(() => tasks.filter(task =>
        (task?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         task?.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (priorityFilter === 'All' || task?.priority === priorityFilter)
    ), [tasks, searchTerm, priorityFilter]);

    const pendingTasks = useMemo(() => filteredTasks.filter(task => !task?.completed), [filteredTasks]);
    const completedTasks = useMemo(() => filteredTasks.filter(task => task?.completed), [filteredTasks]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans text-gray-800">
            <header className="bg-white/30 backdrop-blur-lg p-4 shadow-sm flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-800">Task Manager</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center space-x-2 text-purple-800 font-semibold hover:text-purple-900 transition-colors p-2 rounded-lg hover:bg-white/50">
                        <UserIcon />
                        <span className="hidden sm:block">Welcome, {currentUser?.fullName?.split(' ')[0]}!</span>
                    </button>
                    <button onClick={handleLogout} className="text-purple-700 hover:text-purple-900 transition-colors" aria-label="Logout">
                        <LogoutIcon />
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-8">
                {/* Performance & Add Task */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
                    <div className="w-full md:w-auto"><PerformanceCircle tasks={tasks} /></div>
                    <div className="flex-1 bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-lg flex flex-col justify-center items-center md:items-start">
                        <h2 className="text-2xl font-bold text-purple-800">Stay Organized, Be Productive.</h2>
                        <p className="text-gray-600 mt-2 mb-4 text-center md:text-left">Ready to tackle your day? Add a new task to get started.</p>
                        <button
                            onClick={handleAddTask}
                            className="flex items-center gap-2 bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            disabled={loadingAction}
                        >
                            <PlusIcon />Create New Task
                        </button>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 bg-white/40 backdrop-blur-lg p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 items-center">
                    <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 pl-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70" />
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full sm:w-48 p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70 appearance-none">
                        <option value="All">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                {/* Task Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-lg">
                        <h3 className="text-xl font-bold text-purple-800 mb-4">To-Do ({pendingTasks.length})</h3>
                        <div>
                            {pendingTasks.length > 0 ? pendingTasks.map(task => (
                                <TaskItem key={task._id} task={task} onToggle={handleToggleComplete} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                            )) : <p className="text-center text-gray-500 py-4">Nothing to do. All caught up!</p>}
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-lg">
                        <h3 className="text-xl font-bold text-purple-800 mb-4">Completed ({completedTasks.length})</h3>
                        <div>
                            {completedTasks.length > 0 ? completedTasks.map(task => (
                                <TaskItem key={task._id} task={task} onToggle={handleToggleComplete} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                            )) : <p className="text-center text-gray-500 py-4">No tasks completed yet.</p>}
                        </div>
                    </div>
                </div>
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={currentUser}
                setUser={setCurrentUser} // <--- pass setter
            />
        </div>
    );
}

export default Home;
