import { useEffect } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { GraphQLClient } from "graphql-request"
import Cookie from "universal-cookie"
import {
  CREATE_NEWS,
  UPDATE_NEWS,
  DELETE_NEWS,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK
} from "../queries/queries"
import { Task, EditTask, News, EditNews } from "../types/types"
import { useDispatch } from "react-redux"
import { resetEditedTask, resetEditedNews } from "../slices/uiSlice"

const cookie = new Cookie()
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT
let graphQLClient: GraphQLClient

export const useAppMutate = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  useEffect(() => {
    // @ts-ignore
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie.get('token')])

  const createTaskMutation = useMutation((title: string) =>
    graphQLClient.request(CREATE_TASK, {title: title}),
    {
      onSuccess: (res) => {
        // @ts-ignore
        const previousTodos = queryClient.getQueriesData<Task[]>('tasks')
        if (previousTodos) {
          // @ts-ignore
          queryClient.setQueryData('tasks', [
            ...previousTodos,
            res.insert_tasks_one,
          ])
        }
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      }
    }
  )

  const updateTaskMutation = useMutation((task: EditTask) =>
    graphQLClient.request(UPDATE_TASK, task),
    {
      onSuccess: (res, variables) => {
        // @ts-ignore
        const previousTodos = queryClient.getQueriesData<Task[]>(`tasks`)
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            // @ts-ignore
            'tasks',
            previousTodos.map((task) => {
              // @ts-ignore
              task.id === variables.id ? res.update_tasks_by_pk : task
            })
          )
        }
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      }
    }
  )

  const deleteTaskMutation = useMutation((id: string) =>
    graphQLClient.request(DELETE_TASK, {id: id}),
    {
      onSuccess: (res, variables) => {
        // @ts-ignore
        const previousTodos = queryClient.getQueriesData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            // @ts-ignore
            'tasks',
            // @ts-ignore
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        dispatch(resetEditedTask())
      }
    }
  )

  const createNewsMutation = useMutation((content: string) =>
    graphQLClient.request(CREATE_NEWS, {content: content}),
    {
      onSuccess: (res) => {
        // @ts-ignore
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          // @ts-ignore
          queryClient.setQueryData('news', [
            ...previousNews,
            res.insert_news_one,
          ])
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      }
    }
  )

  const updateNewsMutation = useMutation((news: EditNews) =>
    graphQLClient.request(UPDATE_NEWS, news),
    {
      onSuccess: (res, variables) => {
        // @ts-ignore
        const previousNews = queryClient.getQueriesData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData<News[]>(
            // @ts-ignore
            'news',
            previousNews.map((news) =>
              // @ts-ignore
              news.id === variables.id ? res.update_news_by_pk : news
            )
          )
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      }
    }
  )

  const deleteNewsMutation = useMutation((id: string) =>
    graphQLClient.request(DELETE_NEWS, {id: id}),
    {
      onSuccess: (res, variables) => {
        // @ts-ignore
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData<News[]>(
            // @ts-ignore
            'news',
            previousNews.filter((news) => news.id !== variables)
          )
        }
        dispatch(resetEditedNews())
      }
    }
  )

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
  }
}
