import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';

const LoginPage = () => {
  const navigate = useNavigate(); // <-- useNavigate hook
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.login({
        email: formData.usernameOrEmail,
        password: formData.password
      });

      if (!response.data?.accessToken) {
        throw new Error(response.data?.message || "Login failed, please try again");
      }

      // Save tokens and user ID
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userId', response.data?.user?.id || "");

      if (response.success) {
        setMessage({ type: 'success', text: response.message });

        // Navigate to home after login
        setTimeout(() => {
          navigate('/home');
        }, 500); // optional slight delay for UX
      } else {
        setMessage({ type: 'error', text: response.error?.general || 'Login failed' });
      }

    } catch (error) {
      console.error("Unexpected login error:", error);
      setMessage({ type: 'error', text: error.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:min-h-[600px] bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center md:h-auto h-48">
        <img
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
          alt="Login Illustration"
          className="h-full md:h-auto w-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-xl"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-4 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/40 backdrop-blur-lg p-6 md:p-12 rounded-3xl shadow-2xl w-full max-w-xs md:max-w-sm space-y-4 relative"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-700 text-center">
            Login
          </h2>

          {/* Message from backend */}
          {message.text && (
            <p className={`text-center ${message.type === "success" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}`}>
              {message.text}
            </p>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none transition bg-white/70 text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-700 cursor-p text-white py-2 rounded-xl font-semibold hover:bg-purple-800 transition flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-gray-500 text-sm md:text-base">
            Don't have an account?{' '}
            <span onClick={()=>navigate("/signup")} className="text-purple-700 font-bold cursor-pointer">Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
