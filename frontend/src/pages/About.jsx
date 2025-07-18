import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-base-content)] mb-6">
            About <span className="text-[var(--color-primary)]">ElevateCV</span>
          </h1>
          <p className="text-xl text-[var(--color-base-content)] opacity-80 max-w-3xl mx-auto leading-relaxed">
            We're passionate about helping professionals like you unlock their career potential with AI-powered tools that make job searching smarter, faster, and more effective.
          </p>
        </div>

        {/* Who We Are Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-base-content)] mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-[var(--color-base-content)] opacity-80 mb-6 leading-relaxed">
                I'm <strong>Keshav Gilhotra</strong>, a passionate developer who understands the challenges of modern job searching firsthand. After experiencing the frustration of sending hundreds of applications with minimal responses, I realized there had to be a better way.
              </p>
              <p className="text-lg text-[var(--color-base-content)] opacity-80 mb-6 leading-relaxed">
                That's when the idea for ElevateCV was born – to level the playing field and give every job seeker access to professional-grade career tools. What started as a personal solution to my own job search struggles has now become a platform that helps thousands of professionals worldwide.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[var(--color-base-content)] font-semibold">Empowering careers since 2025</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    "To democratize career success by providing intelligent, personalized tools that help professionals present their best selves to potential employers."
                  </p>
                  <div className="mt-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="font-semibold">Helping professionals since 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Started Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-base-content)] mb-4">
              Why We Started ElevateCV
            </h2>
            <p className="text-lg text-[var(--color-base-content)] opacity-70 max-w-2xl mx-auto">
              Every great solution starts with a problem. Here's the story behind our journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--color-base-200)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-4">The Problem</h3>
              <p className="text-[var(--color-base-content)] opacity-80 leading-relaxed">
                As a developer and job seeker, I was spending hours crafting resumes and cover letters, only to get lost in the sea of applications. Generic templates weren't cutting it in today's competitive market, and I knew there had to be a better solution.
              </p>
            </div>

            <div className="bg-[var(--color-base-200)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-4">The Inspiration</h3>
              <p className="text-[var(--color-base-content)] opacity-80 leading-relaxed">
                I realized that AI could revolutionize how people approach job applications - making them more personalized, professional, and effective. Why not create a tool that could help others avoid the same struggles I faced?
              </p>
            </div>

            <div className="bg-[var(--color-base-200)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-4">The Solution</h3>
              <p className="text-[var(--color-base-content)] opacity-80 leading-relaxed">
                ElevateCV was born - a platform that combines the power of AI with human expertise to create compelling career documents that actually get results.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-base-content)] mb-4">
              Why Choose ElevateCV?
            </h2>
            <p className="text-lg text-[var(--color-base-content)] opacity-70 max-w-2xl mx-auto">
              We're not just another resume builder. We're your career transformation partner.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2">AI-Powered Intelligence</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">
                    Our advanced AI analyzes your experience and crafts personalized content that highlights your unique strengths and achievements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2">Time-Saving Efficiency</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">
                    What used to take hours now takes minutes. Generate professional resumes and cover letters in seconds, not hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2">Professional Results</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">
                    Our users report 3x higher interview rates and 40% faster job placement compared to traditional methods.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2">Expert Career Guidance</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">
                    Access to our AI career coach that provides personalized advice based on industry best practices and current market trends.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2">Privacy & Security</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">
                    Your personal information is protected with enterprise-grade security. We never share your data with third parties.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2">Completely Free</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">
                    We believe everyone deserves access to quality career tools. That's why ElevateCV is completely free to use - no hidden fees, ever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Human Touch Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">The Human Touch Behind the AI</h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                While the AI handles the heavy lifting, every feature is designed with real human needs in mind. I've walked in your shoes, felt the anxiety of job searching, and celebrated the joy of landing that dream job.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Empathy-Driven</h3>
                  <p className="opacity-80">Built by people who understand your struggles</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">User-Tested</h3>
                  <p className="opacity-80">Every feature refined through real user feedback</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Continuously Improved</h3>
                  <p className="opacity-80">Regular updates based on your success stories</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-base-content)] mb-6">
            Ready to Elevate Your Career?
          </h2>
          <p className="text-xl text-[var(--color-base-content)] opacity-80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already transformed their careers with ElevateCV. Your next opportunity is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generate-resume"
              className="px-8 py-4 bg-[var(--color-primary)] text-[var(--color-primary-content)] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Your Resume
            </Link>
            <Link
              to="/interview-prep"
              className="px-8 py-4 bg-[var(--color-base-200)] text-[var(--color-base-content)] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Career Advice
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
