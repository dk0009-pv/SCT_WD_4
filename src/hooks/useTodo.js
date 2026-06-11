// src/hooks/useTodo.js
import { useState, useEffect, useCallback, useMemo } from 'react'

const KEY = 'sct_wd4_react'

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

export default function useTodo() {
  const [tasks,        setTasks]        = useState([])
  const [activeCat,    setActiveCat]    = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [search,       setSearch]       = useState('')
  const [sort,         setSort]         = useState('created')
  const [editingTask,  setEditingTask]  = useState(null)
  const [theme,        setTheme]        = useState('dark')

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setTasks(JSON.parse(r)) } catch {}
    const t = localStorage.getItem('sct_wd4_theme') || 'dark'
    setTheme(t)
    document.body.className = t === 'light' ? 'light' : ''
  }, [])

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(tasks)) }, [tasks])

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('sct_wd4_theme', next)
      document.body.className = next === 'light' ? 'light' : ''
      return next
    })
  }, [])

  const addTask = useCallback(({ text, priority, category, due, notes }) => {
    if (!text.trim()) return false
    setTasks(p => [{ id:uid(), text:text.trim(), priority:priority||'medium',
      category:category||'Personal', due:due||null, notes:notes?.trim()||null,
      done:false, created:Date.now() }, ...p])
    return true
  }, [])

  const toggleDone  = useCallback((id) => setTasks(p => p.map(t => t.id===id ? {...t,done:!t.done} : t)), [])
  const deleteTask  = useCallback((id) => setTasks(p => p.filter(t => t.id!==id)), [])
  const saveEdit    = useCallback((u)  => { setTasks(p => p.map(t => t.id===u.id ? {...t,...u} : t)); setEditingTask(null) }, [])
  const clearDone   = useCallback(()  => setTasks(p => p.filter(t => !t.done)), [])
  const isOverdue   = (t) => !t.done && t.due && new Date(t.due) < new Date()

  const stats = useMemo(() => {
    const done    = tasks.filter(t => t.done).length
    const overdue = tasks.filter(t => isOverdue(t)).length
    const catCounts = {}
    tasks.forEach(t => { catCounts[t.category] = (catCounts[t.category]||0)+1 })
    return { total:tasks.length, done, pending:tasks.length-done, overdue,
             pct: tasks.length ? Math.round((done/tasks.length)*100) : 0, catCounts }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const w = { high:0, medium:1, low:2 }
    let list = [...tasks]
    if (activeCat !== 'all')          list = list.filter(t => t.category === activeCat)
    if (activeFilter === 'active')    list = list.filter(t => !t.done)
    if (activeFilter === 'completed') list = list.filter(t =>  t.done)
    if (activeFilter === 'overdue')   list = list.filter(t => isOverdue(t))
    const q = search.toLowerCase()
    if (q) list = list.filter(t => t.text.toLowerCase().includes(q) || (t.notes&&t.notes.toLowerCase().includes(q)))
    list.sort((a,b) => {
      if (sort==='priority') return w[a.priority]-w[b.priority]
      if (sort==='due')      return (a.due||'z').localeCompare(b.due||'z')
      if (sort==='alpha')    return a.text.localeCompare(b.text)
      return b.created-a.created
    })
    return list
  }, [tasks, activeCat, activeFilter, search, sort])

  return { tasks, visibleTasks, stats, activeCat, setActiveCat, activeFilter,
    setActiveFilter, search, setSearch, sort, setSort, editingTask, setEditingTask,
    theme, toggleTheme, addTask, toggleDone, deleteTask, saveEdit, clearDone, isOverdue }
}
