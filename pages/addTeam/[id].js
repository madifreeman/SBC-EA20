import React, { useState, useRef } from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import AddTeamMemberForm from "../../src/components/AddTeamMemberForm";
import EditTeamMemberForm from "../../src/components/EditTeamMemberForm";

export async function getServerSideProps({ params }) {
  console.log(params);
  return {
    props: { params },
  };
}

export default function AddTeam({ params }) {
  const [team, setTeam] = useState({});
  const [addingTeamMember, setAddingTeamMember] = useState(false);
  console.log(params.id);

  function handleTeamMemberDelete(teamMemberId) {
    // Remove team member from DB
    airtable
      .base(process.env.AIRTABLE_BASE_ID)("Team Members")
      .destroy([teamMemberId]),
      function (err, deletedRecords) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Deleted", deletedRecords.length, "records");
      };
    // Remove team member from state
    const newTeam = { ...team };
    delete newTeam[teamMemberId];
    setTeam({ team: newTeam });
  }

  return (
    <div>
      <Header height="36" />
      <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
        <div>
        <div className="pt-4 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Add Team Member
            </h3>
          </div>
          <div></div>
        </div>
        <div className="space-y-8 divide-y divide-gray-200 w-full">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <div className="">
                  <AddTeamMemberForm
                    startupId={params.id}
                    onCancel={() => setAddingTeamMember(!addingTeamMember)}
                    onAdd={(teamMember) => {
                      const newTeam = { ...team };
                      newTeam[teamMember.id] = teamMember;
                      console.log(newTeam);
                      setTeam(newTeam);
                      setAddingTeamMember({ addingTeamMember: false });
                    }}
                  />
                </div>

                <h3
                  className={`${
                    team ? "block" : "hidden"
                  } text-lg leading-6 font-medium text-gray-900 mt-8`}
                >
                  Current Team Members
                </h3>
                {Object.keys(team).map((key) => {
                  return (
                    <EditTeamMemberForm
                      key={key}
                      name={team[key].name}
                      role={team[key].role}
                      twitter={team[key].twitter}
                      linkedIn={team[key].linkedIn}
                      image={team[key].image}
                      id={key}
                      onDelete={() => handleTeamMemberDelete(team[key].id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="mt-12 flex flex-wrap">
          <a
            href={`/manageStartups`}
            className="block text-center py-2 px-4 rounded float-right font-semibold mr-2 cursor-pointer  border-2 border-teal-500 text-teal-500 hover:text-white hover:bg-teal-600 w-28"
          >
            Save
          </a>
          {/* <button className=""
          onClick={()=> }>Save</button> */}
          <button
            className="block py-2 px-4 rounded float-right font-semibold mr-2 cursor-pointer border-2 border-teal-500 text-teal-500 hover:text-white hover:bg-teal-600 w-28"
            onClick={() => {
              airtable
                .base(process.env.AIRTABLE_BASE_ID)("Startups")
                .destroy([startup.id])
                .then(() => {
                  window.location.href = "/manageStartups";
                });
            }}
            // TODO: delete team members from Team Members DB
          >
            Cancel
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
