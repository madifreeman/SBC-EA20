import { q, client } from "@/utils/fauna";
import Link from "next/link";

export async function getStaticProps() {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Mentors"))),
      q.Lambda(
        "mentorRef",
        q.Let(
          {
            mentorDoc: q.Get(q.Var("mentorRef")),
          },
          {
            firstName: q.Select(["data", "firstName"], q.Var("mentorDoc")),
            lastName: q.Select(["data", "lastName"], q.Var("mentorDoc")),
            image: q.Select(["data", "image"], q.Var("mentorDoc")),
            slug: q.Select(["data", "slug"], q.Var("mentorDoc")),
            company: q.Select(["data", "company"], q.Var("mentorDoc")),
            role: q.Select(["data", "role"], q.Var("mentorDoc")),
          }
        )
      )
    )
  );

  const mentors = results.data;

  return {
    props: {
      mentors,
    },
  };
}

export default function Mentors({ mentors }) {
  return (
    <div>
      <div className="relative mt-16 px-4 xs:px-8">
        <div className="container mx-auto -mt-16">
          <div className="-mt-16 px-8 pt-4 pb-8 bg-white rounded-lg shadow">
            <div className="flex flex-wrap justify-between xs:pt-4">
              <h2 className="w-full lg:w-1/4 text-3xl font-semibold text-gray-700 self-end py-4">
                Mentors
                <span className="font-normal text-gray-400">(182)</span>
              </h2>
              {/* TODO: Make form interactive */}
              <form
                method="POST"
                action="/mentors"
                className="w-full lg:w-3/4 text-lg flex flex-wrap items-baseline justify-start lg:justify-end pt-4 sm:pt-0"
              >
                <div>
                  <label className="inline-flex items-baseline cursor-pointer pr-4">
                    <input
                      name="day"
                      type="radio"
                      value="day-1"
                      className="form-radio h-6 w-6 text-teal-600 self-end cursor-pointer"
                      required
                    />
                    <span className="ml-2 text-gray-700 cursor-pointer">
                      Day 1
                    </span>
                  </label>
                  <label className="inline-flex items-baseline cursor-pointer">
                    <input
                      name="day"
                      type="radio"
                      value="day-1"
                      className="form-radio h-6 w-6 text-teal-600 self-end cursor-pointer"
                      required
                    />
                    <span className="ml-2 text-gray-700 cursor-pointer">
                      Day 2
                    </span>
                  </label>
                </div>
                <div className="flex flex-no-wrap w-full sm:w-auto ml-0 sm:ml-8 pt-4 md:pt-0">
                  <label className="block">
                    <select
                      name="table"
                      className="block w-full mt-1 text-gray-700 cursor-pointer border border-gray rounded py-3 pl-3 pr-10"
                    >
                      <option value="all">All tables</option>
                      {/* TODO: Add other options  */}
                    </select>
                  </label>
                </div>
              </form>
            </div>
          </div>
          <div className="container mx-auto">
            <div className="flex flex-wrap items-stretch -m-2 pt-4">
              {mentors.map((mentor) => (
                <div
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 z-0 hover:z-10 p-2"
                  key={mentor.slug}
                >
                  <Link href={"/mentors/" + mentor.slug}>
                    <a className="block h-full">
                      <div className="h-full flex flex-wrap xs:flex-no-wrap sm:flex-wrap px-8 md:px-8 py-8 md:py-12 bg-white shadow hover:shadow-lg group rounded cursor-pointer">
                        <img
                          className="h-24 w-24 sm:h-32 sm:w-32 mx-auto xs:mr-4 xs:ml-0 sm:mx-auto object-cover rounded-full border-white group-hover:border-teal-500 border-4"
                          src={mentor.image}
                        />
                        <div className="w-full xs:w-2/3 sm:w-full sm:mt-4 text-center xs:text-left sm:text-center self-center">
                          <h2 className="text-lg md:text-xl text-gray-700 group-hover:text-teal-500 font-semibold truncate">
                            {mentor.firstName + " " + mentor.lastName}
                          </h2>
                          <p className="text-gray-600 truncate">
                            {mentor.company}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {mentor.role}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
