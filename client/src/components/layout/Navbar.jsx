import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  Users
} from 'lucide-react'
import { logout } from '../../store/slices/userSlice'
import Logo from '../ui/Logo'

const navLinks = [
  { 
    label: 'Home', 
    path: '/',
    type: 'link'
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
    ]
  },
  { 
    label: 'Courses', 
    path: '/courses',
    type: 'link'
  },
  { 
    label: 'About', 
    path: '/about',
    type: 'link'
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
        >
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-light transition-colors"
              >
                <Icon size={18} className="text-primary" />
                <span className="text-text-primary font-medium">{item.label}</span>
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
        className={`nav-link ${isActive ? 'text-primary font-semibold' : ''}`}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-link"
      >
        {item.label}
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <DropdownMenu 
        items={item.items} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-outline py-2 px-6">
                Log In
              </Link>
            )}
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-primary hover:bg-surface-light rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="container-custom py-4 space-y-4">
              {navLinks.map((item) => (
                <div key={item.label}>
                  {item.type === 'link' ? (
                    <Link
                      to={item.path}
                      className="block py-2 text-text-primary font-medium hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div>
                      <p className="py-2 text-text-primary font-medium">{item.label}</p>
                      <div className="pl-4 space-y-2">
                        {item.items.map((subItem) => {
                          const Icon = subItem.icon
                          return (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              className="flex items-center gap-2 py-2 text-text-secondary hover:text-primary transition-colors"
                            >
                              <Icon size={16} />
                              {subItem.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link to="/dashboard" className="block py-2 text-text-primary font-medium hover:text-primary">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block py-2 text-text-primary font-medium hover:text-primary">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full btn-secondary mt-2">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="block w-full btn-outline text-center">
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
