import Link from 'next/link'
import {getAuth} from "firebase/auth"
import {ChevronDoubleRightIcon, ArrowsRightLeftIcon} from "@heroicons/react/20/solid"
import firebase from '../firebaseConfig'
import {useFirebaseAuth} from "../hooks/useFirebaseAuth"

export const Auth = () => {
  const authRef = getAuth(firebase)
  const user = authRef.currentUser
  const {
    email,
    password,
    emailChange,
    pwChange,
    resetInput,
    isLogin,
    toggleMode,
    authUser,
  } = useFirebaseAuth()
  
  return (
    <>
      <form
        onSubmit={authUser}
        className="mt-8 flex justify-center items-center flex-col"
      >
        <label>Email:</label>
        <input
          className="my-3 px-3 py-1 border border-gray-300"
          placeholder="email ?"
          type="text"
          value={email}
          onChange={emailChange}
        />

        <label>Password:</label>
        <input
          className="my-3 px-3 py-1 border border-gray-300"
          placeholder="password ?"
          type="password"
          value={password}
          onChange={pwChange}
        />

        <button
          disabled={!email || !password}
          type="submit"
          className="disabled:opacity-40 mt-5 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded focus:outline-none"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <ArrowsRightLeftIcon
        className="my-5 h-5 w-5 text-blue-500 cursor-pointer"
        onClick={toggleMode}
      />
      {user && (
        <Link href="/tasks">
          <div className="flex items-center cursor-pointer my-3">
            <ChevronDoubleRightIcon className="h-5 w-5 mx-1 text-blue-500" />
            <span>to tasks page</span>
          </div>
        </Link>
      )}
    </>
  )
}
