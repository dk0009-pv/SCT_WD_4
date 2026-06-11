import useTodo    from './hooks/useTodo'
import Sidebar    from './components/Sidebar'
import MainArea   from './components/MainArea'
import EditModal  from './components/EditModal'
import styles     from './components/Todo.module.css'

export default function App() {
  const todo = useTodo()
  return (
    <div className={`${styles.app} ${todo.theme === 'light' ? styles.light : ''}`}>
      <Sidebar   todo={todo} />
      <MainArea  todo={todo} />
      {todo.editingTask && <EditModal todo={todo} />}
    </div>
  )
}
