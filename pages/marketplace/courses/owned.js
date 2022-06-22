import { useAccount, OwnedCourseCard } from "../../../components/course";
import { BaseLayout } from "../../../components/layout";
import { EthRates, Walletbar } from '../../../components/web3/index.js';
import { useWalletInfo } from "../../../components/hooks/web3"
import {useRouter} from "next/router"
import {Breadcrumbs, Button, Modal,Message } from '../../../components/common';
import { useEthPrice } from "../../../components/hooks/useEthPrice"
import { useOwnedCourses } from "../../../components/hooks/web3";
import { getAllCourses } from "content/courses/fetcher";
import Link from "next/link"
import { useWeb3 } from "components/providers";



export default function OwnedCourses({courses}) {
  const { requireInstall } = useWeb3()
  
  const router = useRouter()
  // const { connect, isLoading, isWeb3Loaded } = useWeb3()
  const { account, network, canPurchaseCourse } = useWalletInfo()
  const { eth } = useEthPrice()
  const { ownedCourses } = useOwnedCourses(courses, account.data)

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
      <section className="grid grid-cols-1">
        { ownedCourses.isEmpty &&
          <div className="w-1/2">
            <Message type="warning">
              <div>You don&apos;t own any courses</div>
              <Link href="/marketplace">
                <a className="font-normal hover:underline">
                  <i>Purchase Course</i>
                </a>
              </Link>
            </Message>
          </div>
        }
        { account.isEmpty &&
          <div className="w-1/2">
            <Message type="warning">
              <div>Please connect to Metamask</div>
            </Message>
          </div>
        }
        { requireInstall &&
          <div className="w-1/2">
            <Message type="warning">
              <div>Please install Metamask</div>
            </Message>
          </div>
        }
        { ownedCourses.data?.map(course =>
            <OwnedCourseCard
              key={course.id}
              course={course}
            >
              {/* <Message>
                My custom message!
              </Message> */}
              <Button
                onClick={() => router.push(`/courses/${course.slug}`)}
              >
                Watch the course
              </Button>
            </OwnedCourseCard>
        )}
      </section>
    </>
  )
}

export function getStaticProps() {
  const { data } = getAllCourses()
  return {
    props: {
      courses: data
    }
  }
}

OwnedCourses.Layout = BaseLayout