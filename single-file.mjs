/**
 * 生成"双击即可查看"的单文件版网站
 * 用法：node single-file.mjs
 * 产出：dist-single/index.html（JS/CSS 内联 + 相对路径资源）
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, 'dist')
const outDir = join(__dirname, 'dist-single')

let html = readFileSync(join(distDir, 'index.html'), 'utf8')

// 1) 内联 CSS
html = html.replace(
  /<link rel="stylesheet"[^>]*href="(?:\.\/)?assets\/([^"]+\.css)"[^>]*>/g,
  (_m, href) => {
    const css = readFileSync(join(distDir, 'assets', href), 'utf8')
      // CSS 内相对引用改为本地相对路径（file:// 可用）
      .replace(/url\(\s*['"]?\/assets\//g, "url('./assets/")
    return `<style>${css}</style>`
  },
)

// 2) 内联 JS（保留 type="module"：内联 module 在 file:// 下可执行）
html = html.replace(
  /<script type="module"[^>]*src="(?:\.\/)?assets\/([^"]+\.js)"[^>]*><\/script>/g,
  (_m, href) => {
    let js = readFileSync(join(distDir, 'assets', href), 'utf8')
    // 防止 </script> 提前闭合（在 JS 字符串中 '</' 转义后语义不变）
    js = js.replace(/<\/script/gi, '<\\/script')
    return `<script type="module">${js}</script>`
  },
)

// 3) 其余 /assets/ 绝对路径 → 相对路径（含 CSS 中可能残留的引用）
html = html.replace(/(src|href)=["']\/assets\//g, '$1="./assets/')

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'index.html'), html)
console.log('index.html written:', (html.length / 1024).toFixed(0) + ' KB')

// 4) 复制 assets（排除已内联的 js/css）
if (existsSync(join(distDir, 'assets'))) {
  const srcDir = join(distDir, 'assets')
  const dstDir = join(outDir, 'assets')
  const copyDir = (s, d) => {
    mkdirSync(d, { recursive: true })
    for (const entry of readdirSync(s)) {
      const sp = join(s, entry)
      const dp = join(d, entry)
      if (statSync(sp).isDirectory()) copyDir(sp, dp)
      else if (!/\.(js|css)$/.test(entry)) cpSync(sp, dp)
    }
  }
  copyDir(srcDir, dstDir)
}
console.log('assets copied (images/video kept, js/css inlined)')
