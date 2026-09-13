import { useEffect, useState } from 'react'
import { useEdit } from '../context/EditContext'
import Reveal from './Reveal'
import useCountUp from '../hooks/useCountUp'

/* ---------- 详情弹窗元信息 ---------- */
const DETAIL_META = {
  internships: {
    en: 'INTERNSHIPS',
    title: '行业实习经历',
    hint: '3 段商业项目实战',
  },
  journey: {
    en: 'JOURNEY',
    title: '视觉传达学习',
    hint: '3 年系统成长',
  },
  courses: {
    en: 'CORE COURSES',
    title: '核心专业课程',
    hint: '9 门专业必修',
  },
  directions: {
    en: 'WORK DIRECTIONS',
    title: '作品方向',
    hint: '5 类创作方向',
  },
}

/* ---------- 详情弹窗（点击统计卡片弹出） ---------- */
function DetailModal({ type, profile, onClose }) {
  const d = profile.detail || {}

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
    }
  }, [onClose])

  const meta = DETAIL_META[type]

  return (
    <div className="detail-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="detail-modal__card" onClick={(e) => e.stopPropagation()}>
        <header className="detail-modal__head">
          <div className="detail-modal__kicker">
            <span className="detail-modal__en">{meta.en}</span>
            <span className="detail-modal__hint">{meta.hint}</span>
          </div>
          <h3 className="detail-modal__title">{meta.title}</h3>
          <button className="detail-modal__close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </header>

        <div className="detail-modal__body">
          {/* 实习经历：时间线列表 */}
          {type === 'internships' &&
            d.internships?.map((it, i) => (
              <article className="exp-row" key={i}>
                <span className="exp-row__time" data-edit={`detail.internships.${i}.time`}>
                  {it.time}
                </span>
                <div className="exp-row__main">
                  <h4>
                    <span className="exp-row__org" data-edit={`detail.internships.${i}.org`}>
                      {it.org}
                    </span>
                    <span className="exp-row__role" data-edit={`detail.internships.${i}.role`}>
                      {it.role}
                    </span>
                  </h4>
                  <p data-edit={`detail.internships.${i}.desc`}>{it.desc}</p>
                </div>
              </article>
            ))}

          {/* 视觉传达学习：三年时间线 */}
          {type === 'journey' &&
            d.journey?.map((j, i) => (
              <article className="jny-row" key={i}>
                <span className="jny-row__badge">
                  <span className="jny-row__year" data-edit={`detail.journey.${i}.year`}>
                    {j.year}
                  </span>
                  <span className="jny-row__en" data-edit={`detail.journey.${i}.en`}>
                    {j.en}
                  </span>
                </span>
                <div className="jny-row__main">
                  <h4 className="jny-row__stage" data-edit={`detail.journey.${i}.stage`}>
                    {j.stage}
                  </h4>
                  <p data-edit={`detail.journey.${i}.desc`}>{j.desc}</p>
                </div>
              </article>
            ))}

          {/* 九门核心课程：网格 */}
          {type === 'courses' && (
            <div className="course-grid">
              {d.courses?.map((c, i) => (
                <div className="course-cell" key={i}>
                  <span className="course-cell__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="course-cell__name" data-edit={`detail.courses.${i}`}>
                    {c}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 五类作品方向：卡片 */}
          {type === 'directions' && (
            <div className="dir-grid">
              {d.directions?.map((dir, i) => (
                <article className="dir-card" key={i}>
                  <img className="dir-card__img" src={dir.image} alt={dir.name} data-edit-img={`detail.directions.${i}.image`} />
                  <div className="dir-card__info">
                    <span className="dir-card__no">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="dir-card__name" data-edit={`detail.directions.${i}.name`}>
                      {dir.name}
                    </h4>
                    <span className="dir-card__en" data-edit={`detail.directions.${i}.en`}>
                      {dir.en}
                    </span>
                    <p className="dir-card__desc" data-edit={`detail.directions.${i}.desc`}>
                      {dir.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- 项目数据卡片（点击展开详情） ---------- */
function Stat({ item, index, onClick, editMode }) {
  const [value, ref] = useCountUp(item.value)
  return (
    <button
      type="button"
      className="stat"
      ref={ref}
      onClick={() => !editMode && onClick(item.key)}
      aria-haspopup="dialog"
    >
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
      <span className="stat__more">
        查看详情 <b>↳</b>
      </span>
    </button>
  )
}

/** 个人经历模块：个人介绍 + 项目数据（潮流角色在背景中行走，悬停打招呼） */
export default function About() {
  const { profile, editMode } = useEdit()
  const [greet, setGreet] = useState(false)
  const [detailType, setDetailType] = useState(null)

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

        {/* 项目数据（点击卡片可展开详情） */}
        <Reveal className="about__stats" delay={120}>
          {profile.stats.map((s, i) => (
            <Stat key={s.label} item={s} index={i} onClick={setDetailType} editMode={editMode} />
          ))}
        </Reveal>
        <p className="about__stats-hint">点击数字卡片，展开对应详情</p>
      </div>

      {/* 详情弹窗 */}
      {detailType && <DetailModal type={detailType} profile={profile} onClose={() => setDetailType(null)} />}
    </div>
  )
}
