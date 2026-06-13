import { useState, useEffect } from 'react'
import styles from './Todo.module.css'

const CATS = ['Personal','Work','Study','Health','Shopping','Other']

export default function EditModal({ todo }) {
  const { editingTask, setEditingTask, saveEdit } = todo
  const [form, setForm] = useState({ ...editingTask })

  useEffect(() => setForm({ ...editingTask }), [editingTask])

  function handleSave() {
    if (!form.text.trim()) return
    saveEdit(form)
  }

  return (
    <div className={styles.overlay} onClick={e=>e.target===e.currentTarget&&setEditingTask(null)}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>✏️ Edit Task</h3>
          <button className={styles.modalClose} onClick={()=>setEditingTask(null)}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.mGroup}>
            <label>Task Title</label>
            <input className={styles.mInput} value={form.text} maxLength={200} autoFocus
              onChange={e=>setForm(f=>({...f,text:e.target.value}))}
              onKeyDown={e=>e.key==='Enter'&&handleSave()}/>
          </div>
          <div className={styles.mRow}>
            <div className={styles.mGroup}>
              <label>Priority</label>
              <select className={styles.mInput} value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                <option value="high">🔴 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div className={styles.mGroup}>
              <label>Category</label>
              <select className={styles.mInput} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.mGroup}>
            <label>Due Date &amp; Time</label>
            <input type="datetime-local" className={styles.mInput} value={form.due||''}
              onChange={e=>setForm(f=>({...f,due:e.target.value||null}))}/>
          </div>
          <div className={styles.mGroup}>
            <label>Notes</label>
            <textarea className={styles.mInput} rows={3} placeholder="Optional note…"
              value={form.notes||''} maxLength={200}
              onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={()=>setEditingTask(null)}>Cancel</button>
          <button className={styles.btnSave}   onClick={handleSave}>✓ Save Changes</button>
        </div>
      </div>
    </div>
  )
}
