import styles from './Todo.module.css'

const PRI_LABEL = { high:'🔴 High', medium:'⚡ Medium', low:'🟢 Low' }
const PRI_CLS   = { high:styles.tagHigh, medium:styles.tagMedium, low:styles.tagLow }
const PRI_ITEM  = { high:styles.priHigh, medium:styles.priMedium, low:styles.priLow }

function fmtDate(s) {
  if (!s) return ''
  const d = new Date(s)
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
    + ' · ' + d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
}

export default function TaskItem({ task, isOverdue, onToggle, onEdit, onDelete }) {
  const cls = [
    styles.taskItem,
    PRI_ITEM[task.priority],
    task.done    ? styles.taskDone    : '',
    isOverdue    ? styles.taskOverdue : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      <button className={`${styles.checkbox} ${task.done?styles.checkboxDone:''}`} onClick={onToggle}>
        {task.done && '✓'}
      </button>
      <div className={styles.taskBody}>
        <p className={`${styles.taskTitle} ${task.done?styles.taskStrike:''}`}>{task.text}</p>
        {task.notes && <p className={styles.taskNotes}>{task.notes}</p>}
        <div className={styles.taskTags}>
          <span className={`${styles.tag} ${PRI_CLS[task.priority]}`}>{PRI_LABEL[task.priority]}</span>
          <span className={`${styles.tag} ${styles.tagCat}`}>{task.category}</span>
          {task.due && (
            <span className={`${styles.tag} ${styles.tagDate} ${isOverdue?styles.tagDateOv:''}`}>
              📅 {fmtDate(task.due)}{isOverdue?' · Overdue':''}
            </span>
          )}
        </div>
      </div>
      <div className={styles.taskActions}>
        <button className={styles.actionBtn} onClick={onEdit}>✏️</button>
        <button className={`${styles.actionBtn} ${styles.actionDel}`} onClick={onDelete}>🗑️</button>
      </div>
    </div>
  )
}
