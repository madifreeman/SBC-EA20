import React from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import TeamMember from "../../src/components/TeamMember";

const airtable = new Airtable({
  apiKey: "keyqNRJIfyYYszvny"
});

export async function getStaticPaths() {
  const records = await airtable
    .base("appzJwVbIs7gBM2fm")("Mentors")
    .select({
      fields: ["Slug"],
    })
    .all();
  const paths = records.map((record) => {
    return {
      params: {
        slug: record.get("Slug"),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const records = await airtable
    .base("appzJwVbIs7gBM2fm")("Mentors")
    .select({
      filterByFormula: `Slug="${params.slug}"`,
    })
    .all();

  const mentor = {
    name: records[0].get("Name"),
    slug: records[0].get("Slug"),
    image: records[0].get("Photo")[0].url,
    company: records[0].get("Company"),
    role: records[0].get("Role"),
    city: records[0].get("City") || "",
    country: records[0].get("Country") || "",
    linkedIn: records[0].get("LinkedIn") || "",
    bio: records[0].get("Bio"),
    // day1Table: records[0].get("Day 1 Table"),
    // day2Table: records[0].get("Day 2 Table"),
    expertise: records[0].get("Expertise"),
  };
  return {
    props: { mentor },
  };
}

export default function MentorProfile({ mentor }) {
  return (
    <div>
      <Header height="36" />
      <div className="relative px-4 xs:px-8 mt-16">
        <div className="container mx-auto -mt-16">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-full lg:w-2/5 xl:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center md:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto rounded-full md:mx-0 lg:mx-auto"
                    src={mentor.image}
                  />
                  <div className="w-full pt-4 pl-0 mx-auto md:w-auto lg:w-full md:mx-0 lg:mx-auto md:pl-8 lg:pl-0">
                    <h1 className="text-2xl font-semibold">{mentor.name}</h1>
                    <h2 className="pt-3 text-xl">{mentor.company}</h2>
                    <p>{mentor.role}</p>
                    <p className="pt-3">
                      {mentor.city + ", " + mentor.country}
                    </p>
                    {/* <ul className="flex justify-center pt-4 text-gray-500 md:justify-start lg:justify-center">
                        <li>
                            <a href={mentor.linkedIn}>
                                <i className="mx-2 text-3xl text-teal-500 cursor-pointer fab fa-linkedin hover:text-teal-400" aria-hidden="true">
                                    ::before
                                </i>
                            </a>
                        </li>

                    </ul> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 pt-8 md:w-full lg:w-3/5 xl:w-2/3 lg:pt-0">
              <div className="px-8 py-12 bg-white rounded-lg shadow md:p-12">
                <h3 className="text-xl font-semibold">Mentor Table:</h3>
                <div className="flex flex-wrap pt-4">
                  <div className="w-full lg:w-2/3 xl:w-1/2">
                    <div className="flex items-center justify-between px-5 py-3 mb-4 mr-0 border border-gray-200 rounded-lg md:mr-4 lg:mr-0 xl:mr-4 xl:mb-0">
                      {/* TODO: populate tables from DB */}
                      <span>
                        Wed 4th December
                        <span className="hidden xs:inline">December</span>
                      </span>
                      <span className="inline-block px-4 py-1 font-semibold text-teal-900 bg-teal-200 rounded-full">
                        Table 20
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-8">
                  <h3 className="pb-4 text-xl font-semibold">
                    About {mentor.name}:
                  </h3>
                  <p>
                    {mentor.bio}
                  </p>
                </div>
                <div className="pt-8">
                  <h3 className="pb-4 text-xl font-semibold">Areas of Expertise:</h3>
                  {mentor.expertise.map((area) => {
                    return <span className="inline-block px-4 py-1 mb-3 mr-2 font-semibold text-teal-900 bg-teal-200 rounded-full">{area}</span>
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
