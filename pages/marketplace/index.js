import { EthRates, Walletbar } from '../../components/web3/index.js';
import { CourseList, CourseCard } from '../../components/course/index.js';
import { BaseLayout } from '../../components/layout/index.js';
import { getAllCourses } from '../../content/courses/fetcher.js';
import { useOwnedCourses, useWalletInfo } from "../../components/hooks/web3"
import {useRouter} from "next/router"
import { useWeb3 } from '../../components/providers/index.js';
import {Breadcrumbs, Button, Message, Modal } from '../../components/common/index.js';
import { OrderModal } from 'components/order/index.js';
import { useState } from "react"
import { useEthPrice } from "../../components/hooks/useEthPrice"

export default function Marketplace({courses}) {
  
  const [selectedCourse, setSelectedCourse] = useState(null)
  const { web3, contract, requireInstall } = useWeb3()
  // const isLoading= useWeb3()
  // console.log(web3)
    const router = useRouter()
    // const { connect, isLoading, isWeb3Loaded } = useWeb3()
    const { account, network, hasConnectedWallet, isConnecting} = useWalletInfo()
    const { eth } = useEthPrice()
    const {ownedCourses} = useOwnedCourses(courses, account.data)
    const [isNewPurchase, setIsNewPurchase] = useState(true)

    const purchaseCourse = async order => {
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id)
      console.log(hexCourseId)

      // hex course ID:
      // 0x31343130343734000000000000000000

      // address
      // 0xf8929048D74164582E5FA0897fC654CbF0c096C6

      // 31343130343734000000000000000000f8929048D74164582E5FA0897fC654CbF0c096C6
      // Order Hash
      // 2e0b409e2bf77ce6466df3990199f3a7377f305fef2c55556a8cae5decbdd0e5
      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account.data }
      )

      // test@gmail.com
      // af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902
      // const emailHash = web3.utils.sha3(order.email)


      // af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b9022e0b409e2bf77ce6466df3990199f3a7377f305fef2c55556a8cae5decbdd0e5

      // proof:
      // b13bdad9cb08b53405c63b05f052a842ec6ab91f6f4239355ff359eb5532b29f
      // const proof = web3.utils.soliditySha3(
      //   { type: "bytes32", value: emailHash },
      //   { type: "bytes32", value: orderHash }
      // )

      const value = web3.utils.toWei(String(order.price))
      if (isNewPurchase) {
        const emailHash = web3.utils.sha3(order.email)
        const proof = web3.utils.soliditySha3(
          { type: "bytes32", value: emailHash },
          { type: "bytes32", value: orderHash }
        )
  
        _purchaseCourse(hexCourseId, proof, value)
      } else {
        _repurchaseCourse(orderHash, value)
      }
    }
  
    const _purchaseCourse = async (hexCourseId, proof, value) => {

      try {
        const result = await contract.methods.purchaseCourse(
          hexCourseId,
          proof
        ).send({from: account.data, value})
        console.log(result)
      } catch {
        console.error("Purchase course: Operation has failed.")
      }
    }

    const _repurchaseCourse = async (courseHash, value) => {
      try {
        const result = await contract.methods.repurchaseCourse(
          courseHash
        ).send({from: account.data, value})
        console.log(result)
      } catch {
        console.error("Purchase course: Operation has failed.")
      }
    }
  

  return (
    
    <>
      <div className="pt-4">
          <Walletbar
              address = {account.data}
              network={{
                data: network.data,
                target: network.target,
                isSupported: network.isSupported
              }}
          />
          <EthRates
            eth={eth.data}
            ethPerItem={eth.perItem}
          />
          <div className="flex flex-row-reverse py-4 px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>
      </div>
        
        <CourseList courses={courses}
        >
        {course =>
          <CourseCard
            key={course.id}
            course={course}
            disabled={!hasConnectedWallet}
            Footer={() => {

              if (requireInstall) {
                return (
                  <Button
                    disabled={true}
                    variant="lightPurple">
                    Install
                  </Button>
                )
              }

              if (!ownedCourses.hasInitialResponse) {
                return (
                  <div style={{height: "50px"}}></div>
                )
              }
  
              const owned = ownedCourses.lookup[course.id]
  
              if (owned) {
                return (
                  <>
                    <div>
                      <Button
                        disabled={true}
                        variant="green">
                        Owned
                      </Button>
                      { owned.state === "deactivated" &&
                        <Button
                          disabled={false}
                          onClick={() => {
                            setIsNewPurchase(false)
                            setSelectedCourse(course)
                          }}
                          variant="purple">
                          Fund to Activate
                        </Button>
                      }
                    </div>
                    <div className="mt-1">
                      { owned.state === "activated" &&
                        <Message size="sm">
                          Activated
                        </Message>
                      }
                      { owned.state === "deactivated" &&
                        <Message type="danger" size="sm">
                          Deactivated
                        </Message>
                      }
                      { owned.state === "purchased" &&
                        <Message type="warning" size="sm">
                          Waiting for Activation
                        </Message>
                      }
                    </div>
                  </>
                )
              }
  

              return (
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    disabled={!hasConnectedWallet}
                    variant="lightPurple">
                    Purchase
                  </Button>
                )}

            }
          />
        }
        </CourseList>
        { selectedCourse &&
        <OrderModal
          isNewPurchase={isNewPurchase}
          onSubmit={purchaseCourse}
          course={selectedCourse}
          onClose={() => {
            setSelectedCourse(null)
            setIsNewPurchase(true)
          }}
        />
      }
    </>
  )

}

export function getStaticProps(){
  const {data} = getAllCourses()
  return{
    props:{
      courses: data
    }
  }
}
Marketplace.Layout = BaseLayout
//swr : react hook for data fetching
//tofixed upto decimal places
// !! is used to fet boolean in case of undefined