import { CourseFilter, ManagedCourseCard, OwnedCourseCard } from "../../../components/course";
import { BaseLayout } from "../../../components/layout";
import { EthRates, Walletbar } from '../../../components/web3/index.js';
import { useAdmin, useManagedCourses, useWalletInfo } from "../../../components/hooks/web3"
import {useRouter} from "next/router"
import {Breadcrumbs, Button, Message } from '../../../components/common/index.js';
import { useEthPrice } from "../../../components/hooks/useEthPrice"
import {useEffect ,useState } from "react";
import { useWeb3, contract } from "components/providers";
import { normalizeOwnedCourse } from "utils/normalize";


const VerificationInput = ({onVerify}) => {
  const [ email, setEmail ] = useState("")
  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({target: {value}}) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..." />
      <Button
        onClick={() => {
          onVerify(email)
        }}
      >
        Verify
      </Button>
    </div>
  )
}

export default function ManageCourses() {

  const { network, canPurchaseCourse } = useWalletInfo()
  const { account } = useAdmin({redirectTo: "/marketplace"})
  const { eth } = useEthPrice()
  const { managedCourses } = useManagedCourses(account.data)
  const [ proofedOwnership, setProofedOwnership ] = useState({})
  const { web3, contract } = useWeb3()
  const [ searchedCourse, setSearchedCourse ] = useState(null)
  const [ filters, setFilters ] = useState({state: "all"})


  const renderCard = (course, isSearched) => {
    return (
      <ManagedCourseCard
        key={course.ownedCourseId}
        isSearched={isSearched}
        course={course}
      >
        <VerificationInput
          onVerify={email => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof
            })
          }}
        />
        { proofedOwnership[course.hash] &&
          <div className="mt-2">
            <Message>
              Verified!
            </Message>
          </div>
        }
        { proofedOwnership[course.hash] === false &&
          <div className="mt-2">
            <Message type="danger">
              Wrong Proof!
            </Message>
          </div>
        }
        { course.state === "purchased" &&
          <div className="mt-2">
            <Button
              onClick={() => activateCourse(course.hash)}
              variant="green">
              Activate
            </Button>
            <Button
              onClick={() => deactivateCourse(course.hash)}
              variant="red">
              Deactivate
            </Button>
          </div>
        }
      </ManagedCourseCard>
    )
  }



  const verifyCourse = (email, {hash, proof}) => {
    if(!email) return
    const emailHash = web3.utils.sha3(email)
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    )

    proofToCheck === proof ?
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: true
      }) :
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: false
      })
  }

  const changeCourseState = async (courseHash, method) => {
    try {
      await contract.methods[method](courseHash)
        .send({
          from: account.data
        })
    } catch(e) {
      console.error(e.message)
    }
  }

  const activateCourse = async courseHash => {
    changeCourseState(courseHash, "activateCourse")
  }

  const deactivateCourse = async courseHash => {
    changeCourseState(courseHash, "deactivateCourse")
  }

  const searchCourse = async hash => {
    const re = /[0-9A-Fa-f]{6}/g;

    if(hash && hash.length === 66 && re.test(hash)) {
      const course = await contract.methods.getCourseByHash(hash).call()

      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)({hash}, course)
        setSearchedCourse(normalized)
        return
      }
    }

    setSearchedCourse(null)
  }


  if (!account.isAdmin) {
    return null
  }

  const filteredCourses = managedCourses.data
    ?.filter((course) => {
      if (filters.state === "all") {
        return true
      }

      return course.state === filters.state
    })
    .map(course => renderCard(course) )



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
          <CourseFilter
            onFilterSelect={(value) => setFilters({state: value})}
            onSearchSubmit={searchCourse}
          />
        </div>
      <section className="grid grid-cols-1">
      { searchedCourse &&
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            { renderCard(searchedCourse, true) }
          </div>
        }
        <h1 className="text-2xl font-bold p-5">All Courses</h1>
        { filteredCourses }
        { filteredCourses?.length === 0 &&
          <Message type="warning">
            No courses to display
          </Message>
        }
      </section>
    </>
  )
}

ManageCourses.Layout = BaseLayout