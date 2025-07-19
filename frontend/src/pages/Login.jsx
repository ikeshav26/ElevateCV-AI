import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setuser, navigate } = useContext(AppContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = { email, password }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        formData,
        { withCredentials: true }
      )

      setuser(true)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success("Login successful!")
      navigate("/")
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("Login failed. Please check your credentials.")
        setEmail("")
        setPassword("")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/send-otp`,
        { email: resetEmail },
        { withCredentials: true }
      )
      if (res.status === 200 || res.status === 201) {
        toast.success("If this email exists, an OTP has been sent to reset your password.")
        navigate("/reset-password")
      }
    } catch {
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-base-100)] px-4 py-8">
      <div className="w-full max-w-5xl bg-[var(--color-base-200)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.01] transition-transform duration-300">
        <div className="hidden md:block md:w-1/2 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-dark)] relative">
          <img
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center"
            alt="Professional login illustration"
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
            <p className="text-lg opacity-90">Continue your AI-powered career journey</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
          <Link
            to="/"
            className="absolute top-4 left-4 text-[var(--color-primary)] font-medium hover:underline select-none transition-all duration-200 hover:scale-105 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-content)] select-none">
              {activeTab === 'login' ? 'Welcome Back' : 'Reset Password'}
            </h2>
            <p className="text-[var(--color-base-content)] opacity-70 mt-2">
              {activeTab === 'login' 
                ? 'Sign in to continue your AI career journey' 
                : 'Enter your email to receive an OTP for password reset'}
            </p>
          </div>

          <div className="flex mb-6 bg-[var(--color-base-300)] rounded-xl p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-content)] shadow-sm'
                  : 'text-[var(--color-base-content)] hover:bg-[var(--color-base-200)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('reset')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'reset'
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-content)] shadow-sm'
                  : 'text-[var(--color-base-content)] hover:bg-[var(--color-base-200)]'
              }`}
            >
              Reset Password
            </button>
          </div>

          {activeTab === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-[var(--color-base-content)] select-none"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2 text-[var(--color-base-content)] select-none"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-all duration-200 hover:scale-110"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L5.636 5.636m14.142 14.142L15.536 15.536m4.243-4.243a9.97 9.97 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243m4.243 4.243L8.464 8.464" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border focus:ring-2 focus:ring-offset-2 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-base-100)',
                      borderColor: 'var(--color-base-300)',
                      color: 'var(--color-primary)',
                      '--tw-ring-color': 'var(--color-primary)'
                    }}
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm cursor-pointer text-[var(--color-base-content)] opacity-70">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('reset')}
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors duration-200"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className={`w-full py-3 mt-6 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] font-semibold hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-primary-content)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                Sign In
              </button>
            </form>
          )}

          {activeTab === 'reset' && (
            <form className="space-y-6" onSubmit={handlePasswordReset}>
              <div>
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium mb-2 text-[var(--color-base-content)] select-none"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">How it works</span>
                </div>
                <p className="text-sm text-[var(--color-base-content)] leading-relaxed">
                  We'll send a One-Time Password (OTP) to your email address. Use this OTP to reset your password and regain access to your account.
                </p>
              </div>

              <button
                type="submit"
                className={`w-full py-3 mt-6 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] font-semibold hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-primary-content)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                Send OTP
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <p className="text-[var(--color-base-content)] opacity-70 select-none">
              {activeTab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-[var(--color-primary)] font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                  >
                    Sign up here
                  </Link>
                </>
              ) : (
                <>
                  Remember your password?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-[var(--color-primary)] font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                    disabled={loading}
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-[var(--color-base-300)]">
            <p className="text-xs text-[var(--color-base-content)] opacity-60 select-none">
              Secure login powered by ElevateCV AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login