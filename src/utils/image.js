/**
 * 把用户选择的图片压缩后转成 dataURL，避免超大图撑爆浏览器存储。
 * 长边压缩到 maxSize（默认 1600px），保持原格式（PNG 透明/JPEG 照片均不丢）。
 */
export function fileToDataUrl(file, maxSize = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('图片解析失败'))
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
          const w = Math.max(1, Math.round(img.width * scale))
          const h = Math.max(1, Math.round(img.height * scale))
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          // 保持透明通道
          if (file.type === 'image/png' || file.type === 'image/webp') {
            ctx.clearRect(0, 0, w, h)
          } else {
            ctx.fillStyle = '#0a0c10'
            ctx.fillRect(0, 0, w, h)
          }
          ctx.drawImage(img, 0, 0, w, h)
          const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
          const url = canvas.toDataURL(mime, quality)
          resolve(url)
        } catch (e) {
          reject(e)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
