import { useHooks } from "../../providers/web3"
import { useEffect } from "react"
import { useWeb3 } from "../../providers/web3"
import { useRouter } from "next/router"

const _isEmpty = data => {
  return (
    data == null ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  )
}


const enhanceHook = swrRes => {
  const { data, error } = swrRes
  const hasInitialResponse = !!(data || error)
  const isEmpty = hasInitialResponse && _isEmpty(data)
  return {
    ...swrRes,
    isEmpty,
    hasInitialResponse
  }
}

export const useAccount = () => {
  return useHooks(hooks => hooks.useAccount)()
}
export const useNetwork = () => {
  return useHooks(hooks => hooks.useNetwork)()
}

export const useAdmin = ({redirectTo}) => {
  const { account } = useAccount()
  const { requireInstall } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if ((
      requireInstall ||
      account.hasInitialResponse && !account.isAdmin) ||
      account.isEmpty) {

      router.push(redirectTo)
    }
  }, [account])

  return { account }
}


export const useOwnedCourses = (...args) => {
  const swrRes = enhanceHook(useHooks(hooks => hooks.useOwnedCourses)(...args))

  return {
    ownedCourses: swrRes
  }
}

export const useOwnedCourse = (...args) => {
  const swrRes = enhanceHook(useHooks(hooks => hooks.useOwnedCourse)(...args))

  return {
    ownedCourse: swrRes
  }
}

export const useManagedCourses = (...args) => {
  const swrRes = enhanceHook(useHooks(hooks => hooks.useManagedCourses)(...args))

  return {
    managedCourses: swrRes
  }
}



export const useWalletInfo = () => {
  const { account } = useAccount()
  const { network } = useNetwork()

  const isConnecting =
  !account.hasInitialResponse &&
  !network.hasInitialResponse


  return {
    account,
    network,
    isConnecting,
    hasConnectedWallet: !!(account.data && network.isSupported)
  }
}