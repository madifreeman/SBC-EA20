import { q, client } from "@/utils/fauna";
import Link from "next/link";

export async function getServerSideProps() {
  const results = await client.query({
    mentor: q.Select(
      ["data"],
      q.Map(
        q.Paginate(q.Match(q.Index("mentors_by_slug"), "caitlin-ofarrell")), // TODO: make dynamic once account system set up
        q.Lambda(
          "mentorRef",
          q.Let(
            {
              mentorDoc: q.Get(q.Var("mentorRef")),
            },
            {
              id: q.Select(["ref", "id"], q.Var("mentorDoc")),
              firstName: q.Select(["data", "firstName"], q.Var("mentorDoc")),
              lastName: q.Select(["data", "lastName"], q.Var("mentorDoc")),
              image: q.Select(["data", "image"], q.Var("mentorDoc")),
              slug: q.Select(["data", "slug"], q.Var("mentorDoc")),
              role: q.Select(["data", "role"], q.Var("mentorDoc")),
              company: q.Select(["data", "company"], q.Var("mentorDoc")),
              day1Table: q.Select(
                ["data", "day1Table"],
                q.Var("mentorDoc"),
                null
              ),
              day2Table: q.Select(
                ["data", "day2Table"],
                q.Var("mentorDoc"),
                null
              ),
              feedbackSubmittedFor: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(q.Index("feedback_by_mentor"), q.Var("mentorRef"))
                )
              ),
            }
          )
        )
      )
    ),
    startups: q.Select(
      ["data"],
      q.Map(
        q.Paginate(q.Documents(q.Collection("Startups"))),
        q.Lambda(
          "startupRef",
          q.Let(
            {
              startupDoc: q.Get(q.Var("startupRef")),
            },
            {
              id: q.Select(["ref", "id"], q.Var("startupDoc")),
              name: q.Select(["data", "name"], q.Var("startupDoc")),
              city: q.Select(["data", "city"], q.Var("startupDoc")),
              country: q.Select(["data", "country"], q.Var("startupDoc")),
              image: q.Select(["data", "image"], q.Var("startupDoc")),
              slug: q.Select(["data", "slug"], q.Var("startupDoc")),
            }
          )
        )
      )
    ),
  });

  const mentor = results.mentor[0];
  const startups = results.startups;

  startups.forEach((startup) => {
    startup.feedbackSubmitted = mentor.feedbackSubmittedFor.includes(
      startup.id
    );
  });

  return {
    props: { startups, mentor },
  };
}

export default function Account({ mentor, startups }) {
  const tables = [];
  if (mentor.day1Table) {
    tables.push({
      date: "Wed 4th",
      month: "December",
      tableNo: mentor.day1Table,
    });
  }
  if (mentor.day2Table) {
    tables.push({
      date: "Thu 5th",
      month: "December",
      tableNo: mentor.day2Table,
    });
  }

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
                    src={mentor.photo}
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
              <div className="px-4 pt-8 lg:pt-0">
                <div className="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12">
                  <p className="text-xl font-semibold">
                    Hi {mentor.firstName},
                  </p>
                  <p className="pt-4">
                    Welcome to our new Selection Days mentor dashboard.
                  </p>
                  <p className="pt-4">
                    You can now view and edit your own mentor profile which will
                    be automatically updated on the website. After you leave
                    your feedback for the startups, you can also now revisit and
                    amend your reviews.
                  </p>
                  <p className="pt-4">
                    If you have any problems or feedback about the new
                    dashboard,{" "}
                    <a
                      className="text-teal-500 underline"
                      href="mailto:josh.meney@startupbootcamp.org"
                    >
                      please get in touch
                    </a>
                    .
                  </p>
                  <h3 className="pt-8 text-xl font-semibold">Your table:</h3>
                  <div className="flex flex-wrap pt-4">
                    {tables.map((table) => {
                      return (
                        <div
                          className="w-full md:w-1/2 lg:w-2/3 xl:w-1/2"
                          key={table.month + " " + table.date}
                        >
                          <div className="flex items-center justify-between px-5 py-3 mb-4 mr-0 border border-gray-200 rounded-lg md:mr-4 lg:mr-0 xl:mr-4 xl:mb-0">
                            <span className="">
                              {table.date}
                              <span className="inline"> {table.month}</span>
                            </span>
                            <span className="inline-block px-4 py-1 font-semibold text-teal-900 bg-teal-200 rounded-full">
                              Table {table.tableNo}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-4 pt-4 lg:pt-0">
                <div className="mt-8 bg-white rounded-lg shadow">
                  {startups.map((startup) => {
                    return (
                      <div
                        className="flex items-center justify-between px-8 sm:px-12 border-b border-gray-200"
                        key={startup.id}
                      >
                        <div className="flex items-center py-4">
                          <img
                            className="hidden object-cover w-24 h-24 mr-8 border-2 rounded-full md:block border-grey-200"
                            src={startup.image}
                          />
                          <div>
                            <p className="text-xl font-semibold">
                              {startup.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {startup.city + ", " + startup.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <Link href={`/dashboard/feedback?startup=${startup.slug}`}>
                            {startup.feedbackSubmitted ? (
                              <a className="w-20 py-2 font-semibold text-center text-gray-700 bg-gray-200 rounded sm:w-40 hover:shadow-lg hover:bg-teal-600">
                                <span className="inline sm:hidden">Edit</span>
                                <span className="hidden sm:inline">
                                  Edit Feedback
                                </span>
                              </a>
                            ) : (
                              <a className="w-20 py-2 font-semibold text-center text-white bg-teal-500 rounded sm:w-40 hover:shadow-lg hover:bg-teal-600">
                                <span className="inline sm:hidden">Rate</span>
                                <span className="hidden sm:inline">
                                  Leave Feedback
                                </span>
                              </a>
                            )}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
