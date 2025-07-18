import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const Signup = () => {
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const {setuser,navigate}=useContext(AppContext)

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData={
      username,
      email,
      password
    }
    console.log(formData);
    const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, formData,
      {
        withCredentials: true
      }
    );
    if (res.status === 201 || res.status === 200) {
      setuser(res.data.user);
      toast.success("Signup successful! Please log in.");
      navigate("/");
    } else {
      toast.error("Signup failed. Please try again.");
      setusername("");
      setemail("");
      setpassword("");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-base-100)] px-4 py-8">
      <div className="w-full max-w-5xl bg-[var(--color-base-200)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.01] transition-transform duration-300">
        {/* Image Section - Hidden on small screens */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-dark)] relative">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center"
            alt="AI and technology illustration"
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Join ElevateCV AI</h3>
            <p className="text-lg opacity-90">Transform your career with AI-powered tools</p>
          </div>
        </div>

        {/* Form Section */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-content)] select-none">
              Create an Account
            </h2>
            <p className="text-[var(--color-base-content)] opacity-70 mt-2">
              Join thousands of professionals using AI to elevate their careers
            </p>
          </div>
          
          {/* Email Disclaimer */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Important Notice</span>
            </div>
            <p className="text-sm text-[var(--color-base-content)] leading-relaxed">
              Please use a <strong>valid email address</strong> that you have access to. This email will be used for password recovery and important account notifications. If you use an invalid email, you won't be able to recover your password if forgotten.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-2 text-[var(--color-base-content)] select-none"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
                  />
                </div>
              </div>

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
                    onChange={(e) => setemail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
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
                    onChange={(e) => setpassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] font-semibold hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[var(--color-base-content)] opacity-70 select-none">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[var(--color-primary)] font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-[var(--color-base-300)]">
            <p className="text-xs text-[var(--color-base-content)] opacity-60 select-none">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup