import { useEffect, useRef, useState } from 'react'
import { useEdit } from '../context/EditContext'
import Reveal from './Reveal'

/** 项目展示模块：横屏平滑滚动作品墙 + 点击放大 + 设计说明 + 编辑增删 */
export default function Works() {
  const { profile, editMode, removeWork, addCategory } = useEdit()
  const [filter, setFilter] = useState('全部')
  const [selected, setSelected] = useState(null) // 点击放大的作品
  const rootRef = useRef(null)
  const trackRef = useRef(null)

  const FILTERS = profile.categories
  const list = filter === '全部' ? profile.works : profile.works.filter((w) => w.category === filter)

  /* 鼠标滚轮 → 平滑横向滚动（插值动画，setInterval 驱动保证各环境都跟手） */
  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    let timer = null
    let target = 0

    const anim = () => {
      const cur = track.scrollLeft
      const d = target - cur
      if (Math.abs(d) > 0.5) {
        track.scrollLeft = cur + d * 0.24
      } else {
        track.scrollLeft = target
        clearInterval(timer)
        timer = null
      }
    }

    const onWheel = (e) => {
      // 灯箱内滚动不拦截（说明面板需要正常纵向滚动）
      if (e.target.closest && e.target.closest('.lightbox')) return
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
        e.preventDefault()
        target = Math.min(
          Math.max(target + e.deltaY, 0),
          track.scrollWidth - track.clientWidth,
        )
        if (!timer) timer = setInterval(anim, 16)
      }
    }
    root.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      root.removeEventListener('wheel', onWheel)
      if (timer) clearInterval(timer)
    }
  }, [list])

  /* 切换筛选回到起点 */
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0
  }, [filter])

  /* Esc 关闭放大 */
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const scrollBy = (dx) => trackRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  const openLightbox = (w) => {
    if (!editMode) setSelected(w)
  }

  const onAddCategory = () => {
    const name = (window.prompt('新分类名称：') || '').trim()
    if (!name) return
    addCategory(name)
  }

  return (
    <div className="works" ref={rootRef}>
      <div className="container works__head">
        <Reveal className="section-head">
          <span className="section-tag">SELECTED WORKS / 作品展示</span>
          <h2 className="section-title">
            代表性<em>作品</em>
          </h2>
        </Reveal>

        <Reveal className="works__filters" delay={120}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`works__filter ${filter === f ? 'is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          {editMode && (
            <button className="works__filter works__filter--add" onClick={onAddCategory} title="添加分类">
              ＋ 分类
            </button>
          )}
        </Reveal>
      </div>

      <div className="container works__shell">
        <button className="works__arrow works__arrow--prev" onClick={() => scrollBy(-640)} aria-label="向左滚动">
          ←
        </button>

        <div className="works__track" ref={trackRef}>
          {list.map((w) => (
            <article className="work-card" key={w.id}>
              {editMode && (
                <button
                  className="work-card__del"
                  onClick={() => {
                    if (window.confirm(`确定删除作品「${w.title}」？`)) removeWork(w.id)
                  }}
                  title="删除作品"
                >
                  ✕
                </button>
              )}
              <div className="work-card__media" onClick={() => openLightbox(w)}>
                <img src={w.image} alt={w.title} loading="lazy" data-edit-img={`works.${w.id}.image`} />
                <span className="work-card__zoom">⤢ 点击放大</span>
              </div>
              <div className="work-card__info">
                <div className="work-card__tags">
                  <span className="work-card__cat">{w.category}</span>
                  <span className="work-card__year" data-edit={`works.${w.id}.year`}>
                    {w.year}
                  </span>
                </div>
                <h3 className="work-card__title" data-edit={`works.${w.id}.title`}>
                  {w.title}
                </h3>
                <p className="work-card__desc" data-edit={`works.${w.id}.desc`}>
                  {w.desc}
                </p>
                <p className="work-card__note" data-edit={`works.${w.id}.note`}>
                  {w.note}
                </p>
              </div>
            </article>
          ))}
        </div>

        <button className="works__arrow works__arrow--next" onClick={() => scrollBy(640)} aria-label="向右滚动">
          →
        </button>

        <p className="works__hint">滚动鼠标滚轮或按住拖拽横向浏览 · 点击图片放大查看</p>
      </div>

      {/* 点击放大（灯箱） */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <div className="lightbox__card" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setSelected(null)} aria-label="关闭">
              ×
            </button>
            <img className="lightbox__img" src={selected.image} alt={selected.title} />
            <div className="lightbox__info">
              <div className="work-card__tags">
                <span className="work-card__cat">{selected.category}</span>
                <span className="work-card__year">{selected.year}</span>
              </div>
              <h3 className="lightbox__title">{selected.title}</h3>
              <p className="lightbox__note">{selected.note}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
