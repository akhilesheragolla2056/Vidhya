import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Beaker,
  Calculator,
  Code,
  MessageSquare,
  FileText,
  HelpCircle,
  Users,
  Award,
} from 'lucide-react'
import { logout } from '../../store/slices/userSlice'
import Logo from '../ui/Logo'

const navLinks = [
  {
    label: 'Home',
    path: '/',
    type: 'link',
  },
  {
    label: 'AI Homework Assistants',
    type: 'dropdown',
    items: [
      { label: 'Math Solver', path: '/tools/math', icon: Calculator },
      { label: 'Essay Writer', path: '/tools/essay', icon: FileText },
      { label: 'Code Helper', path: '/tools/code', icon: Code },
      { label: 'Science Lab', path: '/lab/chemistry', icon: Beaker },
      { label: 'Study Chat', path: '/chat', icon: MessageSquare },
    ],
  },
  {
    label: 'Learning Tools',
    type: 'dropdown',
    items: [
      { label: 'Science Lab', path: '/science-lab', icon: Beaker },
      { label: 'My Certificates', path: '/certificates', icon: Award },
      { label: 'Study Chat', path: '/chat', icon: MessageSquare },
    ],
  },
  {
    label: 'Courses',
    path: '/courses',
    type: 'link',
  },
  {
    label: 'About',
    path: '/about',
    type: 'link',
  },
]

function DropdownMenu({ items, isOpen, onClose }) {
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
        >
          {items.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <Icon
                  size={20}
                  className="text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-sm font-medium text-text-primary group-hover:text-primary">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavItem({ item }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isActive = item.path === location.pathname

  if (item.type === 'link') {
    return (
      <Link
        to={item.path}
        className={`px-4 py-2 text-sm font-semibold transition-colors rounded-md ${
          isActive ? 'text-primary' : 'text-text-primary hover:text-primary hover:bg-gray-50'
        }`}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-semibold text-text-primary hover:text-primary hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1"
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <DropdownMenu items={item.items} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-1 flex-1 px-8">
            {navLinks.map(item => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-white">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary border border-gray-900 rounded-md transition-all hover:bg-gray-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-bold text-text-primary hover:text-primary border border-gray-900 rounded-md transition-all hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="container-custom py-4 space-y-2">
              {navLinks.map(item => (
                <div key={item.label}>
                  {item.type === 'link' ? (
                    <Link
                      to={item.path}
                      className="block py-3 px-4 text-text-primary font-semibold hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div>
                      <p className="py-3 px-4 text-text-primary font-semibold">{item.label}</p>
                      <div className="pl-4 space-y-1">
                        {item.items.map(subItem => {
                          const Icon = subItem.icon
                          return (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              className="flex items-center gap-3 py-2.5 px-4 text-text-secondary hover:bg-gray-50 rounded-md transition-colors"
                            >
                              <Icon size={18} className="text-primary" />
                              <span className="font-medium">{subItem.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block py-3 px-4 text-text-primary font-semibold hover:bg-gray-50 rounded-md"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block py-3 px-4 text-text-primary font-semibold hover:bg-gray-50 rounded-md"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 px-4 text-text-primary font-semibold border border-gray-900 rounded-md hover:bg-gray-50"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full py-3 px-4 text-center text-text-primary font-bold border border-gray-900 rounded-md hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full py-3 px-4 text-center text-white font-bold bg-gray-900 rounded-md hover:bg-gray-800"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
