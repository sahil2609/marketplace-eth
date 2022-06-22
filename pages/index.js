import { EthRates, Walletbar } from '../components/web3/index.js';
import  {Navbar, Footer, Hero, Breadcrumbs} from '../components/common/index.js';
import { CourseList, CourseCard } from '../components/course/index.js';
import { OrderCard } from '../components/order/index.js';
import { BaseLayout } from '../components/layout/index.js';
import { getAllCourses } from '../content/courses/fetcher.js';

export default function Home({courses}) {
  // const web3 = useWeb3()
  // const isLoading= useWeb3()
  // console.log(web3)
  return (
    
    <>
          {/* { isLoading ? "Is Loading Web3..." : web3 ? "Web 3 Ready!" : "Please install metamask" } */}
          <Hero/>
          {/* <Breadcrumbs/>
          <EthRates/>
          <Walletbar/>
          <OrderCard/> */}
          <CourseList courses={courses}>
            {course =>
            <CourseCard
            key={course.id}
            course={course}
            />
            }
          </CourseList>
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

Home.Layout = BaseLayout

//swr : react hook for data fetching