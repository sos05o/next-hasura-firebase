import {memo} from 'react'
import {useQueryNews} from "../hooks/useQueryNews"
import { News } from '../types/types'
import {NewsItemMemo} from "./NewsItem"

const NewsList = () => {
  const {status, data} = useQueryNews()
  if (status === 'loading') return <div>Loading</div>
  if (status === 'error') return <div>Error</div>

  return (
    <div>
      {/* @ts-ignore */}
      <ul>
        {data?.map((news: News) => (
          <NewsItemMemo key={news.id} news={news}/>
        ))}
      </ul>
    </div>
  )
}

export const NewsListMemo = memo(NewsList)
