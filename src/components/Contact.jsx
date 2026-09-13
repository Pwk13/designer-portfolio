import { useEdit } from '../context/EditContext'
import Reveal from './Reveal'

/* 简单线性图标（内联 SVG，保证跨平台渲染一致） */
const Icons = {
  email: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 12 5l9 5-9 5-9-5Z" />
      <path d="M6.5 12.5V17c0 1 2.5 2.5 5.5 2.5s5.5-1.5 5.5-2.5v-4.5" />
      <path d="M21 10v5" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
}

/** 页尾底部模块：联系方式 + 版权信息 */
export default function Contact() {
  const { profile } = useEdit()

  const CONTACTS = [
    { key: 'email', label: '邮箱 / EMAIL', value: profile.email, href: `mailto:${profile.email}` },
    { key: 'phone', label: '电话 / TEL', value: profile.phone, href: `tel:${profile.phone.replace(/-/g, '')}` },
    { key: 'school', label: '院校 / SCHOOL', value: profile.school },
    { key: 'location', label: '所在地 / BASE', value: profile.location },
  ]

  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="contact">
      <div className="contact__bg" aria-hidden="true" />
      <div className="container">
        <Reveal className="section-head section-head--center">
          <span className="section-tag">CONTACT / 联系方式</span>
          <h2 className="contact__title">
            LET&apos;S <em>TALK</em>
          </h2>
          <p className="contact__sub" data-edit="tagline">
            {profile.tagline}
          </p>
        </Reveal>

        <div className="contact__grid">
          {CONTACTS.map((c, i) => (
            <Reveal key={c.key} className="contact-card" delay={i * 90}>
              {c.href ? (
                <a className="contact-card__link" href={c.href}>
                  <span className="contact-card__icon" aria-hidden="true">
                    {Icons[c.key]}
                  </span>
                  <span className="contact-card__label">{c.label}</span>
                  <span className="contact-card__value" data-edit={c.key}>
                    {c.value}
                  </span>
                </a>
              ) : (
                <span className="contact-card__link">
                  <span className="contact-card__icon" aria-hidden="true">
                    {Icons[c.key]}
                  </span>
                  <span className="contact-card__label">{c.label}</span>
                  <span className="contact-card__value" data-edit={c.key}>
                    {c.value}
                  </span>
                </span>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="contact__cta" delay={160}>
          <a className="btn btn--primary btn--lg" href={`mailto:${profile.email}`}>
            发送邮件合作洽谈
            <span className="btn__arrow">→</span>
          </a>
        </Reveal>

        <Reveal className="contact__socials" delay={220}>
          {profile.socials.map((s, i) => (
            <a key={s.label} className="contact__social" href={s.url} target="_blank" rel="noreferrer">
              <span data-edit={`socials.${i}.label`}>{s.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </Reveal>

        <div className="contact__bottom">
          <span>
            © 2026 {profile.name} · {profile.role} · 保留所有权利
          </span>
          <button className="contact__top" onClick={top}>
            回到顶部 ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
