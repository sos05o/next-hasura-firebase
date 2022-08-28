import {QueryClient, QueryClientProvider, Hydrate} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import type {AppProps} from 'next/app'
import {useUserChanged} from "../hooks/useUserChanged"
import {Provider} from "react-redux"
import {store} from "../app/store"
import '../styles/globals.css'

function MyApp({Component, pageProps}: AppProps) {
  const {} = useUserChanged()
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           retry: false,
  //           refetchOnWindowFocus: false,
  //         }
  //       }
  //     })
  // )

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Hydrate>
      {/*<ReactQueryDevtools initialIsOpen />*/}
    </QueryClientProvider>
  )
}

export default MyApp
