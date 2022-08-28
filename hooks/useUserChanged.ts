import { useEffect } from "react"
import firebase from '../firebaseConfig'
import {getAuth, onAuthStateChanged, getIdToken, getIdTokenResult} from 'firebase/auth'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'

import {getFirestore, collection, doc, onSnapshot} from "@firebase/firestore"

export let unSubMeta: () => void

export const useUserChanged = () => {
  const cookie = new Cookie()
  const router = useRouter()
  const HASURA_TOKEN_KEY = 'https://hasura.io/jwt/claims'

  const auth = getAuth()

  useEffect(() => {
    const unSubUser = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user, true)
        const idTokenResult = await getIdTokenResult(user)
        const hasuraClaims = idTokenResult.claims[HASURA_TOKEN_KEY]

        if (hasuraClaims) {
          cookie.set('token', token, {path: '/'})
          await router.push('/tasks')
        } else {
          const storeRef = getFirestore(firebase)
          const colRef = collection(storeRef, 'user_meta')
          const docRef = doc(colRef, user.uid)
          unSubMeta = onSnapshot(docRef, async () => {
            const tokenSnap = await getIdToken(user, true)
            const idTokenResultSnap = await getIdTokenResult(user)
            const hasuraClaimsSnap = idTokenResultSnap.claims[HASURA_TOKEN_KEY]
            if (hasuraClaimsSnap) {
              cookie.set('token', tokenSnap, {path: '/'})
              await router.push('/tasks')
            }
          })
        }
      }
    })
    return () => {
      unSubUser()
    }
  }, [])

  return {}
}
