import { request } from "graphql-request"
import { useQuery } from "@tanstack/react-query"
import { News } from "../types/types"
import { GET_NEWS } from "../queries/queries"

interface NewsRes {
  news: News[]
}

export const fetchNews = async () => {
  const { news: data } = await request<NewsRes>(
    // @ts-ignore
    process.env.NEXT_PUBLIC_HASURA_ENDPOINT,
    GET_NEWS
  )
  return data
}

export const useQueryNews = () => {
  return useQuery<News[], Error>({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: Infinity,
  })
}
