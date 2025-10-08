import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
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
      const response = await authService.signup({
        fullName: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || "Signup successful. Redirecting to login..."
        });

        setTimeout(() => navigate('/login'), 1000);
      } else {
        setMessage({
          type: 'error',
          text: response.error?.general || response.message || "Signup failed. Please try again."
        });
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setMessage({ type: 'error', text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-indigo-100 via-pink-100 to-yellow-100">
      
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center md:h-screen h-48 overflow-hidden">
        <img
          src="../public/side.png"
          alt="Signup Illustration"
          className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-xl transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-4 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white/50 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-xs md:max-w-sm space-y-4 relative"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 text-center">
            Create Account
          </h2>

          {/* Backend message */}
          {message.text && (
            <p className={`text-center ${message.type === "success" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}`}>
              {message.text}
            </p>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:outline-none transition bg-white/70 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:outline-none transition bg-white/70 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:outline-none transition bg-white/70 text-black"
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
              className="w-full p-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:outline-none transition bg-white/70 text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-700 text-white py-2 rounded-xl font-semibold hover:bg-indigo-800 transition flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-500 text-sm md:text-base">
            Already have an account?{' '}
            <span
              className="text-indigo-700 font-bold cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
