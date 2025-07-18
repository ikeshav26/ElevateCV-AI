import React from 'react'
import { Link } from 'react-router-dom'
import {
  DocumentTextIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer
      className="py-16 border-t"
      style={{
        backgroundColor: 'var(--bg-alt)',
        color: 'var(--text)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                ElevateCV AI
              </h3>
            </div>
            <p
              className="text-sm leading-relaxed mb-4 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Empowering professionals worldwide with AI-powered career tools. 
              Build stunning resumes, craft compelling cover letters, and ace your interviews 
              with our intelligent platform.
            </p>
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <GlobeAltIcon className="w-4 h-4 mr-1" />
                Available globally
              </div>
              <div
                className="flex items-center text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ShieldCheckIcon className="w-4 h-4 mr-1" />
                Secure & Private
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: 'var(--text-primary)' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/generate-resume"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Generate Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/generate-letter"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Generate Cover Letter
                </Link>
              </li>
              <li>
                <Link
                  to="/interview-prep"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Interview Preparation
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Explore Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: 'var(--text-primary)' }}
            >
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ikeshav26/ElevateCV-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t py-8"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p
                className="text-sm select-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                &copy; {new Date().getFullYear()} ElevateCV AI. All rights reserved.
              </p>
              <span
                className="text-sm select-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                •
              </span>
              <span
                className="text-sm select-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                Version 1.0
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span
                className="text-sm select-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                Made with
              </span>
              <HeartIcon 
                className="w-4 h-4 text-red-500" 
                fill="currentColor"
              />
              <span
                className="text-sm select-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                for job seekers everywhere
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center pt-4">
          <p
            className="text-xs select-none"
            style={{ color: 'var(--text-secondary)' }}
          >
            Empowering careers with artificial intelligence • Free forever • No hidden fees
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer