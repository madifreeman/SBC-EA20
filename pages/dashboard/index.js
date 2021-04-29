import { q, client as faunaClient } from "@/utils/fauna";
import Link from "next/link";
import groq from "groq";
import sanityClient from "@/utils/sanity";
import urlFor from "@/utils/imageUrlBuilder";

export async function getServerSideProps() {
  const mentor = await sanityClient.fetch(groq`
  *[_type == "mentor" && slug.current == 'caitlin-o-farrell'][0]{
    firstName, 
    lastName, 
    image, 
    role, 
    company,
    _id,  
    'slug': slug.current }
`);

  const feedbackSubmittedFor = await faunaClient.query(
    q.Select(
      ["data"],
      q.Paginate(
        q.Match(
          q.Index("submitted_feedback_by_mentor"),
          // mentor ref
          mentor._id
        )
      )
    )
  );

  console.log(feedbackSubmittedFor)

  const startupsQuery = groq`
*[_type == "startup" && _id in $feedbackSubmittedFor]{
  name, 
  city, 
  country, 
  image, 
  _id,
  'slug': slug.current }
`;

  const startups = await sanityClient.fetch(startupsQuery, {
    feedbackSubmittedFor,
  });

  // TODO: Get from ticketing system
  const schedule = {
    "Session 1": {
      dateTime: "Wed 28 Apr, 8am-10am AEST",
      location: "Room 1",
      zoomLink: "",
      startups: [
        {
          name: "17 Terawatts",
          slug: "17terawatts",
        },
        {
          name: "AG Energy",
          slug: "ag-energy",
        },
      ],
    },
  };

  return {
    props: { startups, mentor, schedule },
  };
}

export default function Dashboard({ mentor, startups, schedule }) {
  return (
    <div className="-mt-5">
      <div className="relative pt-12 px-4 xs:px-8">
        <div className="container mx-auto -mt-16">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 lg:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center sm:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto rounded-full sm:mx-0 lg:mx-auto"
                    src={urlFor(mentor.image)}
                  />
                  <div className="w-full pt-4 pl-0 mx-auto sm:w-auto lg:w-full sm:mx-0 lg:mx-auto sm:pl-8 lg:pl-0">
                    <h1 className="text-2xl font-semibold">
                      {mentor.firstName} {mentor.lastName}
                    </h1>
                    <h2 className="pt-3 text-xl">{mentor.company}</h2>
                    <p>{mentor.role}</p>
                    <div className="flex justify-center pt-4 mt-2 text-gray-500 sm:justify-start lg:justify-center">
                      <Link href="/mentors/edit/caitlin-ofarrell">
                        {/* TODO: Make link dynamic once account system set up */}
                        <a className="px-4 py-2 text-base font-semibold text-white bg-teal-500 rounded hover:shadow-lg hover:bg-teal-600">
                          Edit Profile
                        </a>
                      </Link>
                      <Link href="/mentors/caitlin-ofarrell">
                        {/* TODO: Make link dynamic once account system set up */}
                        <a className="px-4 py-2 ml-4 text-base font-semibold text-gray-700 bg-gray-200 rounded hover:shadow-lg hover:bg-gray-300">
                          View Profile
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="px-4 pt-6 lg:pt-0">
                <div class="bg-white rounded-lg shadow sm:px-12 sm:py-12 mb-4">
                  <p class="text-xl font-semibold">
                    Welcome to our Selection Days mentor dashboard!
                  </p>
                  <p class="pt-4">
                    On this page you will find a schedule of which teams you
                    will meet at Selection Days and links to join the Zoom
                    calls.
                  </p>
                  <p class="pt-4">
                    You can view and edit your own mentor profile which will be
                    automatically updated on the website. After you leave your
                    feedback for each startup, you can also revisit and amend
                    your ratings.
                  </p>
                  <p class="pt-4">
                    If you have any problems or feedback,{" "}
                    <a
                      class="text-teal-500 underline"
                      href="mailto:contact@startupbootcamp.com.au"
                    >
                      please get in touch
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="px-4 pt-8 lg:pt-0">
                <div class="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12 mb-4">
                  <h3 class="text-xl font-semibold">Startup feedback:</h3>
                  <p class="pt-4">
                    Please provide feedback on each team that you meet. This
                    feedback will play a crucial role in helping us decide who
                    will make it in to the cohort.
                  </p>

                  <ul class="mt-8">
                    {startups.map((startup) => {
                      return (
                        <li class="flex items-center justify-between border-t ">
                          <div class="flex items-center py-4">
                            <img
                              class="hidden object-cover w-20 h-20 mr-4 border-2 rounded-full md:block border-grey-200"
                              src={urlFor(startup.image)}
                            />
                            <div>
                              <p class="text-xl font-semibold">
                                <Link href={`/startups/${startup.slug}`}>
                                  <a class="hover:text-teal-500">
                                    {startup.name}
                                  </a>
                                </Link>
                              </p>
                              <p class="text-sm text-gray-500">
                                {startup.city + ", " + startup.country}
                              </p>
                            </div>
                          </div>
                          <div class="flex text-base">
                            <Link
                              href={`/dashboard/feedback?startup=${startup.slug}`}
                            >
                              <a class="px-4 py-2 ml-4 text-base font-semibold text-gray-700 bg-gray-200 rounded hover:shadow-lg hover:bg-gray-300">
                                Edit
                                <span class="hidden sm:inline"> Feedback</span>
                              </a>
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                    <li class="flex flex-col items-center justify-center p-10 bg-gray-100 border rounded-lg md:flex-row">
                      <p class="mb-5 text-lg font-semibold md:mb-0 md:mr-5">
                        {(() => {
                          if (startups.length < 0) {
                            return "No startup feedback left yet";
                          } else return "Help us choose our cohort";
                        })()}
                      </p>
                      <Link href="/dashboard/feedback/add">
                        <a class="block px-5 py-3 font-semibold text-center text-white bg-teal-500 rounded hover:shadow-lg hover:bg-teal-600">
                          Add Startup Feedback
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className=" px-4 pt-8 lg:pt-0">
                <div class="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12 mb-4">
                  <h3 class="text-xl font-semibold">Your schedule:</h3>
                  <p class="pt-4">
                    You will meet the startups in the order listed below for
                    each session. Remember to review their profiles before the
                    session and to leave feedback after you meet them. Links to
                    join the Zoom calls will appear below on Tue 27th April.
                  </p>
                  <div class="flex flex-wrap items-stretch pt-8 -mx-2">
                    <div class="w-full md:w-1/2 lg:w-2/3 xl:w-1/2 ">
                      <div class="h-full px-0 pb-4 md:px-2 lg:px-0 xl:px-2 xl:pb-4">
                        {Object.keys(schedule).map((session) => (
                          <div class="flex flex-col justify-between h-full px-5 py-5 overflow-hidden border border-gray-200 rounded-lg ">
                            <div>
                              <div class="flex items-center justify-between transition duration-100">
                                <div>
                                  <p class="font-medium leading-none">
                                    {session}
                                  </p>
                                  <p class="mt-1 text-sm text-gray-600">
                                    {schedule[session].dateTime}
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm text-right text-gray-600">
                                    You're in:
                                  </p>
                                  <p class="text-right font-semibold leading-none mt-1 text-teal-500">
                                    {schedule[session].location}
                                  </p>
                                </div>
                              </div>
                              <ul class="pt-4 pl-4 mt-4 mb-5 ml-1 text-gray-700 list-decimal border-t border-gray-200">
                                {schedule[session].startups.map((startup) => (
                                  <li class="">
                                    <Link href={`/startups/${startup.slug}`}>
                                      <a target="_blank">
                                        <div class="flex items-center justify-between text-base group">
                                          <p class="font-medium group-hover:text-teal-500">
                                            {startup.name}
                                            <span class="hidden group-hover:inline">
                                              {" "}
                                              »
                                            </span>
                                          </p>
                                          <p class="text-sm text-teal-500 group-hover:text-teal-600 group-hover:underline">
                                            View profile
                                          </p>
                                        </div>
                                      </a>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {(() => {
                              if (schedule[session].zoomLink) {
                                return (
                                  <Link href={schedule[session].zoomLink}>
                                    <a
                                      href="https://sbcaus.zoom.us/j/89105182699?pwd=YkNqV1p4enBZNG43ZHluWVRrdXpMdz09"
                                      target="_blank"
                                    >
                                      <div class="py-2 text-base font-semibold text-center text-white rounded-lg bg-teal-500 hover:bg-teal-600 hover:shadow-lg">
                                        <span class="block font-semibold">
                                          Join Zoom call{" "}
                                          <i
                                            class="ml-1 fas fa-external-link-alt fa-sm"
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </div>
                                    </a>
                                  </Link>
                                );
                              }
                            })()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
