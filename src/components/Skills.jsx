import { useEffect, useRef, useState } from 'react'
import { useEdit } from '../context/EditContext'
import Reveal from './Reveal'

/* ---------- 能力雷达图（纯 SVG 绘制） ---------- */
function Radar({ data }) {
  const SIZE = 380
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R = 128
  const n = data.length

  const angle = (i) => ((-90 + (360 / n) * i) * Math.PI) / 180
  const point = (i, r) => [CX + r * Math.cos(angle(i)), CY + r * Math.sin(angle(i))]
  const poly = (r) => Array.from({ length: n }, (_, i) => point(i, r).join(',')).join(' ')

  const dataPoints = data.map((d, i) => point(i, (R * d.value) / 100))
  const dataPoly = dataPoints.map((p) => p.join(',')).join(' ')

  return (
    <svg className="radar" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="能力模型雷达图">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b6ff3a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4fe0b8" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* 网格 */}
      {[0.25, 0.5, 0.75, 1].map((lv) => (
        <polygon key={lv} points={poly(R * lv)} className="radar__grid" />
      ))}
      {/* 轴线 */}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="radar__axis" />
      })}

      {/* 数据区 */}
      <polygon points={dataPoly} className="radar__fill" />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.6" className="radar__dot" />
      ))}

      {/* 标签 */}
      {data.map((d, i) => {
        const lx = CX + (R + 30) * Math.cos(angle(i))
        const ly = CY + (R + 30) * Math.sin(angle(i))
        const anchor = lx < CX - 26 ? 'end' : lx > CX + 26 ? 'start' : 'middle'
        const baseline = ly < CY - 34 ? 'hanging' : ly > CY + 34 ? 'auto' : 'middle'
        return (
          <text
            key={d.name}
            x={lx}
            y={ly}
            className="radar__label"
            textAnchor={anchor}
            dominantBaseline={baseline}
          >
            {d.name}
            <tspan className="radar__label-val"> {d.value}</tspan>
          </text>
        )
      })}
    </svg>
  )
}

/* ---------- 能力进度条 ---------- */
function SkillBar({ skill, delay, index }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="skill-bar" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <div className="skill-bar__head">
        <span className="skill-bar__name" data-edit={`skills.${index}.name`}>
          {skill.name}
        </span>
        <span className="skill-bar__value" data-edit={`skills.${index}.value`}>
          {skill.value}%
        </span>
      </div>
      <div className="skill-bar__track">
        <div
          className="skill-bar__fill"
          style={{ width: on ? `${skill.value}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  )
}

/** 个人优势模块：能力可视化（雷达图 + 进度条 + 工具栈） */
export default function Skills() {
  const { profile } = useEdit()
  const tiltRef = useRef(null)

  /* 能力卡 3D 倾斜 + 高光跟随（鼠标移动） */
  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(900px) rotateY(${(px * 9).toFixed(2)}deg) rotateX(${(-py * 9).toFixed(2)}deg)`
      el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`)
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="skills">
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">CAPABILITIES / 个人优势</span>
          <h2 className="section-title">
            能力<em>可视化</em>
          </h2>
        </Reveal>

        <div className="skills__grid">
          <Reveal className="skills__radar-box" delay={100}>
            <div className="skills__tilt" ref={tiltRef}>
              <div className="skills__box-title">
                <span>能力模型</span>
                <span className="skills__box-en">SKILL MATRIX</span>
              </div>
              <Radar data={profile.skills} />
            </div>
          </Reveal>

          <div className="skills__right">
            <Reveal className="skills__bars" delay={120}>
              {profile.skills.map((s, i) => (
                <SkillBar key={s.name} skill={s} delay={i * 90} index={i} />
              ))}
            </Reveal>

            <Reveal className="skills__tools" delay={220}>
              <span className="skills__tools-label">常用工具 / TOOLS</span>
              <div className="skills__chips">
                {profile.tools.map((t, i) => (
                  <span key={t} className="skills__chip" data-edit={`tools.${i}`}>
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
