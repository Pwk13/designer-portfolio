import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { profile as defaults } from '../data/profile'

const STORAGE_KEY = 'portfolio-edit-v1'
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
function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function EditProvider({ children }) {
  const [overrides, setOverrides] = useState(loadOverrides)
  const [editMode, setEditMode] = useState(false)
  const profileRef = useRef(defaults)
  const profile = useMemo(() => mergeOverrides(defaults, overrides), [overrides])
  profileRef.current = profile

  const save = useCallback((path, value) => {
    setOverrides((prev) => {
      const next = { ...prev, [path]: value }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        alert('浏览器存储空间不足：请先点「导出修改」保存到文件，再删除部分图片修改。')
      }
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setOverrides({})
  }, [])

  const importJSON = useCallback((text) => {
    try {
      const data = JSON.parse(text)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setOverrides(data)
      return true
    } catch {
      return false
    }
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'portfolio-edit.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }, [overrides])

  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      alert('浏览器存储空间不足：请先点「导出修改」保存到文件，再删除部分图片修改。')
    }
    return next
  }

  /* 添加作品：以当前（含已修改的）作品列表为基准追加 */
  const addWork = useCallback((work) => {
    setOverrides((prev) => persist({ ...prev, works: [...profileRef.current.works, work] }))
  }, [])

  /* 删除作品：移除对应作品，并清理该作品残留的单点修改 */
  const removeWork = useCallback((id) => {
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
      return persist(next)
    })
  }, [])

  /* 添加作品分类（去重） */
  const addCategory = useCallback((name) => {
    const list = [...profileRef.current.categories]
    if (!list.includes(name)) list.push(name)
    setOverrides((prev) => persist({ ...prev, categories: list }))
  }, [])

  /* 编辑模式下的全局交互：文字就地编辑 / 图片点击更换 */
  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode)
    if (!editMode) return

    const openFile = (el) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = () => {
        const f = input.files && input.files[0]
        if (!f) return
        const reader = new FileReader()
        reader.onload = () => save(el.dataset.editImg, reader.result)
        reader.readAsDataURL(f)
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
      e.preventDefault()
      e.stopPropagation()
      makeEditable(el)
    }

    const onKeyEsc = (e) => {
      if (e.key === 'Escape') setEditMode(false)
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyEsc)
    return () => {
      document.body.classList.remove('edit-mode')
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyEsc)
    }
  }, [editMode, save])

  const value = useMemo(
    () => ({ profile, editMode, setEditMode, save, resetAll, exportJSON, importJSON, addWork, removeWork, addCategory }),
    [profile, editMode, save, resetAll, exportJSON, importJSON, addWork, removeWork, addCategory],
  )

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}

export function useEdit() {
  return useContext(EditContext)
}
