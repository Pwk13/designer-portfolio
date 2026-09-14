import { useEffect, useRef, useState } from 'react'
import { useEdit } from '../context/EditContext'
import Reveal from './Reveal'

/** 项目展示模块：横屏平滑滚动作品墙 + 点击放大 + 设计说明 + 编辑增删 */
export default function Works() {
  const { profile, editMode, removeWork, addCategory, addWork } = useEdit()
  const [filter, setFilter] = useState('全部')
  const [selected, setSelected] = useState(null) // 点击放大的作品
  const [addOpen, setAddOpen] = useState(false) // 添加作品弹窗
  const [form, setForm] = useState({ image: '', title: '', category: '', year: '', desc: '', note: '' })
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const fileRef = useRef(null)

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

  /* 进入页面第一时间后台预加载全部作品图（滚到作品区时已缓存，立即显示） */
  useEffect(() => {
    const urls = profile.works
      .map((w) => w.image)
      .filter((u) => typeof u === 'string' && u.startsWith('http'))
    const preload = () => {
      urls.forEach((u) => {
        const im = new Image()
        im.src = u
      })
    }
    let id = null
    if ('requestIdleCallback' in window) {
      id = window.requestIdleCallback(preload, { timeout: 1500 })
    } else {
      id = setTimeout(preload, 250)
    }
    return () => {
      if (id !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(id)
        else clearTimeout(id)
      }
    }
  }, [profile.works])

  /* Esc 关闭放大 */
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const scrollBy = (dx) => trackRef.current?.scrollBy({ left: dx, behavior: 'smooth' })

  /* 灯箱：滚轮缩放 + 放大后拖拽平移 */
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const dragRef = useRef(null)

  useEffect(() => {
    if (!selected) return
    const onWheel = (e) => {
      if (!e.target.closest || !e.target.closest('.lightbox')) return
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
      zoomRef.current = Math.min(5, Math.max(0.5, zoomRef.current * factor))
      setZoom(zoomRef.current)
    }
    document.addEventListener('wheel', onWheel, { passive: false })
    return () => document.removeEventListener('wheel', onWheel)
  }, [selected])

  const openLightbox = (w) => {
    if (editMode) return
    zoomRef.current = 1
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelected(w)
  }

  const onStageDown = (e) => {
    if (zoomRef.current <= 1.01) return
    dragRef.current = { sx: e.clientX - pan.x, sy: e.clientY - pan.y }
  }
  const onStageMove = (e) => {
    if (!dragRef.current) return
    const d = dragRef.current
    setPan({ x: e.clientX - d.sx, y: e.clientY - d.sy })
  }
  const onStageUp = () => {
    dragRef.current = null
  }
  const resetZoom = () => {
    zoomRef.current = 1
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const onAddCategory = () => {
    const name = (window.prompt('新分类名称：') || '').trim()
    if (!name) return
    addCategory(name)
  }

  /* 本地图片 → 压缩后 dataURL（控制体积，避免撑爆 localStorage） */
  const onPickFile = (e) => {
    const f = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const MAX = 1000
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const isPng = (f.type || '').includes('png')
        const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.82)
        setForm((p) => ({ ...p, image: dataUrl }))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(f)
  }

  const openAdd = () => {
    setForm({ image: '', title: '', category: filter === '全部' ? '' : filter, year: String(new Date().getFullYear()), desc: '', note: '' })
    setAddOpen(true)
  }

  const submitAdd = () => {
    if (!form.title.trim()) return alert('请填写作品名称')
    if (!form.image.trim()) return alert('请选择或填写作品图片')
    addWork({
      id: `w-${Date.now()}`,
      image: form.image,
      title: form.title.trim(),
      category: form.category.trim() || '作品',
      year: form.year.trim() || String(new Date().getFullYear()),
      desc: form.desc.trim() || '新作品简介',
      note: form.note.trim() || '',
    })
    setAddOpen(false)
    // 若新增了自定义分类，自动补进分类列表
    const cat = form.category.trim()
    if (cat && !profile.categories.includes(cat)) addCategory(cat)
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
          {list.map((w, i) => (
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
                <img
                  src={w.image}
                  alt={w.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  data-edit-img={`works.${w.id}.image`}
                  onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                />
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

          {/* 编辑模式：每类作品末尾的「添加作品」卡片 */}
          {editMode && (
            <button className="work-card work-card--add" onClick={openAdd} title="添加作品">
              <span className="work-card--add__plus">＋</span>
              <span className="work-card--add__text">添加作品</span>
              <span className="work-card--add__hint">图片 · 标题 · 分类 · 说明</span>
            </button>
          )}
        </div>

        <button className="works__arrow works__arrow--next" onClick={() => scrollBy(640)} aria-label="向右滚动">
          →
        </button>

        <p className="works__hint">滚动鼠标滚轮或按住拖拽横向浏览 · 点击图片放大查看</p>
      </div>

      {/* 点击放大（灯箱）：滚轮缩放 / 拖拽平移 / 双击复原 */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <div className="lightbox__card" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setSelected(null)} aria-label="关闭">
              ×
            </button>
            <div
              className="lightbox__stage"
              onPointerDown={onStageDown}
              onPointerMove={onStageMove}
              onPointerUp={onStageUp}
              onPointerLeave={onStageUp}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                className="lightbox__img"
                src={selected.image}
                alt={selected.title}
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                onDoubleClick={resetZoom}
                draggable={false}
              />
              <span className="lightbox__zoom" aria-hidden="true">
                {Math.round(zoom * 100)}%
              </span>
              <span className="lightbox__tip" aria-hidden="true">
                滚轮缩放 · 拖拽查看细节 · 双击复原
              </span>
            </div>
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

      {/* 添加作品弹窗 */}
      {addOpen && (
        <div className="addwork" onClick={() => setAddOpen(false)} role="dialog" aria-modal="true">
          <div className="addwork__card" onClick={(e) => e.stopPropagation()}>
            <button className="addwork__close" onClick={() => setAddOpen(false)} aria-label="关闭">
              ×
            </button>
            <div className="addwork__head">
              <span className="addwork__tag">ADD WORK</span>
              <h3 className="addwork__title">添加作品</h3>
            </div>

            {/* 图片：点击预览区选择本地文件，或填写图片链接 */}
            <div className="addwork__img" onClick={() => fileRef.current?.click()} title="点击选择本地图片">
              {form.image ? (
                <img src={form.image} alt="预览" />
              ) : (
                <span className="addwork__img-placeholder">＋ 点击选择图片</span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickFile} />
            <input
              className="addwork__field"
              placeholder="或直接粘贴图片链接（https://…）"
              value={form.image.startsWith('data:') ? '' : form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
            />

            <div className="addwork__row">
              <input
                className="addwork__field"
                placeholder="作品名称 *"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
              <input
                className="addwork__field addwork__field--sm"
                placeholder="年份"
                value={form.year}
                onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
              />
            </div>

            <div className="addwork__row">
              <input
                className="addwork__field"
                list="addwork-cats"
                placeholder="分类（可选已有或输入新分类）"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              />
              <datalist id="addwork-cats">
                {profile.categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <input
              className="addwork__field"
              placeholder="一句话简介"
              value={form.desc}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
            />
            <textarea
              className="addwork__field addwork__field--area"
              placeholder="设计说明（200 字以内，可留空）"
              rows={3}
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />

            <div className="addwork__actions">
              <button className="btn btn--ghost" onClick={() => setAddOpen(false)}>
                取消
              </button>
              <button className="btn btn--primary" onClick={submitAdd}>
                添加作品
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
