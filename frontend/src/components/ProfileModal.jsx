import React, { useState, useEffect } from 'react';
import { authService } from '../api/auth';

const ProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const [mode, setMode] = useState('view');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Reset mode when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setMode('view'), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------------------- VIEW PROFILE ----------------------
  const ViewProfile = () => (
    <>
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/50">
          <span className="text-4xl text-white font-bold">
            {user?.fullName?.charAt(0) || 'U'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-purple-800">
          {user?.fullName || 'Unnamed User'}
        </h2>
        <p className="text-gray-600">@{user?.username || 'username'}</p>
        <p className="text-gray-600 mt-1">{user?.email || 'email@example.com'}</p>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={() => setMode('password')}
          className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200"
        >
          Update Password
        </button>
        <button
          onClick={() => setMode('edit')}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
        >
          Edit Profile
        </button>
      </div>
    </>
  );

  // ---------------------- EDIT PROFILE ----------------------
  const EditProfileForm = () => {
    const [formData, setFormData] = useState({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });

    const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        const token = localStorage.getItem('accessToken');
        const response = await authService.updateUserProfile({
          fullName: formData.fullName,
          email: formData.email,
          token,
        });
        if (response.success) {
          setUser({
            ...user,
            fullName: formData.fullName,
            email: formData.email,
          });
          setMessage({ type: 'success', text: response.message });
          onClose();
        } else {
          console.log(response.error?.general || response.message);
          setMessage({ type: 'error', text: response.error?.general || response.message });
        }
      } catch (err) {
        console.error('Unexpected API error:', err);
        setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          Edit Profile
        </h2>
        {message.text && (
          <p
            className={`text-center ${
              message.type === 'success' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
            }`}
          >
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 mb-1 font-semibold">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1 font-semibold">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setMode('view')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </>
    );
  };

  // ---------------------- UPDATE PASSWORD ----------------------
  const UpdatePasswordForm = () => {
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
      setPasswords({ ...passwords, [e.target.name]: e.target.value });
      if (error) setError('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setPasswordMessage({ type: '', text: '' });

      if (passwords.newPass !== passwords.confirm) {
        setError("New passwords don't match!");
        setLoading(false);
        return;
      }
      if (!passwords.newPass) {
        setError('New password cannot be empty.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');
        const response = await authService.updateUserPassword({
          oldPassowrd: passwords.current,
          newPassword: passwords.newPass,
          token,
        });
        if (response.success) {
          setPasswordMessage({ type: 'success', text: response.message });
          onClose();
        } else {
          console.log(response.error?.general || response.message);
          setPasswordMessage({ type: 'error', text: response.error?.general || response.message });
        }
      } catch (err) {
        console.error('Unexpected API error:', err);
        setPasswordMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Update Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="current" className="block text-gray-700 mb-1 font-semibold">
              Current Password
            </label>
            <input
              id="current"
              type="password"
              name="current"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
            />
          </div>
          <div>
            <label htmlFor="newPass" className="block text-gray-700 mb-1 font-semibold">
              New Password
            </label>
            <input
              id="newPass"
              type="password"
              name="newPass"
              placeholder="Enter new password"
              value={passwords.newPass}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-gray-700 mb-1 font-semibold">
              Confirm New Password
            </label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70"
            />
          </div>

          {passwordMessage.text && (
            <p
              className={`text-center ${
                passwordMessage.type === 'success'
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'
              }`}
            >
              {passwordMessage.text}
            </p>
          )}
          {error && <p className="text-red-500 text-sm text-center font-semibold pt-1">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setMode('view')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
        <div className="flex justify-end -mb-4 -mr-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200/50 transition"
          >
            &times;
          </button>
        </div>
        {mode === 'view' && <ViewProfile />}
        {mode === 'edit' && <EditProfileForm />}
        {mode === 'password' && <UpdatePasswordForm />}
      </div>
    </div>
  );
};

export default ProfileModal;
