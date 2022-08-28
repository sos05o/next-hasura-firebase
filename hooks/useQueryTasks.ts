import { useEffect } from "react"
import { GraphQLClient } from "graphql-request"
import { useQuery } from "@tanstack/react-query"
import { Task } from "../types/types"
import { GET_TASKS } from "../queries/queries"
import Cookie from "universal-cookie"

const cookie = new Cookie()
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT
let graphQLClient: GraphQLClient

interface TasksRes {
  tasks: Task[]
}

const fetchTasks = async () => {
  const { tasks: data } = await graphQLClient.request<TasksRes>(GET_TASKS)
  return data
}

export const useQueryTasks = () => {
  useEffect(() => {
    // @ts-ignore
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie.get('token')])

  return useQuery<Task[], Error>({
    // @ts-ignore
    queryKey: 'tasks',
    queryFn: fetchTasks,
    staleTime: 0,
  })
}
