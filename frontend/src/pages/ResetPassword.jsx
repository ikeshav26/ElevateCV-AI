import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [timer, setTimer] = useState(120)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [canResendOtp, setCanResendOtp] = useState(true)
  const [otpSent, setOtpSent] = useState(false)

  const [loadingSendOtp, setLoadingSendOtp] = useState(false)
  const [loadingReset, setLoadingReset] = useState(false)

  const { navigate } = useContext(AppContext)

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setCanResendOtp(true);
      toast.error("OTP has expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setLoadingSendOtp(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/send-otp`,
        { email },
        { withCredentials: true }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("OTP has been sent to your email.");
        setTimer(120);
        setIsTimerActive(true);
        setCanResendOtp(false);
        setOtpSent(true);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoadingReset(true);
    try {
      const formData = { email, newPassword, otp };
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/verify-otp`,
        formData,
        { withCredentials: true }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error("Error resetting password:", error);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-base-100)] px-4 py-8">
      <div className="w-full max-w-5xl bg-[var(--color-base-200)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.01] transition-transform duration-300">
        <div className="hidden md:block md:w-1/2 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-dark)] relative">
          <img
            src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop&crop=center"
            alt="Security and password reset illustration"
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Secure Password Reset</h3>
            <p className="text-lg opacity-90">Your account security is our priority</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
          <Link
            to="/login"
            className="absolute top-4 left-4 text-[var(--color-primary)] font-medium hover:underline select-none transition-all duration-200 hover:scale-105 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-content)] select-none">
              Reset Your Password
            </h2>
            <p className="text-[var(--color-base-content)] opacity-70 mt-2">
              Enter your email, OTP, and new password to reset your account
            </p>
          </div>

          {isTimerActive && otpSent && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">OTP Active</span>
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatTimer(timer)}
                </div>
              </div>
              <p className="text-sm text-[var(--color-base-content)] leading-relaxed mt-2">
                Your OTP will expire in {formatTimer(timer)}. Please complete the password reset before it expires.
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleResetPassword}>
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
                    disabled={loadingSendOtp || loadingReset}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-[var(--color-base-content)] select-none"
                  >
                    OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResendOtp || loadingSendOtp || loadingReset}
                    className={`text-sm font-medium transition-all duration-200 ${
                      canResendOtp && !loadingSendOtp && !loadingReset
                        ? 'text-[var(--color-primary)] hover:underline cursor-pointer'
                        : 'text-[var(--color-base-content)] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {loadingSendOtp
                      ? "Sending..."
                      : canResendOtp
                      ? (otpSent ? 'Resend OTP' : 'Send OTP')
                      : `Resend in ${formatTimer(timer)}`}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
                    disabled={loadingSendOtp || loadingReset}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-2 text-[var(--color-base-content)] select-none"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
                    minLength="6"
                    disabled={loadingReset}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loadingReset}
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2 text-[var(--color-base-content)] select-none"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
                    minLength="6"
                    disabled={loadingReset}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-all duration-200 hover:scale-110"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loadingReset}
                  >
                    {showConfirmPassword ? (
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

            <button
              type="submit"
              disabled={loadingReset || loadingSendOtp}
              className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                loadingReset || loadingSendOtp
                  ? 'bg-[var(--color-primary-light)] cursor-not-allowed'
                  : 'bg-[var(--color-primary)] hover:scale-102'
              }`}
            >
              {loadingReset ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
