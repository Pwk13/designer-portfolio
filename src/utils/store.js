/**
 * 编辑数据持久化：优先 IndexedDB（容量大，可存多张压缩后的作品图），
 * 失败时自动降级到 localStorage；读取时若 IndexedDB 无数据会迁移旧 localStorage 数据。
 */
const DB_NAME = 'portfolio-edit-db'
const STORE_NAME = 'kv'
const LS_KEY = 'portfolio-edit-v1'

let _dbPromise = null

function openDb() {
  if (_dbPromise) return _dbPromise
  _dbPromise = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME)
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    } catch (e) {
      reject(e)
    }
  })
  return _dbPromise
}

export async function storeGet(key) {
  try {
    const db = await openDb()
    const value = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const rq = tx.objectStore(STORE_NAME).get(key)
      rq.onsuccess = () => resolve(rq.result)
      rq.onerror = () => reject(rq.error)
    })
    return value
  } catch {
    // 降级读 localStorage
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : undefined
    } catch {
      return undefined
    }
  }
}

export async function storeSet(key, value) {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(value, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    return true
  } catch {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }
}

export async function storeRemove(key) {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }
}

/** 迁移旧 localStorage 数据到 IndexedDB（仅当 IDB 中还没有数据时） */
export async function migrateLegacy() {
  try {
    const idbValue = await storeGet(LS_KEY)
    if (idbValue !== undefined) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      await storeSet(LS_KEY, parsed)
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore */
  }
}

export const LS_KEY_EDIT = LS_KEY
