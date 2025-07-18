import React from 'react'
import { Link } from 'react-router-dom'
import {
  DocumentTextIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserGroupIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const features = [
    {
      icon: DocumentTextIcon,
      path: '/generate-resume',
      title: 'AI-Powered Resume Builder',
      description:
        'Create professional resumes with our advanced AI technology that tailors content to your industry.',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop'
    },
    {
      icon: EnvelopeIcon,
      path: '/generate-letter',
      title: 'Smart Cover Letters',
      description:
        'Generate personalized cover letters that perfectly match job requirements and company culture.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
    },
    {
      icon: AcademicCapIcon,
      path: '/interview-prep',
      title: 'Interview Preparation',
      description:
        'Practice with AI-powered mock interviews and get personalized feedback to ace your next interview.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Resumes Created' },
    { number: '1K+', label: 'Letters Generated' },
    { number: '98%', label: 'Success Rate' },
    { number: '24/7', label: 'AI Support' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                Elevate Your Career with <span style={{ color: 'var(--primary)' }}>AI-Powered</span> Tools
              </h1>
              <p className="mt-6 text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Transform your job search with intelligent resume building, personalized cover letters, and AI-driven interview preparation.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/generate-resume"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-text)'
                  }}
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Create Resume
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Explore More
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop"
                alt="Professional workspace"
                className="rounded-2xl shadow-2xl"
              />
              <div
                className="absolute -top-4 -right-4 p-4 rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-text)' }}
              >
                <SparklesIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--primary)' }}>
                  {stat.number}
                </div>
                <div className="mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Powerful AI Features
            </h2>
            <p className="mt-4 text-xl" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to succeed in your job search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link to={feature.path} key={index}>
              <div
                className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                style={{ backgroundColor: 'var(--bg)' }}
              >
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <feature.icon className="w-8 h-8 mr-3" style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                  <div className="flex items-center font-medium transition-all duration-200 hover:translate-x-1 cursor-pointer" style={{ color: 'var(--primary)' }}>
                    Learn More
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          color: 'var(--primary-text)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Career?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their job search with AI.
            Start building your future today with our intelligent career tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generate-resume"
              className="inline-flex items-center px-8 py-3 font-medium rounded-lg transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--primary-text)',
                color: 'var(--primary)'
              }}
            >
              Get Started Free
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/interview-prep"
              className="inline-flex items-center px-8 py-3 font-medium rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--primary-text)',
                color: 'var(--primary-text)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Try Interview Prep
            </Link>
          </div>
          <div
            className="mt-8 flex items-center justify-center space-x-6 text-sm"
            style={{ color: 'var(--primary-text)', opacity: 0.8 }}
          >
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              No credits required
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Free Generation
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              24/7 AI support
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home