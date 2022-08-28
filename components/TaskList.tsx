import {memo} from 'react'
import {useQueryTasks} from "../hooks/useQueryTasks"
import {TaskItemMemo} from "./TaskItem"

export const TaskList = () => {
  const {status, data} = useQueryTasks()
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'error') return <div>Error</div>

  return (
    <ul>
      {/* @ts-ignore*/}
      {data?.map((task) => (
        <TaskItemMemo key={task.id} task={task} />
      ))}
    </ul>
  )
}

export const TaskListMemo = memo(TaskList)
