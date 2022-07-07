import { BaseLayout } from "../../components/layout";
import {Message, Modal } from "../../components/common";
import { CourseHero, Curriculum } from "../../components/course";
import Keypoints from "../../components/course/keypoints";
import { getAllCourses } from "../../content/courses/fetcher";
import { useAccount, useOwnedCourse } from "components/hooks/web3";




export default function Course({course}) {

    const { account } = useAccount()
    const { ownedCourse } = useOwnedCourse(course, account.data)
    const courseState = ownedCourse.data?.state
    // const courseState = "deactivated"
    // const courseState = "activated"

    const isLocked = !courseState || courseState === "purchased" ||courseState === "deactivated"

  
    return (
      <>
      
        <div className="py-4">
          <CourseHero
           hasOwner={!!ownedCourse.data}
           title = {course.title}
           description = {course.description}
           image = {course.coverImage}
          />
        </div>
        
        {/*------ HERO ENDS ------*/}
        
        {/*------ KEYPOINT STARTS ------*/}
        <Keypoints
         points = {course.wsl}
        />
        {/*------ KEYPOINT ENDS ------*/}
        { courseState &&
          <div className="max-w-5xl mx-auto">
            { courseState === "purchased" &&
              <Message type="warning">
                Course is purchased and waiting for the activation. Process can take up to 24 hours.
                <i className="block font-normal">In case of any questions, please contact 2609sahil@gmail.com</i>
              </Message>
            }
            { courseState === "activated" &&
              <Message type="success">
                We wish you happy watching of the course.
              </Message>
            }
            { courseState === "deactivated" &&
              <Message type="danger">
                Course has been deactivated, due the incorrect purchase data.
                The functionality to watch the course has been temporaly disabled.
                <i className="block font-normal">Please contact 2609sahil@gmail.com</i>
              </Message>
            }
          </div>
        }
  
        {/*------ LECTURES STARTS ------*/}
        <Curriculum locked = {isLocked} courseState ={courseState}/>
        {/*------ LECTURES ENDS ------*/}
  
        {/* MODAL STARTS */}
        <Modal/>
        {/* MODAL ENDS */}
      </>
    )
}

export function getStaticPaths() {
    const { data } = getAllCourses()
  
    return {
      paths: data.map(c => ({
        params: {
          slug: c.slug
        }
      })),
      fallback: false
    }
  }
  
  
  export function getStaticProps({params}) {
    const { data } = getAllCourses()
    const course = data.filter(c => c.slug === params.slug)[0]
    
    return {
      props: {
        course
      }
    }
  }

Course.Layout = BaseLayout
  

//in case coursestate is undefined we have used ? in
//ownedCourse.data?.state