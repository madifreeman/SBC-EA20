import React from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import TeamMember from "../../src/components/TeamMember";
import {
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  GlobeIcon,
  MailIcon
} from "../../public/icons";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

export async function getStaticPaths() {
  const records = await airtable
    .base(process.env.AIRTABLE_BASE_ID)("Startups")
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
    .base("appzJwVbIs7gBM2fm")("Startups")
    .select({
      filterByFormula: `Slug="${params.slug}"`,
    })
    .all();

  const startup = {
    name: records[0].get("Name") || "",
    slug: records[0].get("Slug") || "",
    image: records[0].get("Photo") ? records[0].get("Photo")[0].url : "",
    city: records[0].get("City") || "",
    country: records[0].get("Country") || "",
    description: records[0].get("Short Description") || "",
    themes: records[0].get("Themes") || [],
    problem: records[0].get("Problem") || "",
    solution: records[0].get("Solution") || "",
    different: records[0].get("Different") || "",
    achievement: records[0].get("Achievement") || "",
    website: records[0].get("Website") || "",
    team: (await getTeamMembers(records[0].get("Name"))) || "",
    linkedIn: records[0].get("LinkedIn") || "",
    email: records[0].get("Email") || "",
    twitter: records[0].get("Twitter") || "",
    instagram: records[0].get("Instagram") || "",
    facebook: records[0].get("Facebook") || "",
  };
  return {
    props: { startup },
  };
}

export async function getTeamMembers(startup) {
  const records = await airtable
    .base("appzJwVbIs7gBM2fm")("Team Members")
    .select({
      fields: ["Name", "Role", "Photo", "Twitter", "LinkedIn"],
      filterByFormula: `Startup="${startup}"`,
    })
    .all();
  const teamMembers = records.map((member) => {
    return {
      name: member.get("Name"),
      role: member.get("Role"),
      image: member.get("Photo") ? member.get("Photo")[0].url : "",
      twitter: member.get("Twitter") || null,
      linkedIn: member.get("LinkedIn") || null,
    };
  });

  return teamMembers;
}

export default function StartupProfile({ startup }) {
  return (
    <div>
      <Header height="36" />
      <div className="relative px-4 xs:px-8">
        <div className="container mx-auto ">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-full lg:w-2/5 xl:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center md:flex-nowrap lg:flex-wrap md:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto border-2 border-gray-200 rounded-full md:mx-0 lg:mx-auto"
                    src={startup.image}
                  />

                  <div className="w-full pt-4 pl-0 mx-auto md:w-auto lg:w-full md:mx-0 lg:mx-auto md:pl-8 lg:pl-0 md:pt-0 lg:pt-4">
                    <h1 className="text-2xl font-semibold">{startup.name}</h1>
                    <p className="text-gray-500 text-xl">
                      {startup.city + ", " + startup.country}
                    </p>
                    <p className="pt-4">{startup.description}</p>
                    <ul className="pt-4 text-teal-500 flex items-center">
                      {startup.website ? (
                        <li className="px-3">
                          <a href={startup.website}>
                            <GlobeIcon width="6"/>
                          </a>
                        </li>
                      ) : null}
                      {startup.email ? (
                        <li className="px-3">
                          <a href={`mailto:${startup.email}`}>
                            <MailIcon width="6"/>
                          </a>
                        </li>
                      ) : null}
                      {startup.linkedIn ? (
                        <li className="px-3">
                          <a href={startup.linkedIn}>
                            <LinkedInIcon width="6"/>
                          </a>
                        </li>
                      ) : null}
                      {startup.twitter ? (
                        <li className="px-3">
                          <a href={startup.twitter}>
                            <TwitterIcon width="6"/>
                          </a>
                        </li>
                      ) : null}
                      {startup.instagram ? (
                        <li className="px-3">
                          <a href={startup.instagram}>
                            <InstagramIcon width="6"/>
                          </a>
                        </li>
                      ) : null}
                      {startup.facebook ? (
                        <li className="px-3">
                          <a href={startup.facebook}>
                            <FacebookIcon width="6"/>
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 pt-8 md:w-full lg:w-3/5 xl:w-2/3 lg:pt-0">
              <div className="px-8 py-12 bg-white rounded-lg shadow md:p-12">
                <div>
                  <h3 className="profile-heading">The problem we're solving</h3>
                  <p className="pb-8 text-lg">{startup.problem}</p>
                </div>
                <div>
                  <h3 className="profile-heading">Our solution:</h3>
                  <p className="pb-8 text-lg">{startup.solution}</p>
                </div>
                <div>
                  <h3 className="profile-heading">Our differentiator:</h3>
                  <p className="pb-8 text-lg">{startup.different}</p>
                </div>
                <div>
                  <h3 className="profile-heading">Biggest achievement:</h3>
                  <p className="pb-8 text-lg">{startup.achievement}</p>
                </div>
                <div>
                  <h3 className="profile-heading">Program themes:</h3>
                  {startup.themes.map((theme) => {
                    return (
                      <span key={theme} className="tag mb-3 mr-2">
                        {theme}
                      </span>
                    );
                  })}
                </div>
                <div>
                  <h3 className="profile-heading">
                    Team members:
                    <div className="flex flex-wrap pt-4">
                      {startup.team.map((teamMember) => {
                        return (
                          <TeamMember
                            key={teamMember.name}
                            name={teamMember.name}
                            role={teamMember.role}
                            img={teamMember.image}
                            linkedin={teamMember.linkedIn}
                            twitter={teamMember.twitter}
                          />
                        );
                      })}
                    </div>
                  </h3>
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
