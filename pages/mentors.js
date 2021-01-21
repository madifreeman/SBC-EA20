import Header from "../src/components/Header";
import Mentor from "../src/components/Mentor";
import Airtable from "airtable";

export async function getStaticProps() {
  const airtable = new Airtable({
    apiKey: keyqNRJIfyYYszvny
  });

  const records = await airtable
    .base("appzJwVbIs7gBM2fm")("Mentors")
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

// export async function getStaticProps({ params }) {
//   const records = await airtable
//     .base("appzJwVbIs7gBM2fm")("Startups")
//     .select({
//       filterByFormula: `Slug="${params.slug}"`,
//     })
//     .all();

//   const startup = {
//       name: records[0].get("Name"),
//       slug: records[0].get("Slug"),
//       image: records[0].get("Photo")[0].url,
//       city: records[0].get("City"),
//       country: records[0].get("Country"),
//       description: records[0].get("Short Description"),
//       themes: records[0].get("Themes"),
//       problem: records[0].get("Problem"),
//       solution: records[0].get("Solution"),
//       different: records[0].get("Different"),
//       achievement: records[0].get("Achievement"),
//       website: records[0].get("Website"),
//       team: await getTeamMembers(records[0].get("Name"))
//     };
//   return {
//     props: { startup },
//   };
// }

export default function Mentors({ mentors }) {
  console.log(mentors);
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
