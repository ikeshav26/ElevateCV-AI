import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  PhoneIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { AppContext } from '../context/ContextProvider'

const Navbar = () => {
  const { theme, settheme, user, setuser, navigate } = useContext(AppContext)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [clickedThemeToggle, setClickedThemeToggle] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setuser(null)
    setIsProfileDropdownOpen(false)
    setIsMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => window.location.pathname === path

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/explore', label: 'Explore', icon: MagnifyingGlassIcon },
    { path: '/generate-resume', label: 'Generate Resume', icon: DocumentTextIcon },
    { path: '/generate-letter', label: 'Generate Letter', icon: EnvelopeIcon },
    { path: '/interview-prep', label: 'Interview Prep', icon: AcademicCapIcon },
  ]

  const profileDropdownItems = [
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
    { path: '/about', label: 'About', icon: InformationCircleIcon },
    { path: '/contact', label: 'Contact', icon: PhoneIcon },
  ]

  return (
    <nav className="w-full border-b sticky top-0 z-50 transition-colors duration-300 bg-[--bg] text-[--text] border-[--border]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[--primary] rounded-lg flex items-center justify-center">
              <span className="text-[--primary-text] font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-[--text]">
              ElevateCV<span className="text-[--primary] ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 ml-10">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(path)
                    ? 'bg-[--highlight] text-[--primary-text]'
                    : 'hover:bg-[--hover] hover:text-[--text-hover]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                const newTheme = theme === 'light' ? 'dark' : 'light'
                settheme(newTheme)
                localStorage.setItem('theme', newTheme)
                setClickedThemeToggle(true)
                setTimeout(() => setClickedThemeToggle(false), 500)
              }}
              className="p-2 rounded-md hover:bg-[--hover] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    clickedThemeToggle ? 'rotate-180' : ''
                  }`}
                />
              ) : (
                <SunIcon
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    clickedThemeToggle ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Profile Dropdown on large screens */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {user && (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-1 p-2 rounded-md hover:bg-[--hover]"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[--bg] text-[--text] rounded-md shadow-lg border border-[--border] z-50">
                      <div className="py-1">
                        {profileDropdownItems.map(({ path, label, icon: Icon }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200 ${
                              isActive(path)
                                ? 'bg-[--highlight] text-[--primary-text]'
                                : 'hover:bg-[--hover] hover:text-[--text-hover]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </Link>
                        ))}
                        <div className="border-t my-1 border-[--border]" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-[--error] hover:bg-[--error-hover-bg] hover:text-[--error-hover-text] transition-colors duration-200"
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Login Button - Desktop */}
            {!user && (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-1 px-4 py-2 bg-[--primary] text-[--primary-text] hover:opacity-90 rounded-md text-sm transition-opacity duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-[--hover]"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-[--bg] text-[--text] border-[--border]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(path)
                    ? 'bg-[--highlight] text-[--primary-text]'
                    : 'hover:bg-[--hover] hover:text-[--text-hover]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Profile Items in Mobile */}
            {user ? (
              <>
                <div className="border-t mt-2 pt-2 border-[--border]">
                  {profileDropdownItems.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(path)
                          ? 'bg-[--highlight] text-[--primary-text]'
                          : 'hover:bg-[--hover] hover:text-[--text-hover]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-[--error] hover:bg-[--error-hover-bg] hover:text-[--error-hover-text] transition-colors duration-200"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t mt-2 pt-2 border-[--border]">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-[--primary] text-[--primary-text] hover:opacity-90 transition-opacity duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar