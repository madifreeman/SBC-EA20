import Header from "../src/components/Header";
import Mentor from "../src/components/Mentor";
import Airtable from "airtable";

export async function getStaticProps() {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  });

  const records = await airtable
    .base(process.env.AIRTABLE_BASE_ID)("Mentors")
    .select({
      fields: ["Name", "Photo", "Company", "Role", "Slug"],
    })
    .all();

  const mentors = records.map((mentor) => {
    return {
      name: mentor.get("Name"),
      slug: mentor.get("Slug"),
      image: mentor.get("Photo")[0].url,
      company: mentor.get("Company"),
      role: mentor.get("Role"),
    };
  });

  return {
    props: {
      mentors,
    },
  };
}


export default function Mentors({ mentors }) {
  return (
    <div>
      <Header height="36" />
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
                <Mentor
                  key={mentor.slug}
                  name={mentor.name}
                  img={mentor.image}
                  link={"/mentor/" + mentor.slug}
                  company={mentor.company}
                  role={mentor.role}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
