import React, { useState, useRef } from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import AddTeamMemberForm from "../../src/components/AddTeamMemberForm";
import EditTeamMemberForm from "../../src/components/EditTeamMemberForm";
import { client, q } from "../../src/fauna";

export async function getServerSideProps({ params }) {
  console.log(params);
  return {
    props: { params },
  };
}

export default function AddTeam({ params }) {
  const [team, setTeam] = useState({});
  const [addingTeamMember, setAddingTeamMember] = useState(false);

  function handleTeamMemberDelete(teamMemberId) {
    // Remove team member from state
    const newTeam = { ...team };
    delete newTeam[teamMemberId];
    setTeam(newTeam);
    // TODO: Add animation or alert to more clearly indicate
    // team member has been deleted 
  }

  return (
    <div>
      <Header height="36" />
      <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between -mt-3">
        <div className="flex w-full items-center justify-between ">
          <div>
            <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
              The Team
            </h1>
          </div>
        </div>
        </div>
        <div className="relative container bg-white rounded shadow-lg w-full mt-8 pt-2 pb-8 px-8 mx-auto  justify-between">
        <div>
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
                <div className="pt-8">
                  <h3
                    className={`${
                      Object.keys(team).length > 0 ? "block" : "hidden"
                    } text-lg leading-6 font-medium text-gray-900 my-2`}
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
        </div>

        <div className="mt-12 flex justify-center font-semibold">
          <a
            href={`/manageStartups`}
            className="block mx-4 shadow-lg text-center py-2 px-4 rounded text-white bg-teal-500 rounded hover:shadow-lg hover:bg-teal-600 w-40"
          >
            Save
          </a>
          <button
            className="block mx-4 shadow-lg py-2 px-4 rounded font-semibold text-gray-700 bg-gray-200 rounded hover:shadow-lg hover:bg-gray-300 w-40"
            onClick={() => {
              // TODO
              airtable
                .base(process.env.AIRTABLE_BASE_ID)("Startups")
                .destroy([startup.id])
                .then(() => {
                  window.location.href = "/manageStartups";
                });
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
