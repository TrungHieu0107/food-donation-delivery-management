import { ReactNode, createContext, useState } from 'react'

const AuthContext = createContext({})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  let jsonString
  if (typeof window !== "undefined") {
    jsonString = localStorage.getItem("tu_tam_admin")
  }
  const user = jsonString ? JSON.parse(jsonString) : null
  console.log('Data local', user)
  const [session, setSession] = useState<any>(user ? user : null)

  return <AuthContext.Provider value={{ session, setSession }}>{children}</AuthContext.Provider>
}

export default AuthContext
