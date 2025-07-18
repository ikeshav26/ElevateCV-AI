// ⬇️ At the top: leave your imports as they are.
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
    <nav
      className="w-full border-b fixed top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-base-100)',
        color: 'var(--color-base-content)',
        borderColor: 'var(--color-base-200)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="font-bold text-sm" style={{ color: 'var(--color-primary-content)' }}>
                E
              </span>
            </div>
            <span className="text-xl font-bold select-none" style={{ color: 'var(--color-base-content)' }}>
              ElevateCV
              <span className="ml-1 select-none" style={{ color: 'var(--color-primary)' }}>
                AI
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-4 ml-10">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = isActive(path)
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium select-none transition-colors duration-200 ${
                    active ? '' : 'hover:bg-[var(--color-base-200)]'
                  }`}
                  style={{
                    backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? 'var(--color-primary-content)' : 'var(--color-base-content)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => {
                const newTheme = theme === 'light' ? 'dark' : 'light'
                settheme(newTheme)
                localStorage.setItem('theme', newTheme)
                setClickedThemeToggle(true)
                setTimeout(() => setClickedThemeToggle(false), 200)
              }}
              className="p-2 rounded-md transition-all duration-150 hover:bg-[var(--color-base-200)] cursor-pointer active:scale-95"
              aria-label="Toggle theme"
              style={{ color: 'var(--color-base-content)' }}
            >
              {theme === 'light' ? (
                <MoonIcon className={`w-5 h-5 transform duration-150 ${clickedThemeToggle ? 'rotate-180' : ''}`} />
              ) : (
                <SunIcon className={`w-5 h-5 transform duration-150 ${clickedThemeToggle ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {user && (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-1 p-2 rounded-md transition-all duration-200 hover:bg-[var(--color-base-200)] hover:scale-105 active:scale-95"
                    style={{ color: 'var(--color-base-content)' }}
                  >
                    <UserCircleIcon className="w-6 h-6" />
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg border z-50"
                      style={{
                        backgroundColor: 'var(--color-base-100)',
                        color: 'var(--color-base-content)',
                        borderColor: 'var(--color-base-200)',
                      }}
                    >
                      <div className="py-1">
                        {profileDropdownItems.map(({ path, label, icon: Icon }) => {
                          const active = isActive(path)
                          return (
                            <Link
                              key={path}
                              to={path}
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200 select-none ${
                                active ? '' : 'hover:bg-[var(--color-base-200)]'
                              }`}
                              style={{
                                backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                                color: active ? 'var(--color-primary-content)' : 'var(--color-base-content)',
                              }}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{label}</span>
                            </Link>
                          )
                        })}
                        <div className="border-t my-1" style={{ borderColor: 'var(--color-base-200)' }} />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-all duration-200 select-none hover:bg-[var(--color-error-content)] hover:scale-105 active:scale-95"
                          style={{ color: 'var(--color-error)' }}
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

            {/* Login Button */}
            {!user && (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-1 px-4 py-2 rounded-md text-sm select-none transition-all duration-200 hover:bg-[var(--color-primary-content)] hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-content)',
                }}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-all duration-200 hover:bg-[var(--color-base-200)] hover:scale-110 active:scale-95"
                style={{ color: 'var(--color-base-content)' }}
              >
                {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: 'var(--color-base-100)',
            color: 'var(--color-base-content)',
            borderColor: 'var(--color-base-200)',
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = isActive(path)
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium select-none transition-colors duration-200 ${
                    active ? '' : 'hover:bg-[var(--color-base-200)]'
                  }`}
                  style={{
                    backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? 'var(--color-primary-content)' : 'var(--color-base-content)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              )
            })}

            {user ? (
              <>
                <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--color-base-200)' }}>
                  {profileDropdownItems.map(({ path, label, icon: Icon }) => {
                    const active = isActive(path)
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium select-none transition-colors duration-200 ${
                          active ? '' : 'hover:bg-[var(--color-base-200)]'
                        }`}
                        style={{
                          backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                          color: active ? 'var(--color-primary-content)' : 'var(--color-base-content)',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </Link>
                    )
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium select-none transition-all duration-200 hover:bg-[var(--color-error-content)] hover:scale-105 active:scale-95"
                    style={{ color: 'var(--color-error)' }}
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--color-base-200)' }}>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium select-none transition-all duration-200 hover:bg-[var(--color-primary-content)] hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-content)',
                  }}
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