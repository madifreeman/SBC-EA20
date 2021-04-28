import Link from "next/link";
import urlFor from "@/utils/imageUrlBuilder";

const FeedbackComment = ({ comment, mentor }) => {
  if (mentor !== null)
    return (
      <li
        className="flex items-center justify-between py-8 border-t border-gray-200"
      >
        <div className="flex flex-wrap sm:flex-nowrap w-full sm:flex-no-wrap">
          <Link href={`/mentor/${mentor.slug}`}>
            <a className="flex-shrink-0 block w-32 h-32 mx-auto sm:w-24 sm:h-24 sm:mx-0">
              <img
                className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full sm:w-24 sm:h-24 hover:border-teal-600"
                src={urlFor(mentor.image) || "/images/user.jpg"}
              />
            </a>
          </Link>
          <div className="flex-shrink w-full pt-2 text-center sm:pl-3 sm:w-auto sm:text-left">
            <h4 className="text-xl font-semibold">
              <Link href={`/mentor/${mentor.slug}`}>
                <a className="hover:text-teal-600">
                  {mentor.firstName + " " + mentor.lastName}
                </a>
              </Link>
            </h4>
            <p className="hidden text-base leading-snug text-gray-500 sm:block">
              {mentor.role} at {mentor.company}
            </p>
            <p className="block text-base text-gray-500 sm:hidden">
              {mentor.company}
            </p>
            <p className="block text-sm text-gray-500 sm:hidden">
              {mentor.role}
            </p>
            <a
              className="block pt-2 text-sm text-gray-700 hover:text-teal-600 sm:pt-1"
              href={`mailto:${mentor.email}`}
            >
              {mentor.email}
            </a>

            <div className="inline-block w-auto px-3 py-2 mt-3 text-base italic bg-gray-100 border border-gray-200 rounded">
              {comment}
            </div>
          </div>
        </div>
      </li>
    );
  else
    return (
      <li className="flex items-center justify-between py-8 border-t border-gray-200">
        <div className="flex flex-wrap w-full sm:flex-no-wrap">
          <div className="flex-shrink-0 block w-32 h-32 mx-auto sm:w-24 sm:h-24 sm:mx-0">
            <img
              className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full sm:w-24 sm:h-24"
              src="/images/user.jpg"
            />
          </div>
          <div className="flex-shrink w-full pt-2 text-center sm:pl-3 sm:w-auto sm:text-left">
            <h4 className="text-xl font-semibold">Anonymous</h4>
            <div className="inline-block w-auto px-3 py-2 mt-3 text-base italic bg-gray-100 border border-gray-200 rounded">
              {comment}
            </div>
          </div>
        </div>
      </li>
    );
};

export default FeedbackComment;