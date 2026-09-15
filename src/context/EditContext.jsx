import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { profile as defaults } from '../data/profile'
import { storeGet, storeSet, storeRemove, migrateLegacy, LS_KEY_EDIT } from '../utils/store'
import { fileToDataUrl } from '../utils/image'

const EditContext = createContext(null)

function deepGet(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}
function deepSet(obj, path, val) {
  const keys = path.split('.')
  let o = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (o[k] == null || typeof o[k] !== 'object') o[k] = {}
    o = o[k]
  }
  o[keys[keys.length - 1]] = val
}
function mergeOverrides(base, over) {
  const out = JSON.parse(JSON.stringify(base))
  Object.entries(over || {}).forEach(([p, v]) => deepSet(out, p, v))
  return out
}

export function EditProvider({ children }) {
  const [overrides, setOverrides] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const profileRef = useRef(defaults)
  const profile = useMemo(() => (loaded ? mergeOverrides(defaults, overrides) : defaults), [overrides, loaded])
  profileRef.current = profile

  // 启动时：迁移旧数据 → 读取持久化修改
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await migrateLegacy()
        const data = await storeGet(LS_KEY_EDIT)
        if (!cancelled) {
          if (data && typeof data === 'object') setOverrides(data)
          setLoaded(true)
        }
      } catch {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /** 写持久化：IndexedDB → localStorage 降级；返回是否成功 */
  const persist = useCallback(async (next) => {
    const ok = await storeSet(LS_KEY_EDIT, next)
    setSaveFailed(!ok)
    if (ok) setSavedAt(Date.now())
    return ok
  }, [])

  const save = useCallback(
    (path, value) => {
      setOverrides((prev) => {
        const next = { ...prev, [path]: value }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const resetAll = useCallback(() => {
    storeRemove(LS_KEY_EDIT)
    setOverrides({})
    setSavedAt(null)
    setSaveFailed(false)
  }, [])

  const importJSON = useCallback(
    (text) => {
      try {
        const data = JSON.parse(text)
        setOverrides(data)
        persist(data)
        return true
      } catch {
        return false
      }
    },
    [persist],
  )

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'portfolio-edit.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }, [overrides])

  /* 添加作品：以当前（含已修改的）作品列表为基准追加 */
  const addWork = useCallback(
    (work) => {
      setOverrides((prev) => {
        const next = { ...prev, works: [...profileRef.current.works, work] }
        persist(next)
        return next
      })
    },
    [persist],
  )

  /* 删除作品：移除对应作品，并清理该作品残留的单点修改 */
  const removeWork = useCallback(
    (id) => {
      setOverrides((prev) => {
        const next = {}
        Object.entries(prev).forEach(([p, v]) => {
          if (p === 'works') {
            next.works = v.filter((w) => w.id !== id)
          } else if (!p.startsWith(`works.${id}.`)) {
            next[p] = v
          }
        })
        if (!next.works) next.works = profileRef.current.works.filter((w) => w.id !== id)
        persist(next)
        return next
      })
    },
    [persist],
  )

  /* 调整作品位置：dir=-1 前移 / dir=1 后移；sameCat=true 时只在同分类内移动（筛选视图），否则按所见顺序相邻交换 */
  const moveWork = useCallback(
    (id, dir, sameCat = false) => {
      setOverrides((prev) => {
        const arr = [...profileRef.current.works]
        const i = arr.findIndex((w) => w.id === id)
        if (i < 0) return prev
        let j = i + dir
        if (sameCat) {
          while (j >= 0 && j < arr.length && arr[j].category !== arr[i].category) j += dir
        }
        if (j < 0 || j >= arr.length) return prev // 已到边界
        const tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
        const next = { ...prev, works: arr }
        persist(next)
        return next
      })
    },
    [persist],
  )

  /* 添加作品分类（去重） */
  const addCategory = useCallback(
    (name) => {
      const list = [...profileRef.current.categories]
      if (!list.includes(name)) list.push(name)
      setOverrides((prev) => {
        const next = { ...prev, categories: list }
        persist(next)
        return next
      })
    },
    [persist],
  )

  /* 编辑模式下的全局交互：文字就地编辑 / 图片点击压缩后替换 */
  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode)
    if (!editMode) return

    const openFile = (el) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async () => {
        const f = input.files && input.files[0]
        if (!f) return
        try {
          const url = await fileToDataUrl(f, 1600, 0.82)
          save(el.dataset.editImg, url)
        } catch {
          alert('图片处理失败：请换一张图片重试。')
        }
      }
      input.click()
    }

    const makeEditable = (el) => {
      el.contentEditable = 'true'
      el.classList.add('editing')
      el.focus()
      // 光标定位到末尾
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)

      const commit = () => {
        el.contentEditable = 'false'
        el.classList.remove('editing')
        let text = (el.textContent || '').replace(/\s+/g, ' ').trim()
        // 数值型字段（能力值、项目数据等以 .value 结尾的路径）存为数字
        const path = el.dataset.edit
        if (/\.value$/.test(path) && !Number.isNaN(Number(text))) text = Number(text)
        save(path, text)
        el.removeEventListener('blur', commit)
        el.removeEventListener('keydown', onKey)
      }
      const onKey = (ev) => {
        if (ev.key === 'Enter' && !ev.shiftKey) {
          ev.preventDefault()
          el.blur()
        }
        if (ev.key === 'Escape') {
          el.textContent = deepGet(profileRef.current, el.dataset.edit)
          el.blur()
        }
      }
      el.addEventListener('blur', commit)
      el.addEventListener('keydown', onKey)
    }

    const onClick = (e) => {
      const imgEl = e.target.closest('[data-edit-img]')
      if (imgEl) {
        e.preventDefault()
        e.stopPropagation()
        openFile(imgEl)
        return
      }
      const el = e.target.closest('[data-edit]')
      if (!el || el.isContentEditable) return
      // 统计卡片（行业实习经历/视觉传达学习/核心专业课程等）交给 React 打开详情弹窗，不在卡片上直接编辑
      if (el.closest('.stat')) return
      e.preventDefault()
      e.stopPropagation()
      makeEditable(el)
    }

    const onKeyEsc = (e) => {
      if (e.key === 'Escape') setEditMode(false)
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyEsc)
    return () => {
      document.body.classList.remove('edit-mode')
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyEsc)
    }
  }, [editMode, save])

  const value = useMemo(
    () => ({ profile, editMode, setEditMode, save, resetAll, exportJSON, importJSON, addWork, removeWork, moveWork, addCategory, savedAt, saveFailed }),
    [profile, editMode, save, resetAll, exportJSON, importJSON, addWork, removeWork, moveWork, addCategory, savedAt, saveFailed],
  )

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}

export function useEdit() {
  return useContext(EditContext)
}
