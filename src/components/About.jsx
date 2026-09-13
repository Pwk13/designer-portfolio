import { useState } from 'react'
import { useEdit } from '../context/EditContext'
import Reveal from './Reveal'
import useCountUp from '../hooks/useCountUp'

function Stat({ item, index }) {
  const [value, ref] = useCountUp(item.value)
  return (
    <div className="stat" ref={ref}>
      <div className="stat__num">
        <span className="stat__value" data-edit={`stats.${index}.value`}>
          {value}
        </span>
        <span className="stat__suffix" data-edit={`stats.${index}.suffix`}>
          {item.suffix}
        </span>
      </div>
      <span className="stat__label" data-edit={`stats.${index}.label`}>
        {item.label}
      </span>
    </div>
  )
}

/** 个人经历模块：个人介绍 + 项目数据（潮流角色在背景中行走，悬停打招呼） */
export default function About() {
  const { profile } = useEdit()
  const [greet, setGreet] = useState(false)

  return (
    <div className="about">
      {/* 潮流角色在背景中行走；鼠标悬停时停步挥手打招呼 */}
      <div
        className={`about__walker${greet ? ' is-greet' : ''}`}
        onMouseEnter={() => setGreet(true)}
        onMouseLeave={() => setGreet(false)}
      >
        <span className="about__walker-shadow" />
        <span className="about__walker-hello" data-edit="walker.hello">
          {profile.walker.hello}
        </span>
        <img className="about__walker-img" src={profile.walker.img1} alt="" data-edit-img="walker.img1" />
        <img
          className="about__walker-img about__walker-img--b"
          src={profile.walker.img2}
          alt=""
          data-edit-img="walker.img2"
        />
        <img className="about__walker-wave" src={profile.walker.wave} alt="" data-edit-img="walker.wave" />
      </div>

      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">ABOUT / 关于我</span>
          <h2 className="section-title">
            用视觉语言，让品牌<em>被看见</em>
          </h2>
        </Reveal>

        <div className="about__body">
          <Reveal delay={60}>
            <p className="about__greet">
              <span className="about__hi">
                你好，我是 <b data-edit="name">{profile.name}</b>
              </span>
              <span className="about__role" data-edit="roleEn">
                {profile.roleEn}
              </span>
            </p>
          </Reveal>

          {profile.intro.map((p, i) => (
            <Reveal key={i} delay={120 + i * 80} as="p" className="about__text">
              <span data-edit={`intro.${i}`}>{p}</span>
            </Reveal>
          ))}

          <Reveal delay={300} as="p" className="about__signature">
            <span data-edit="signature">{profile.signature}</span>
          </Reveal>

          <Reveal delay={380}>
            <button
              className="btn btn--ghost"
              onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              查看代表作品
              <span className="btn__arrow">→</span>
            </button>
          </Reveal>
        </div>

        {/* 项目数据 */}
        <Reveal className="about__stats" delay={120}>
          {profile.stats.map((s, i) => (
            <Stat key={s.label} item={s} index={i} />
          ))}
        </Reveal>
      </div>
    </div>
  )
}
