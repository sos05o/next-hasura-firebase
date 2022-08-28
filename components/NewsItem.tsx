import {memo} from 'react'
import {useDispatch} from "react-redux"
import {setEditedNews} from "../slices/uiSlice"
import {PencilIcon, TrashIcon} from "@heroicons/react/20/solid"
import {useAppMutate} from "../hooks/useAppMutate"
import {News} from "../types/types"

interface Props {
  news: News
}

const NewsItem = ({news}: Props) => {
  const dispatch = useDispatch()
  const {deleteNewsMutation} = useAppMutate()
  if (deleteNewsMutation.isLoading) {
    return <p>Deleting...</p>
  }

  if (deleteNewsMutation.error) {
    return <p>Error</p>
  }

  return (
    <li className="my-3">
      <span className="font-bold">{news.content}</span>
      <div className="flex float-right ml-20">
        <PencilIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            dispatch(
              setEditedNews({
                id: news.id,
                content: news.content,
              })
            )
          }}
        />
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteNewsMutation.mutate(news.id)
          }}
        />
      </div>
    </li>
  )
}

export const NewsItemMemo = memo(NewsItem)
