
//function inside a function that is it will return a
// function first and then the value
// eg const account = useAccount(web3)()

import { handler as createAccountHook } from "./useAccount"
import { handler as createNetworkHook } from "./useNetwork"
import { handler as createOwnedCoursesHook } from "./useOwnedCourses"
import { handler as createOwnedCourseHook } from "./useOwnedCourse"
import { handler as createManagedCoursesHook } from "./useManagedCourses"

export const setupHooks = ({web3, provider, contract}) => {

  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider),
    useOwnedCourses: createOwnedCoursesHook(web3, contract),
    useOwnedCourse: createOwnedCourseHook(web3, contract),
    useManagedCourses: createManagedCoursesHook(web3, contract),
  }
}