import Cookie from 'universal-cookie'
import firebase from '../firebaseConfig'
import {getAuth, signOut} from "firebase/auth"
import {unSubMeta} from "./useUserChanged"
import {useQueryClient} from "@tanstack/react-query";
import {useDispatch} from "react-redux";
import {resetEditedTask, resetEditedNews} from "../slices/uiSlice";

const cookie = new Cookie()

export const useLogout = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const logout = async () => {
    // @ts-ignore
    if (unSubMeta) {
      unSubMeta()
    }
    dispatch(resetEditedTask())
    dispatch(resetEditedNews())

    const authRef = getAuth(firebase)
    await signOut(authRef)
    // @ts-ignore
    queryClient.removeQueries('tasks')
    // @ts-ignore
    queryClient.removeQueries('news')
    cookie.remove('token')
  }
  return { logout }
}
