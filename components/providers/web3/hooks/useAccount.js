//data returned by swr is account address
//swr : react hook for data fetching
//function inside a function that is it will return a
// function first and then the value
// eg const account = useAccount(web3)()


import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0x17ae7109fc495ba2855ef65756dc48b88a1adf362bfa1674dcaff0e7e5e229f9": true,
  "0x10ec8449b4b979dad8ba921e6623f376b71ae87c7fe287c867f5993d8e1ff908" : true
}

export const handler = (web3, provider) => () => {

  const { data, mutate, ...rest } = useSWR(() =>
    web3 ? "web3/accounts" : null,
    async () => {
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]

      if (!account) {
        throw new Error("Cannot retreive an account. Please refresh the browser.")
      }

      return account
    }
  )

  useEffect(() => {
    const mutator = accounts => mutate(accounts[0] ?? null)
    provider?.on("accountsChanged", mutator)
    return () => {
      provider?.removeListener("accountsChanged", mutator)
    }
  }, [provider])
  return {
    account: {
      data,
      isAdmin: (
        data && 
        adminAddresses[web3.utils.keccak256(data)]) ?? false,
      mutate,
      ...rest
    }
  }
}