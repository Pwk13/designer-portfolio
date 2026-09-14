import { useEffect, useRef, useState } from 'react'
import { useEdit } from '../context/EditContext'

/**
 * 首页第一屏 —— Hero 横幅
 * 动态视频背景（assets/hero-bg.mp4，缺失时自动回退为动态渐变背景）
 * + Canvas 漂浮光点粒子（随鼠标轻微视差）
 */
export default function Hero() {
  const { profile, editMode } = useEdit()
  const [videoOk, setVideoOk] = useState(true)
  const [typed, setTyped] = useState('')
  const canvasRef = useRef(null)

  // 首屏元素进入后立即点亮渐显动画（Hero 位于页面顶部，无需等待滚动）
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('in-view'))
    }, 120)
    return () => clearTimeout(t)
  }, [])

  // tagline 打字机效果（编辑模式直接全量显示）
  useEffect(() => {
    if (editMode) {
      setTyped(profile.tagline)
      return
    }
    let i = 0
    setTyped('')
    const timer = setInterval(() => {
      i += 1
      setTyped(profile.tagline.slice(0, i))
      if (i >= profile.tagline.length) clearInterval(timer)
    }, 56)
    return () => clearInterval(timer)
  }, [profile.tagline, editMode])

  // Canvas 漂浮光点粒子（视差）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let parts = []
    let raf = 0
    let mx = 0.5
    let my = 0.5

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * DPR
      h = canvas.height = canvas.offsetHeight * DPR
      parts = Array.from({ length: 55 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 2 + 0.5) * DPR,
        vx: (Math.random() - 0.5) * 0.14 * DPR,
        vy: (Math.random() - 0.5) * 0.12 * DPR,
        a: Math.random() * 0.3 + 0.12,
        hue: Math.random() > 0.45 ? '182, 255, 58' : '79, 224, 184',
        tw: Math.random() * Math.PI * 2,
      }))
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width) return
      mx = (e.clientX - rect.left) / rect.width
      my = (e.clientY - rect.top) / rect.height
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx + (mx - 0.5) * 0.22 * DPR
        p.y += p.vy + (my - 0.5) * 0.18 * DPR
        p.tw += 0.02
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12
        if (p.y < -12) p.y = h + 12
        if (p.y > h + 12) p.y = -12
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.hue}, ${alpha.toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouse)
    }
  }, [])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="hero">
      {/* 动态背景：视频 + 渐变回退 + 网格 + 粒子 + 装饰字 + 光斑 */}
      <div className="hero__bg" aria-hidden="true">
        {videoOk && (
          <video
            className="hero__video"
            src="./assets/hero-bg.mp4"
            poster="./assets/works/work-mooli.webp"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="hero__fallback" aria-hidden="true" />
        <div className="hero__grid" aria-hidden="true" />
        <canvas className="hero__particles" ref={canvasRef} aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />
        {/* 超大背景装饰字 */}
        <span className="hero__watermark" aria-hidden="true">
          PORTFOLIO
        </span>
        {/* 霓虹光斑 */}
        <span className="hero__glow hero__glow--a" aria-hidden="true" />
        <span className="hero__glow hero__glow--b" aria-hidden="true" />
      </div>

      <div className="container hero__content">
        <div className="hero__topline reveal">
          <span className="hero__badge" data-edit="heroYear">
            {profile.heroYear}
          </span>
          <span className="hero__line" />
          <span className="hero__dot" />
          <span data-edit="greeting">{profile.greeting}</span>
        </div>

        <h1 className="hero__title">
          <span className="hero__title-line hero__title-line--cn reveal" style={{ '--d': '80ms' }} data-edit="role">
            {profile.role.split('').map((ch, i) => (
              <span key={i} className="hero__char" style={{ '--i': i }}>
                {ch}
              </span>
            ))}
          </span>
          <span className="hero__title-line hero__title-line--en reveal" style={{ '--d': '220ms' }} data-edit="heroEn">
            {profile.heroEn.split(' ')[0]} <em> {profile.heroEn.split(' ').slice(1).join(' ')}</em>
          </span>
        </h1>

        <p className="hero__tagline reveal" style={{ '--d': '360ms' }} data-edit="tagline">
          {typed}
          <span className="hero__caret" aria-hidden="true" />
        </p>

        {/* 技能标签条 */}
        <div className="hero__tags reveal" style={{ '--d': '430ms' }}>
          {profile.heroTags.map((t, i) => (
            <span className="hero__tag" key={t} data-edit={`heroTags.${i}`}>
              <i>{String(i + 1).padStart(2, '0')}</i>
              {t}
            </span>
          ))}
        </div>

        <div className="hero__actions reveal" style={{ '--d': '500ms' }}>
          <button className="btn btn--primary" onClick={() => go('works')}>
            查看作品
            <span className="btn__arrow">→</span>
          </button>
          <button className="btn btn--ghost" onClick={() => go('about')}>
            关于我
          </button>
        </div>
      </div>

      {/* 底部滚动提示 */}
      <button className="hero__scroll" onClick={() => go('about')} aria-label="向下滚动">
        <span className="hero__scroll-label">SCROLL</span>
        <span className="hero__scroll-line" />
      </button>

      <div className="hero__side" aria-hidden="true">
        <span>{profile.nameEn}</span>
        <span className="hero__side-line" />
        <span>© 2026</span>
      </div>
    </div>
  )
}
