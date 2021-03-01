import { useState } from "react";
import EditTeamMemberForm from "@/components/EditTeamMemberForm";
import AddTeamMemberForm from "@/components/AddTeamMemberForm";
import EditStartupForm from "@/components/EditStartupForm";
import { Transition } from "@headlessui/react";
import { q, client } from "@/utils/fauna";

export async function getServerSideProps({ params }) {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("startups_by_slug"), params.slug)),
      q.Lambda("startupRef", q.Get(q.Var("startupRef")))
    )
  );

  const startup = results.data[0].data;
  startup.id = results.data[0].ref.id;
  const team = (await getTeamMembers(startup.id)) || [];
  console.log(startup);

  return {
    props: {
      startup,
      team,
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

export default function EditStartup({ startup, team }) {
  // Seperate startup details and team details into 2 seperate objects
  // Convert team array into object with team member id as key to make lookup easier
  let members = {};
  team.forEach((member) => {
    members[member.id] = member;
  });

  const [teamMembers, setTeamMembers] = useState(members);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);

  function handleTeamMemberDelete(teamMemberId) {
    // Remove team member from state
    const newTeam = { ...teamMembers };
    delete newTeam[teamMemberId];

    setTeamMembers(newTeam);
  }

  return (
    <div>
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
              Edit Startup Details
            </h1>
          </div>
        </div>
      </div>
      <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
        <EditStartupForm startup={startup} />
        <div className="p-8" />
        <div className="pt-12 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Team
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Edit your team members' details below.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 w-48 disabled:opacity-50"
              disabled={isAddingTeamMember}
              onClick={(e) => setIsAddingTeamMember(!isAddingTeamMember)}
            >
              + Add Team Member
            </button>
          </div>
        </div>
        <div className="space-y-8 w-full">
          <div className="space-y-8 sm:space-y-5">
            <div>
              <div>
                <Transition
                  show={isAddingTeamMember}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <AddTeamMemberForm
                    startupId={startup.id}
                    onCancel={() => setIsAddingTeamMember(!isAddingTeamMember)}
                    onAdd={(teamMember) => {
                      const newTeam = { ...team };
                      newTeam[teamMember.id] = teamMember;
                      console.log(newTeam);
                      setTeamMembers(newTeam);
                      setIsAddingTeamMember(false);
                    }}
                  />
                </Transition>
                {Object.keys(teamMembers).map((key) => {
                  return (
                    <EditTeamMemberForm
                      key={key}
                      name={teamMembers[key].name}
                      role={teamMembers[key].role}
                      twitter={teamMembers[key].twitter}
                      linkedIn={teamMembers[key].linkedIn}
                      image={teamMembers[key].image}
                      id={key}
                      onDelete={() => handleTeamMemberDelete(key)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
