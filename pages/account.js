import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Airtable from "airtable";

export async function getStaticProps() {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  });

  const records = await airtable
    .base(process.env.AIRTABLE_BASE_ID)("Mentors")
    .select({
      fields: ["First Name", "Last Name", "Photo", "Slug", "Role", "Company"],
      filterByFormula: "Slug='caitlin-ofarrell'",
    })
    .all();

  const mentor = {
    firstName: records[0].get("First Name") || "",
    lastName: records[0].get("Last Name") || "",
    id: records[0].getId(),
    slug: records[0].get("Slug") || "",
    role: records[0].get("Role") || "",
    company: records[0].get("Company") || "",
    photo: records[0].get("Photo")[0].url || "",
  };

  return {
    props: {
      mentor,
    },
  };
}

export default function Account({mentor}) {
  const tables = [
    { date: "Wed 4th", month: "December", tableNo: "20" },
    { date: "Thu 5th", month: "December", tableNo: "20" },
  ];
  return (
    <div>
      <Header height="36" />
      <div className="relative pt-12 px-4 xs:px-8">
        <div className="container mx-auto -mt-16">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-full lg:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center sm:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto rounded-full sm:mx-0 lg:mx-auto"
                    src={mentor.photo}
                  />
                  <div className="w-full pt-4 pl-0 mx-auto sm:w-auto lg:w-full sm:mx-0 lg:mx-auto sm:pl-8 lg:pl-0">
                    <h1 className="text-2xl font-semibold">{mentor.firstName} {mentor.lastName}</h1>
                    <h2 className="pt-3 text-xl">{mentor.company}</h2>
                    <p>{mentor.role}</p>
                    <div className="flex justify-center pt-4 mt-2 text-gray-500 sm:justify-start lg:justify-center">
                      <a
                        href="#"
                        className="px-4 py-2 text-base font-semibold text-white bg-teal-500 rounded hover:shadow-lg hover:bg-teal-600"
                      >
                        Edit Profile
                      </a>
                      <a
                        href="#"
                        className="px-4 py-2 ml-4 text-base font-semibold text-gray-700 bg-gray-200 rounded hover:shadow-lg hover:bg-gray-300"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 pt-8 md:w-full lg:w-2/3 lg:pt-0">
              <div className="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12">
                <p className="text-xl font-semibold">Hi {mentor.firstName},</p>
                <p className="pt-4">
                  Welcome to our new Selection Days mentor dashboard.
                </p>
                <p className="pt-4">
                  You can now view and edit your own mentor profile which will
                  be automatically updated on the website. After you leave your
                  feedback for the startups, you can also now revisit and amend
                  your reviews.
                </p>
                <p className="pt-4">
                  If you have any problems or feedback about the new dashboard,{" "}
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
                      <div className="w-full md:w-1/2 lg:w-2/3 xl:w-1/2">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
