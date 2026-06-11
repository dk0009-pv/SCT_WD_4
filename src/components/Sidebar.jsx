// src/components/Sidebar.jsx
import styles from './Todo.module.css'

const CATS = [
  { key:'all',      label:'All Tasks',  icon:'⊞' },
  { key:'Personal', label:'Personal',   icon:'👤' },
  { key:'Work',     label:'Work',       icon:'💼' },
  { key:'Study',    label:'Study',      icon:'📚' },
  { key:'Health',   label:'Health',     icon:'❤️' },
  { key:'Shopping', label:'Shopping',   icon:'🛒' },
  { key:'Other',    label:'Other',      icon:'📌' },
]

export default function Sidebar({ todo }) {
  const { stats, activeCat, setActiveCat, theme, toggleTheme } = todo
  const getCount = (k) => k==='all' ? stats.total : (stats.catCounts[k]||0)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <div className={styles.logo}>My<span>Tasks</span></div>
        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {theme==='dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><div className={styles.statNum}>{stats.total}</div><div className={styles.statLabel}>Total</div></div>
        <div className={`${styles.statCard} ${styles.statGreen}`}><div className={styles.statNum}>{stats.done}</div><div className={styles.statLabel}>Done</div></div>
        <div className={`${styles.statCard} ${styles.statAmber}`}><div className={styles.statNum}>{stats.pending}</div><div className={styles.statLabel}>Pending</div></div>
        <div className={`${styles.statCard} ${styles.statRed}`}><div className={styles.statNum}>{stats.overdue}</div><div className={styles.statLabel}>Overdue</div></div>
      </div>

      {/* Progress */}
      <div className={styles.progressBlock}>
        <div className={styles.progressRow}>
          <span>Progress</span><strong>{stats.pct}%</strong>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width:`${stats.pct}%` }}/>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.catNav}>
        <p className={styles.navLabel}>Categories</p>
        {CATS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`${styles.catBtn} ${activeCat===key ? styles.catActive : ''}`}
            onClick={() => setActiveCat(key)}
          >
            <span>{icon}</span>
            <span className={styles.catLabel}>{label}</span>
            <span className={styles.catCount}>{getCount(key)}</span>
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>SCT_WD_4 · SkillCraft</div>
    </aside>
  )
}
