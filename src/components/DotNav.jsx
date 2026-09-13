import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'works', label: '作品' },
  { id: 'skills', label: '优势' },
  { id: 'contact', label: '联系' },
]

/** 右侧固定翻页导航点 */
export default function DotNav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav className="dotnav" aria-label="章节导航">
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          className={`dotnav__item ${active === s.id ? 'is-active' : ''}`}
          onClick={() => go(s.id)}
          aria-label={s.label}
        >
          <span className="dotnav__dot" />
          <span className="dotnav__tip">
            <i>0{i + 1}</i> {s.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
