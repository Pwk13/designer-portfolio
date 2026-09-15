import { useEdit } from '../context/EditContext'
import { fileToDataUrl } from '../utils/image'

/** 编辑模式浮动工具栏：添加作品 / 添加分类 / 导出 / 导入 / 恢复默认 / 同步到线上 */
export default function EditToolbar() {
  const { profile, editMode, exportJSON, resetAll, importJSON, addWork, addCategory, savedAt, saveFailed } = useEdit()
  if (!editMode) return null

  const pickImage = (cb) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const f = input.files && input.files[0]
      if (!f) return
      try {
        const url = await fileToDataUrl(f, 1600, 0.82)
        cb(url)
      } catch {
        alert('图片处理失败：请换一张图片重试。')
      }
    }
    input.click()
  }

  const onAddWork = () => {
    const title = window.prompt('新作品标题：', '新作品')
    if (!title) return
    const cats = profile.categories.filter((c) => c !== '全部')
    const category = (window.prompt(`作品分类（可填新分类，现有：${cats.join(' / ')}）：`, cats[0] || '品牌') || '品牌').trim()
    if (category && !profile.categories.includes(category)) addCategory(category)
    pickImage((image) => {
      addWork({
        id: 'work-' + Date.now(),
        title: title.trim(),
        category,
        year: '2026',
        desc: '',
        note: '',
        image,
        aspect: 'portrait',
      })
    })
  }

  const onAddCategory = () => {
    const name = (window.prompt('新分类名称：') || '').trim()
    if (!name) return
    addCategory(name)
  }

  const onImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = () => {
      const f = input.files && input.files[0]
      if (!f) return
      const reader = new FileReader()
      reader.onload = () => {
        const ok = importJSON(reader.result)
        alert(ok ? '导入成功：页面已更新为导入内容。' : '文件格式错误：请选择由「导出修改」生成的 JSON 文件。')
      }
      reader.readAsText(f)
    }
    input.click()
  }

  const onSync = () => {
    exportJSON()
    alert('已下载「portfolio-edit.json」。\n\n同步到线上：把这个文件发送给豆包助手，我会帮你重新部署，之后任何人在任何设备打开网站都能看到这些修改。')
  }

  return (
    <div className="edit-toolbar">
      <span className="edit-toolbar__hint">编辑模式：点文字直接改 / 点图片可换 / Enter 保存，Esc 取消</span>
      {saveFailed ? (
        <span className="edit-toolbar__status edit-toolbar__status--err">⚠ 保存失败，请点「导出修改」备份后告诉我</span>
      ) : savedAt ? (
        <span className="edit-toolbar__status">✓ 已自动保存 {new Date(savedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
      ) : (
        <span className="edit-toolbar__status">修改将自动保存在本机浏览器</span>
      )}
      <button onClick={onAddWork}>＋ 添加作品</button>
      <button onClick={onAddCategory}>＋ 添加分类</button>
      <button onClick={exportJSON}>导出修改</button>
      <button onClick={onImport}>导入修改</button>
      <button onClick={onSync} className="edit-toolbar__sync">
        📤 同步到线上
      </button>
      <button
        onClick={() => {
          if (window.confirm('确定恢复默认内容？所有修改将丢失。')) resetAll()
        }}
      >
        恢复默认
      </button>
    </div>
  )
}
