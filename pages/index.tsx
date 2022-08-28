import {Layout} from "../components/Layout"
import {Auth} from "../components/Auth"
import {GetStaticProps} from "next"
import {dehydrate} from "@tanstack/react-query"
import {fetchNews} from "../hooks/useQueryNews"
import {News} from "../types/types"
import {QueryClient, useQueryClient} from "@tanstack/react-query"

const Home = () => {
  const queryClient = useQueryClient()
  // @ts-ignore
  const data = queryClient.getQueriesData<News[]>('news')
  return (
    <Layout title="Home">
      <p className="mb-5 text-blue-500 text-xl">News list by SSG</p>
      {/*@ts-ignore*/}
      {data?.map((news) => (
        // @ts-ignore
        <p className="font-bold" key={news.id}>{news.content}</p>
      ))}
      <Auth />
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  // @ts-ignore
  await queryClient.prefetchQuery("news", fetchNews)
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3,
  }
}
