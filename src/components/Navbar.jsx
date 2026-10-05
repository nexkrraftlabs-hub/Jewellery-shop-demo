import { useState, useEffect } from 'react'
import SocialIcons from './SocialIcons'
import './Navbar.css'

const NAV_ITEMS = [
  { label: 'Home', target: '#home' },
  { label: 'About', target: '#home' },
  { label: 'Shop', target: '#best-sellers' },
  { label: 'Benefits', target: '#mood-selector' },
  { label: 'Contact', target: '#reviews' },
]

const Navbar = () => {
  const [active, setActive] = useState('Home')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNavClick = (item) => {
    setActive(item.label)
    setOpen(false)
    const el = document.querySelector(item.target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className={`navbar-header ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="navbar" aria-label="Main navigation">
          <a href="#home" className="navbar-logo" onClick={() => setActive('Home')}>
            Fruitivo
            <span className="navbar-logo-dot">.</span>
            <svg className="navbar-logo-leaf" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20c0-8 6-14 14-14 0 8-6 14-14 14Z"
                fill="#4CAF50"
              />
            </svg>
          </a>

          {/* Desktop links */}
          <ul className="navbar-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  className={`navbar-link ${active === item.label ? 'is-active' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <div className="navbar-icons">
              <button className="navbar-icon-btn" aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="21" r="1.4" fill="currentColor" />
                  <circle cx="17" cy="21" r="1.4" fill="currentColor" />
                </svg>
              </button>
              <button className="navbar-icon-btn" aria-label="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="9.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M5.5 19c1.3-2.8 3.8-4.3 6.5-4.3s5.2 1.5 6.5 4.3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <button
              className={`navbar-burger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`navbar-backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Side Drawer (Slides in from the right) */}
      <aside
        className={`navbar-drawer ${open ? 'is-open' : ''}`}
        aria-label="Mobile Navigation Drawer"
      >
        <div className="navbar-drawer-header">
          <a
            href="#home"
            className="navbar-logo"
            onClick={() => {
              setActive('Home')
              setOpen(false)
            }}
          >
            Fruitivo
            <span className="navbar-logo-dot">.</span>
            <svg className="navbar-logo-leaf" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 20c0-8 6-14 14-14 0 8-6 14-14 14Z" fill="#4CAF50" />
            </svg>
          </a>
          <button
            className="navbar-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <ul className="navbar-drawer-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                className={`navbar-drawer-link ${active === item.label ? 'is-active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <span>{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="navbar-drawer-arrow">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-drawer-footer">
          <div className="navbar-drawer-actions">
            <button className="navbar-drawer-btn" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="21" r="1.4" fill="currentColor" />
                <circle cx="17" cy="21" r="1.4" fill="currentColor" />
              </svg>
              <span>Shopping Bag</span>
            </button>
            <button className="navbar-drawer-btn" aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="9.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M5.5 19c1.3-2.8 3.8-4.3 6.5-4.3s5.2 1.5 6.5 4.3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span>My Profile</span>
            </button>
          </div>
          <div className="navbar-drawer-socials">
            <SocialIcons />
          </div>
        </div>
      </aside>
    </>
  )
}

export default Navbar
