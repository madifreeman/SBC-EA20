import Link from "next/link";
import urlFor from "@/utils/imageUrlBuilder";

export default function FeedbackMentor({ mentor }) {
  return (
    <li
      className="flex items-center justify-between py-8 border-t border-gray-200"
      key={mentor.slug}
    >
      <div className="flex flex-wrap items-center w-full sm:flex-no-wrap">
        <Link href={`/mentor/${mentor.slug}`}>
          <a className="flex-shrink-0 block w-32 h-32 mx-auto sm:w-24 sm:h-24 sm:mx-0">
            <img
              className="object-cover w-32 h-32 border-4 border-white rounded-full sm:w-24 sm:h-24 hover:border-teal-600"
              src={urlFor(mentor.image)}
            />
          </a>
        </Link>
        <div className="flex-shrink w-full pt-2 text-center sm:pt-0 sm:pl-3 sm:w-auto sm:text-left">
          <h4 className="text-xl font-semibold">
            <Link href={`/mentor/${mentor.slug}`}>
              <a className="hover:text-teal-600">
                {mentor.firstName + " " + mentor.lastName}
              </a>
            </Link>
          </h4>
          <p className="hidden text-base leading-snug text-gray-500 sm:block">
            {mentor.role + " at " + mentor.company}
          </p>
          <p className="block text-base text-gray-500 sm:hidden">
            {mentor.company}
          </p>
          <p className="block text-sm text-gray-500 sm:hidden">{mentor.role}</p>
          <a
            className="block pt-2 text-sm text-gray-700 hover:text-teal-600 sm:pt-1"
            href={`mailto:${mentor.email}`}
          >
            {mentor.email}
          </a>
        </div>
      </div>
    </li>
  );
}
