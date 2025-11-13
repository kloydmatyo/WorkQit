'use client'

import { Fragment, useEffect, useRef, useState, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  GitCompare,
  Briefcase,
  Users,
  BookOpen,
  LogOut,
  Settings,
  FileText,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type NavItem = {
  href: string
  label: string
  icon?: ComponentType<{ className?: string }>
  requiresAuth?: boolean
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  { href: '/counter-demo', label: 'Counter Demo', icon: Sparkles, requiresAuth: true },
  { href: '/counter-comparison', label: 'Props vs Context', icon: GitCompare, requiresAuth: true },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/applications', label: 'My Applications', icon: FileText, requiresAuth: true, roles: ['job_seeker'] },
  { href: '/career-map', label: 'Career Map', icon: BookOpen },
  { href: '/community', label: 'Community', icon: Users },
]

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = Boolean(user)

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.roles && user && !item.roles.includes(user.role)) return false
    if (item.href === '/applications' && user?.role !== 'job_seeker') return false
    return true
  })

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showUserMenu) return
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [pathname])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setShowUserMenu(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const desktopNav = (
    <div className="hidden md:flex md:items-center md:gap-2">
      {loading ? (
        <div className="flex items-center gap-4">
          {[...Array(3)].map((_, index) => (
            <span
              key={`nav-skeleton-${index}`}
              className="h-9 w-20 animate-pulse rounded-full bg-slate-200/70"
            />
          ))}
        </div>
      ) : (
        <Fragment>
          <div className="flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group nav-link hover-lift-sm ${isActive ? 'bg-primary-50/80 text-primary-600 shadow-soft ring-1 ring-primary-100/80' : 'hover:bg-primary-50/40'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {Icon ? <Icon className="h-6 w-6 text-primary-500 transition-colors duration-300 group-hover:text-primary-600" /> : null}
                  <span className="relative">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {isAuthenticated ? (
            <div className="relative ml-4" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="group inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-2 py-1 pl-1 pr-3 text-sm font-medium text-slate-600 shadow-subtle backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:text-primary-600"
                aria-expanded={showUserMenu}
                aria-haspopup="menu"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-base font-semibold text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
                <span className="hidden text-sm font-semibold text-slate-700 lg:block">
                  {user?.firstName}
                </span>
              </button>

              <div
                className={`absolute right-0 top-14 w-64 origin-top rounded-2xl border border-white/60 bg-white/90 p-4 shadow-glow backdrop-blur-xl transition-all duration-300 ${
                  showUserMenu ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                }`}
                role="menu"
              >
                <div className="mb-4 rounded-2xl bg-primary-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <nav className="flex flex-col gap-2 text-sm">
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-primary-50/80 hover:text-primary-600"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>
          ) : (
            <div className="ml-6 flex items-center gap-3">
              <Link href="/auth/login" className="btn-secondary text-lg">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary text-lg">
                Sign Up
              </Link>
            </div>
          )}
        </Fragment>
      )}
    </div>
  )

  const mobileNav = (
    <div
      className={`md:hidden transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        className={`mx-4 mt-3 origin-top rounded-3xl border border-white/50 bg-white/85 p-4 shadow-glow backdrop-blur-xl transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={`mobile-nav-skeleton-${index}`} className="h-10 w-full animate-pulse rounded-xl bg-slate-200/70" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50/90 text-primary-600 shadow-soft ring-1 ring-primary-100/80'
                        : 'text-slate-600 hover:bg-primary-50/60 hover:text-primary-600'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {Icon ? <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> : null}
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {isAuthenticated ? (
              <div className="space-y-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-subtle">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-base font-semibold text-white shadow-soft">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/70 bg-primary-50/70 px-4 py-2 text-lg font-semibold text-primary-600 transition-colors duration-200 hover:bg-primary-100"
                >
                  Profile Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-red-100 bg-red-50/70 px-4 py-2 text-lg font-semibold text-red-500 transition-colors duration-200 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" className="btn-secondary justify-center text-lg">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary justify-center text-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'border-b border-white/40 bg-white/70 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.28)] backdrop-blur-2xl'
          : 'border-transparent bg-white/40 backdrop-blur-xl'
      }`}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="group flex items-center gap-2.5 rounded-full border border-white/50 bg-white/80 px-3 py-1.5 shadow-subtle backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-semibold text-white shadow-soft transition-transform duration-300 group-hover:scale-110">
              WQ
            </span>
            <span className="text-gradient text-xl font-semibold uppercase tracking-[0.22em] text-slate-800 md:text-[1.45rem] md:tracking-[0.3em] transition-all duration-300 group-hover:text-aurora">
              WORKQIT
            </span>
          </Link>

          {desktopNav}

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="btn-icon h-11 w-11 rounded-2xl text-slate-600"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-navigation">{mobileNav}</div>
    </nav>
  )
}
