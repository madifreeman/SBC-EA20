import React from "react";
import TeamMember from "@/components/TeamMember";
import { q, client } from "@/utils/fauna";
import {
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  GlobeIcon,
  MailIcon,
} from "@/public/icons";

export async function getStaticPaths() {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Startups"))),
      q.Lambda(
        "startupRef",
        q.Let(
          {
            startupDoc: q.Get(q.Var("startupRef")),
          },
          {
            slug: q.Select(["data", "slug"], q.Var("startupDoc")),
          }
        )
      )
    )
  );

  const paths = results.data.map((record) => {
    return {
      params: {
        slug: record.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("startups_by_slug"), params.slug)),
      q.Lambda("startupRef", q.Get(q.Var("startupRef")))
    )
  );

  const startup = results.data[0].data;
  startup.id = results.data[0].ref.id;
  startup.team = (await getTeamMembers(startup.id)) || [];

  return {
    props: {
      startup,
    },
  };

  async function getTeamMembers(startup) {
    const results = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("teamMembers_by_startup"), startup)),
        q.Lambda(
          "teamMemberRef",
          q.Let(
            {
              teamMemberDoc: q.Get(q.Var("teamMemberRef")),
            },
            {
              id: q.Select(["ref", "id"], q.Var("teamMemberDoc")),
              name: q.Select(["data", "name"], q.Var("teamMemberDoc")),
              image: q.Select(["data", "image"], q.Var("teamMemberDoc")),
              twitter: q.Select(["data", "twitter"], q.Var("teamMemberDoc")),
              linkedIn: q.Select(["data", "linkedIn"], q.Var("teamMemberDoc")),
              role: q.Select(["data", "role"], q.Var("teamMemberDoc")),
            }
          )
        )
      )
    );
  
    const teamMembers = results.data;
  
    return teamMembers;
  }
}


export default function StartupProfile({ startup }) {
  const qAndAs = [
    {
      question: "The problem we're solving",
      answer: startup.problem,
    },
    {
      question: "Our solution",
      answer: startup.solution,
    },
    {
      question: "Our differentiator",
      answer: startup.different,
    },
    {
      question: "Biggest Achievement",
      answer: startup.achievement,
    },
  ];

  return (
    <div className="-mt-8">
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
                            <GlobeIcon width="6" />
                          </a>
                        </li>
                      ) : null}
                      {startup.email ? (
                        <li className="px-3">
                          <a href={`mailto:${startup.email}`}>
                            <MailIcon width="6" />
                          </a>
                        </li>
                      ) : null}
                      {startup.linkedIn ? (
                        <li className="px-3">
                          <a href={startup.linkedIn}>
                            <LinkedInIcon width="6" />
                          </a>
                        </li>
                      ) : null}
                      {startup.twitter ? (
                        <li className="px-3">
                          <a href={startup.twitter}>
                            <TwitterIcon width="6" />
                          </a>
                        </li>
                      ) : null}
                      {startup.instagram ? (
                        <li className="px-3">
                          <a href={startup.instagram}>
                            <InstagramIcon width="6" />
                          </a>
                        </li>
                      ) : null}
                      {startup.facebook ? (
                        <li className="px-3">
                          <a href={startup.facebook}>
                            <FacebookIcon width="6" />
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
                {qAndAs.map((qAndA) => (
                  <div key={qAndA.question}>
                    <h3 className="pb-2 text-xl font-semibold">{qAndA.question}</h3>
                    <p className="pb-8 text-lg">{qAndA.answer}</p>
                  </div>
                ))}
                <div>
                  <h3 className="pb-2 text-xl font-semibold">Program themes:</h3>
                  {startup.themes.map((theme) => (
                    <span key={theme} className="tag mb-3 mr-2">
                      {theme}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="pb-2 text-xl font-semibold">
                    Team members:
                    <div className="flex flex-wrap pt-4">
                      {startup.team.map((teamMember) => {
                        return (
                          <TeamMember
                            key={teamMember.name}
                            name={teamMember.name}
                            role={teamMember.role}
                            img={teamMember.image}
                            linkedIn={teamMember.linkedIn}
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
    </div>
  );
}

