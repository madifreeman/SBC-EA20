import { useState } from "react";
import EditTeamMemberForm from "@/components/EditTeamMemberForm";
import AddTeamMemberForm from "@/components/AddTeamMemberForm";
import EditStartupForm from "@/components/EditStartupForm";
import { Transition } from "@headlessui/react";
// import { q, client } from "@/utils/fauna";
import client from "@/utils/sanity";
import groq from "groq";
import { jsonFetcher } from "@/utils/jsonFetcher";

export async function getServerSideProps({ params }) {
  // SANITY
  const slug = params.slug;
  const query = groq`*[_type == "startup" && slug.current == $slug][0]{
    "startup": { 
      name, 
      city, 
      country, 
      description, 
      problem, 
      solution, 
      different, 
      achievement, 
      themes, 
      website, 
      email, 
      twitter, 
      facebook, 
      image,
      linkedIn,
      'slug': slug.current, 
      _id},
    "team": teamMembers[]->{name, role, twitter, linkedIn, image, _id}
  }`;

  const result = await client.fetch(query, { slug });

  return {
    props: result,
  };
}

export default function EditStartup({ startup, team }) {
  // Seperate startup details and team details into 2 seperate objects
  // Convert team array into object with team member id as key to make lookup easier
  let members = {};
  team.forEach((member) => {
    members[member._id] = member;
  });
  console.log(members)

  const [teamMembers, setTeamMembers] = useState(members);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);

  async function handleTeamMemberDelete(teamMemberID) {
    // Remove team member from state
    const body = {
      id: startup._id,
      unset: [`teamMembers[_ref=="${teamMemberID}"]`]
    }
    const newTeam = { ...teamMembers };
    delete newTeam[teamMemberID];
    setTeamMembers(newTeam);

    // Delete from Team Member Array on Startup
    const result = await putRequest(body);
    // Delete document all together
    console.log("something else")
    await jsonFetcher(`/api/team-members/${teamMemberID}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: teamMemberID})
    });

    
  }

  async function handleAddTeamMember(teamMember) {
      const newTeam = {...teamMembers};
      newTeam[teamMember._id] = teamMember;
      const body = {
        id: startup._id,
        toInsert: {
          at: 'after',
          position: "teamMembers[-1]",
          items: [{
          _type: "reference",
          _ref: teamMember._id,
          _key: teamMember._id
        }]
        }  
      }
      
      console.log(newTeam)
      const result = await putRequest(body);

      setTeamMembers(newTeam);
      setIsAddingTeamMember(false);
    }

    async function putRequest(body) {
      const result = await jsonFetcher(`/api/startups/${startup._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
      console.log("putted")
      return result;
    }


  return (
    <div className="-mt-8">
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
                    onAdd={(teamMember) => handleAddTeamMember(teamMember) }
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
                      _id={teamMembers[key]._id}
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
