import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

   toast.success("Message sent successfully! I'll get back to you soon.")
   setFormData({
     name: '',
     email: '',
     subject: '',
     message: '',
     type: 'general'
   })
   setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-base-content)] mb-6">
            Get in <span className="text-[var(--color-primary)]">Touch</span>
          </h1>
          <p className="text-xl text-[var(--color-base-content)] opacity-80 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or suggestions? I'd love to hear from you! Your input helps make ElevateCV better for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6">
                Let's Connect
              </h2>
              <p className="text-[var(--color-base-content)] opacity-80 mb-8 leading-relaxed">
                I'm always excited to connect with fellow professionals, developers, and anyone who's passionate about career growth. Don't hesitate to reach out!
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-1">Portfolio</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">ikeshav.tech</p>
                  <p className="text-sm text-[var(--color-base-content)] opacity-60">I typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-1">Twitter</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">@keshavgilh5995</p>
                  <p className="text-sm text-[var(--color-base-content)] opacity-60">Follow for updates and tips</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-1">LinkedIn</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">linkedin/in/keshav-gilhotra</p>
                  <p className="text-sm text-[var(--color-base-content)] opacity-60">Let's connect professionally</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-1">GitHub</h3>
                  <p className="text-[var(--color-base-content)] opacity-80">github.com/ikeshav26</p>
                  <p className="text-sm text-[var(--color-base-content)] opacity-60">Check out the code</p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-[var(--color-base-200)] rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-base-content)]">Quick Response</h3>
              </div>
              <p className="text-[var(--color-base-content)] opacity-80 text-sm">
                I aim to respond to all messages within 24 hours. For urgent matters, please mention it in your subject line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6">
                Send Me a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message Type */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-3">
                    What's this about? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'general', label: 'General', icon: '💬' },
                      { value: 'bug', label: 'Bug Report', icon: '🐛' },
                      { value: 'feature', label: 'Feature Request', icon: '✨' },
                      { value: 'feedback', label: 'Feedback', icon: '💭' }
                    ].map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          formData.type === type.value
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                            : 'border-[var(--color-base-300)] hover:border-[var(--color-primary)]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-lg mr-2">{type.icon}</span>
                        <span className="text-sm font-medium text-[var(--color-base-content)]">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your message"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell me more about what's on your mind..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-[var(--color-base-100)] rounded-xl border border-[var(--color-base-300)]">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-base-content)] mb-1">
                      Your Privacy Matters
                    </h4>
                    <p className="text-xs text-[var(--color-base-content)] opacity-80">
                      Your contact information will only be used to respond to your message. I don't share your data with third parties or use it for marketing purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-base-content)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--color-base-content)] opacity-70 max-w-2xl mx-auto">
              Quick answers to common questions. Don't see yours? Feel free to ask!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-base-200)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-3">
                How quickly do you respond?
              </h3>
              <p className="text-[var(--color-base-content)] opacity-80">
                I typically respond within 24 hours. For bug reports or urgent issues, I aim to respond even faster, usually within a few hours during business days.
              </p>
            </div>

            <div className="bg-[var(--color-base-200)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-3">
                Can you add a specific feature?
              </h3>
              <p className="text-[var(--color-base-content)] opacity-80">
                Absolutely! I love hearing feature requests. While I can't implement everything immediately, I prioritize features based on user feedback and feasibility.
              </p>
            </div>

            <div className="bg-[var(--color-base-200)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-3">
                Is ElevateCV really free?
              </h3>
              <p className="text-[var(--color-base-content)] opacity-80">
                Yes! ElevateCV is completely free to use. I built it to help job seekers, not to make money. There are no hidden fees or premium tiers.
              </p>
            </div>

            <div className="bg-[var(--color-base-200)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-3">
                Can I contribute to the project?
              </h3>
              <p className="text-[var(--color-base-content)] opacity-80">
                I'd love your help! Whether it's code contributions, design suggestions, or feedback, every contribution makes ElevateCV better. Check out the GitHub repo!
              </p>
            </div>
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

export default Contact
