import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

const GetQNA = () => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error("Please enter a question or prompt")
      return
    }

    setIsLoading(true)
    
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        toast.error("Please login first")
        return
      }

      // Add user question to conversation history
      const newConversation = [...conversationHistory, {
        id: Date.now(),
        type: 'user',
        content: prompt,
        timestamp: new Date()
      }]
      setConversationHistory(newConversation)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/qna/generate`,
        { prompt },
        { withCredentials: true }
      )

      if (response.data.success) {
        const aiResponse = response.data.data?.content || response.data.response || response.data.answer || "I'm sorry, I couldn't generate a response."
        
        // Add AI response to conversation history
        const updatedConversation = [...newConversation, {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        }]
        setConversationHistory(updatedConversation)
        setResponse(aiResponse)
        toast.success("Response generated successfully!")
      } else {
        toast.error("Failed to generate response")
      }
    } catch (error) {
      console.error('QNA error:', error)
      toast.error(error.response?.data?.message || "Failed to get AI response")
    } finally {
      setIsLoading(false)
      setPrompt('') // Clear input after submission
    }
  }

  const handleClear = () => {
    setPrompt('')
    setResponse('')
    setConversationHistory([])
    toast.success("Conversation cleared!")
  }

  const sampleQuestions = [
    "How do I write a compelling cover letter for a tech job?",
    "What are the key skills needed for a full-stack developer role?",
    "How can I prepare for a software engineering interview?",
    "What should I include in my portfolio as a web developer?",
    "How do I negotiate salary for a new job offer?",
    "What are the best practices for remote work productivity?"
  ]

  const handleSampleQuestion = (question) => {
    setPrompt(question)
  }

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-base-content)] mb-4">
            AI Career Assistant
          </h1>
          <p className="text-lg text-[var(--color-base-content)] opacity-70">
            Get expert advice on career development, job search, and professional growth
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Ask Your Question
            </h2>

            {/* Tips */}
            <div className="bg-[var(--color-base-100)] rounded-xl p-4 mb-6 border border-[var(--color-base-300)]">
              <h4 className="font-semibold text-[var(--color-base-content)] mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                💡 Tips for Better Responses
              </h4>
              <ul className="text-sm text-[var(--color-base-content)] opacity-80 space-y-1">
                <li>• Be specific about your industry or role</li>
                <li>• Provide context about your experience level</li>
                <li>• Ask actionable questions for practical advice</li>
                <li>• Include details about your goals or challenges</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Your Question or Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows="6"
                  placeholder="Ask me anything about career development, job search strategies, interview preparation, skill building, or professional growth..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Getting AI Response...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Ask AI
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 px-6 rounded-xl bg-[var(--color-base-300)] text-[var(--color-base-content)] font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Chat
                </button>
              </div>
            </form>
          </div>

          {/* Response Section */}
          <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Response
            </h2>

            {conversationHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                  Ready to Help You!
                </h3>
                <p className="text-[var(--color-base-content)] opacity-60">
                  Ask a question about your career, job search, or professional development
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {conversationHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl break-words ${
                      item.type === 'user'
                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-content)] ml-8'
                        : 'bg-[var(--color-base-100)] text-[var(--color-base-content)] mr-8 border border-[var(--color-base-300)]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.type === 'user' ? 'bg-white/20' : 'bg-[var(--color-primary)]'
                      }`}>
                        {item.type === 'user' ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {item.type === 'user' ? (
                          <p className="text-sm break-words whitespace-pre-line">{item.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-full text-[var(--color-base-content)] break-words whitespace-pre-line overflow-x-auto">
                            <ReactMarkdown>{item.content}</ReactMarkdown>
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${item.type === 'user' ? 'text-white/70' : 'text-[var(--color-base-content)]/50'}`}>
                          {item.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
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

export default GetQNA