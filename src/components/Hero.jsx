import { useEffect, useState } from 'react'
import { useEdit } from '../context/EditContext'

/**
 * 首页第一屏 —— Hero 横幅
 * 动态视频背景（assets/hero-bg.mp4，缺失时自动回退为动态渐变背景）
 */
export default function Hero() {
  const { profile } = useEdit()
  const [videoOk, setVideoOk] = useState(true)

  // 首屏元素进入后立即点亮渐显动画（Hero 位于页面顶部，无需等待滚动）
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('in-view'))
    }, 120)
    return () => clearTimeout(t)
  }, [])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="hero">
      {/* 动态背景：视频 + 渐变回退 + 网格装饰 */}
      <div className="hero__bg" aria-hidden="true">
        {videoOk && (
          <video
            className="hero__video"
            src="./assets/hero-bg.mp4"
            poster="./assets/works/work-flux.jpg"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="hero__fallback" aria-hidden="true" />
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />
      </div>

      <div className="container hero__content">
        <div className="hero__topline reveal">
          <span className="hero__dot" />
          <span data-edit="greeting">{profile.greeting}</span>
          <span className="hero__line" />
          <span className="hero__year" data-edit="heroYear">
            {profile.heroYear}
          </span>
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
          {profile.tagline}
        </p>

        <div className="hero__actions reveal" style={{ '--d': '480ms' }}>
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
