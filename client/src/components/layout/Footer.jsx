import { Link } from 'react-router-dom'
import { Mail, Linkedin, Twitter } from 'lucide-react'
import Logo from '../ui/Logo'

const quickLinks = [
  { label: 'Courses', path: '/courses' },
  { label: 'AI Tools', path: '/chat' },
  { label: 'About', path: '/about' },
  { label: 'Help', path: '/help' },
]

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-text-secondary hidden sm:block">
              AI-powered learning for everyone
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Social and Contact */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:hello@vidhya.ai" 
              className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              <Mail size={14} />
              <span className="hidden sm:inline">Contact</span>
            </a>
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <Icon size={14} />
                </a>
              )
            })}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {currentYear} Vidhya AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
