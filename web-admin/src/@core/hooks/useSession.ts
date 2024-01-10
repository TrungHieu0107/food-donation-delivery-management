import { useContext } from 'react'
import AuthContext from '../context/authContext'
import { UserContextModel } from 'src/models/User'

const useSession = () => {
  const { session, ...allConext }: any = useContext(AuthContext)

  const context = new UserContextModel({
    user: {
      role: session?.user?.role
    },
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken
  })

  return { context, session,...allConext }
}

export default useSession
