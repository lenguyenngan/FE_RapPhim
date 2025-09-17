import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import AnimatedSuccessNotification from '../../components/AnimatedSuccessNotification';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Vui lòng nhập email hợp lệ');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    if (!/^[0-9]{9,12}$/.test(formData.phone)) {
      setError('Số điện thoại phải có từ 9-12 chữ số');
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/auth/register', formData);
      
      // Hiển thị thông báo thành công
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setShowSuccess(true);
      console.log('Register successful:', response.data.message);
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('Register error:', err);
      
      // Xử lý các loại lỗi khác nhau
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || !err.response) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra: 1) Server đã chạy trên port 5000, 2) CORS đã được cấu hình');
      } else if (err.response?.status === 400) {
        if (err.response.data.message === 'Email already exists') {
          setError('Email này đã được sử dụng. Vui lòng chọn email khác');
        } else if (err.response.data.message === 'Phone number already exists') {
          setError('Số điện thoại này đã được sử dụng. Vui lòng chọn số khác');
        } else {
          setError(err.response.data.message);
        }
      } else if (err.response?.status === 500) {
        setError('Lỗi máy chủ. Vui lòng thử lại sau');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Đăng ký thất bại: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Open Google OAuth popup
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&response_type=code&scope=email profile`;
    window.open(googleAuthUrl, 'googleAuth', 'width=500,height=600,scrollbars=yes,resizable=yes');
  };

  const handleFacebookLogin = () => {
    // Open Facebook OAuth popup
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/facebook/callback')}&response_type=code&scope=email`;
    window.open(facebookAuthUrl, 'facebookAuth', 'width=500,height=600,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Meteors Effect */}
        <div className="meteors-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="meteor"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="animated-grid"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Marquee Text */}
        <div className="absolute top-10 left-0 w-full overflow-hidden">
          <div className="marquee-text">
            <span>🎬 CINEMA MANAGEMENT SYSTEM 🎬</span>
            <span>🎬 CINEMA MANAGEMENT SYSTEM 🎬</span>
            <span>🎬 CINEMA MANAGEMENT SYSTEM 🎬</span>
            <span>🎬 CINEMA MANAGEMENT SYSTEM 🎬</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className={`blur-fade-in bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                    CINEMA
                  </span>
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
              </div>
              
              <p className="text-gray-300 text-lg">
                Tạo tài khoản quản lý rạp phim
              </p>
            </div>

            {/* Animated Success Notification */}
            {showSuccess && (
              <AnimatedSuccessNotification
                message={success}
                onClose={() => setShowSuccess(false)}
                duration={3000}
              />
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center animate-shake">
                {error}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-4 mb-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.02] group"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng ký với Google
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.02] group"
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Đăng ký với Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">hoặc</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div className="relative group">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder="Họ và tên"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder="Email của bạn"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              {/* Phone Input */}
              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder="Số điện thoại"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder="Mật khẩu"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="shimmer-button w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Đang đăng ký...
                  </div>
                ) : (
                  'ĐĂNG KÝ'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Đã có tài khoản?{' '}
                <Link 
                  to="/login" 
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
