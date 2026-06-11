// src/components/MainArea.jsx
import { useState } from 'react'
import TaskItem from './TaskItem'
import styles   from './Todo.module.css'

const CATS    = ['Personal','Work','Study','Health','Shopping','Other']
const CAT_EMO = { Personal:'👤', Work:'💼', Study:'📚', Health:'❤️', Shopping:'🛒', Other:'📌' }
const FILTERS = ['all','active','completed','overdue']

export default function MainArea({ todo }) {
  const { visibleTasks, activeCat, activeFilter, setActiveFilter,
          search, setSearch, sort, setSort,
          addTask, toggleDone, deleteTask, setEditingTask, clearDone, isOverdue } = todo

  const [form,  setForm]  = useState({ text:'', priority:'medium', category:'Personal', due:'', notes:'' })
  const [shake, setShake] = useState(false)

  function handleAdd() {
    const ok = addTask(form)
    if (!ok) { setShake(true); setTimeout(()=>setShake(false),500); return }
    setForm({ text:'', priority:'medium', category:'Personal', due:'', notes:'' })
  }

  const showGroups = activeCat==='all' && activeFilter!=='overdue' && !search
  const groups = {}
  if (showGroups) visibleTasks.forEach(t => { if (!groups[t.category]) groups[t.category]=[]; groups[t.category].push(t) })

  const today = new Date().toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <main className={styles.main}>
      {/* Header */}
      <div className={styles.mainHeader}>
        <div>
          <h1 className={styles.mainTitle}>{activeCat==='all' ? 'All Tasks' : activeCat}</h1>
          <p className={styles.mainDate}>{today}</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input className={styles.searchInput} placeholder="Search tasks…" value={search}
              onChange={e=>setSearch(e.target.value)}/>
            {search && <button className={styles.searchClear} onClick={()=>setSearch('')}>✕</button>}
          </div>
          <select className={styles.sortSelect} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="created">Newest</option>
            <option value="priority">Priority</option>
            <option value="due">Due Date</option>
            <option value="alpha">A → Z</option>
          </select>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.filterRow}>
        {FILTERS.map(f => (
          <button key={f}
            className={`${styles.filterTab} ${activeFilter===f ? styles.filterActive:''}`}
            onClick={()=>setActiveFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
        <button className={styles.clearDoneBtn} onClick={clearDone}>🧹 Clear Done</button>
      </div>

      {/* Add form */}
      <div className={`${styles.addForm} ${shake ? styles.shake:''}`}>
        <div className={styles.addRow}>
          <div className={styles.addInputWrap}>
            <span className={styles.addIcon}>+</span>
            <input className={styles.addInput} placeholder="Add a new task…"
              value={form.text} maxLength={200}
              onChange={e=>setForm(f=>({...f,text:e.target.value}))}
              onKeyDown={e=>e.key==='Enter'&&handleAdd()}/>
          </div>
          <button className={styles.addBtn} onClick={handleAdd}>+ Add Task</button>
        </div>
        <div className={styles.metaRow}>
          <select className={styles.metaSel} value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
            <option value="high">🔴 High Priority</option>
            <option value="medium">⚡ Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>
          <select className={styles.metaSel} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            {CATS.map(c=><option key={c} value={c}>{CAT_EMO[c]} {c}</option>)}
          </select>
          <input type="datetime-local" className={styles.metaSel} value={form.due}
            onChange={e=>setForm(f=>({...f,due:e.target.value}))}/>
          <input type="text" className={styles.metaSel} placeholder="Optional note…"
            value={form.notes} maxLength={200}
            onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
        </div>
      </div>

      {/* Task list */}
      <div className={styles.taskList}>
        {visibleTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📋</span>
            <h3>{search ? 'No results found' : 'No tasks here'}</h3>
            <p>{search ? `Nothing matches "${search}"` : 'Add a task above to get started.'}</p>
          </div>
        ) : showGroups ? (
          Object.entries(groups).map(([cat, items]) => (
            <div key={cat}>
              <div className={styles.groupHeader}>
                <span className={styles.groupLabel}>{CAT_EMO[cat]} {cat}</span>
                <span className={styles.groupCount}>{items.length}</span>
              </div>
              {items.map(t=>(
                <TaskItem key={t.id} task={t} isOverdue={isOverdue(t)}
                  onToggle={()=>toggleDone(t.id)}
                  onEdit={()=>setEditingTask(t)}
                  onDelete={()=>deleteTask(t.id)}/>
              ))}
            </div>
          ))
        ) : (
          visibleTasks.map(t=>(
            <TaskItem key={t.id} task={t} isOverdue={isOverdue(t)}
              onToggle={()=>toggleDone(t.id)}
              onEdit={()=>setEditingTask(t)}
              onDelete={()=>deleteTask(t.id)}/>
          ))
        )}
      </div>
    </main>
  )
}
