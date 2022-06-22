import Link from "next/link"

export default function Breadcrumbs(){
    return(
        <nav aria-label="breadcrumb" >
            <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
                <li className="pr-4 font-medium text-gray-500 hover:text-gray-900">
                <Link href="/marketplace">
                    <a>
                        Buy
                    </a>
                </Link>
                </li>
                <li className="px-4 font-medium text-gray-500 hover:text-gray-900">
                <Link href="/marketplace/courses/owned">
                    <a>
                        My Courses
                    </a>
                </Link>
                </li>
                <li className="px-4 font-medium text-gray-500 hover:text-gray-900">
                <Link href="/marketplace/courses/manage">
                    <a>
                        Manage Courses
                    </a>
                </Link>
                </li>
            </ol>
        </nav>
    )
}