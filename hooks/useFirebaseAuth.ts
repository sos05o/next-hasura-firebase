import { useState, useCallback, ChangeEvent, FormEvent } from "react"
import firebase from "../firebaseConfig"
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'

export const useFirebaseAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const emailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const pwChange = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const resetInput = useCallback(() => {
    setEmail('')
    setPassword('')
  }, [])

  const toggleMode = useCallback(() => {
    // useCallbackの中で特定のstateを参照している場合は、第2引数の配列に入れる必要がある
    // 初期化されるときに上で初期化された時の値を保持しており、引数に入れなければずっとその値を使用し続けるため
    setIsLogin(!isLogin)
  }, [isLogin])

  const authUser = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (isLogin) {
        try {
          const authRef = getAuth(firebase)
          await signInWithEmailAndPassword(authRef, email, password)
        } catch (e) {
          alert(e)
        }
        resetInput()
      } else {
        try {
          const authRef = getAuth(firebase)
          await createUserWithEmailAndPassword(authRef, email, password)
        } catch (e) {
          alert(e)
        }
        resetInput()
      }
    }, [email , password, isLogin]
  )

  return {
    email,
    password,
    emailChange,
    pwChange,
    resetInput,
    isLogin,
    toggleMode,
    authUser,
  }
}
