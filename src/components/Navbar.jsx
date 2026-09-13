import { useEffect, useState } from 'react'
import { useEdit } from '../context/EditContext'

const LINKS = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'works', label: '作品' },
  { id: 'skills', label: '优势' },
  { id: 'contact', label: '联系' },
]

export default function Navbar() {
  const { profile, editMode, setEditMode } = useEdit()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <button className="nav__brand" onClick={() => go('hero')} aria-label="回到顶部">
          <span className="nav__logo">{profile.nameEn.slice(0, 1)}</span>
          <span className="nav__brand-text">
            <b data-edit="name">{profile.name}</b>
            <em data-edit="roleEn">{profile.roleEn}</em>
          </span>
        </button>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <button
              key={l.id}
              className={`nav__link ${active === l.id ? 'is-active' : ''}`}
              onClick={() => go(l.id)}
            >
              <span className="nav__index">0{LINKS.indexOf(l) + 1}</span>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav__right">
          <button
            className={`nav__edit ${editMode ? 'is-on' : ''}`}
            onClick={() => setEditMode((v) => !v)}
            title="编辑模式：直接在页面上修改文字、更换图片"
          >
            {editMode ? '✓ 完成编辑' : '✎ 编辑'}
          </button>
          <button className="btn btn--ghost nav__cta" onClick={() => go('contact')}>
            <span data-edit="ctaText">{profile.ctaText}</span>
          </button>
          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="菜单"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
