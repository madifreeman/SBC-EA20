import React, { useState } from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import EditTeamMemberForm from "../../src/components/EditTeamMemberForm";
import AddTeamMemberForm from "../../src/components/AddTeamMemberForm";
import EditStartupForm from "../../src/components/EditStartupForm";
import { Transition } from "@headlessui/react";
import { q, client } from "../../src/fauna";

export async function getServerSideProps({ params }) {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("startups_by_slug"), params.slug)),
      q.Lambda("startupRef", q.Get(q.Var("startupRef")))
    )
  );

  const startup = results.data[0].data
  startup.id = results.data[0].ref.id
  startup.team = await getTeamMembers(startup.id) || [];
  console.log(startup)

  return {
    props: {
      startup,
    },
  };
}


export async function getTeamMembers(startup) {
  // When team members in seperate 
  console.log(startup)
  const results = await client
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index("teamMembers_by_startup"), startup)),
        q.Lambda("teamMemberRef", q.Let(
          {
            teamMemberDoc: q.Get(q.Var("teamMemberRef"))
          }, 
          {
            id: q.Select(["ref", "id"], q.Var("teamMemberDoc")),
            name: q.Select(["data", "name"], q.Var("teamMemberDoc")),
            image: q.Select(["data", "image"], q.Var("teamMemberDoc")),
            twitter: q.Select(["data", "twitter"], q.Var("teamMemberDoc")),
            linkedIn: q.Select(["data", "linkedIn"], q.Var("teamMemberDoc")),
            role: q.Select(["data", "role"], q.Var("teamMemberDoc")),
          }
        ))
      )
    )
  
  const teamMembers = results.data

  return teamMembers;
}

class EditStartup extends React.Component {
  constructor(props) {
    super(props);

    // Seperate startup details and team details into 2 seperate objects
    const { team, ...startup } = props.startup;

    // Convert team array into object with team member id as key
    let teamMembers = {};
    team.forEach((teamMember) => {
      teamMembers[teamMember.id] = teamMember;
    });

    this.state = {
      team: teamMembers, // Keep track of team members as they are added/deleted so that they can be displayed/edited
      addingTeamMember: false, // Determines whether add member form is displayed
    };

    this.handleTeamMemberDelete = this.handleTeamMemberDelete.bind(this);
  }

  handleTeamMemberDelete(teamMemberId) {
    // Remove team member from state
    const newTeam = { ...this.state.team };
    delete newTeam[teamMemberId];

    this.setState({ team: newTeam });
  }

  render() {
    return (
      <div>
        <Header height="36" />
        <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <div>
              <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
                Edit Startup Details
              </h1>
            </div>
          </div>
        </div>
        {/* ######################################### EDIT STARTUP ######################################### */}
        <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
          <EditStartupForm startup={this.props.startup} />
          <div className="p-8" />
          {/* ######################################### EDIT TEAM ######################################### */}
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
                disabled={this.state.addingTeamMember}
                onClick={(e) => {
                  this.setState({
                    addingTeamMember: !this.state.addingTeamMember,
                  });
                }}
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
                    show={this.state.addingTeamMember}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    {/* <div
                      className={`${
                        !this.state.addingTeamMember ? "hidden" : "block"
                      }`}
                    > */}
                    <AddTeamMemberForm
                      startupId={this.props.startup.id}
                      onCancel={() => {
                        this.setState({
                          addingTeamMember: !this.state.addingTeamMember,
                        });
                      }}
                      onAdd={(teamMember) => {
                        const newTeam = { ...this.state.team };
                        newTeam[teamMember.id] = teamMember;
                        console.log(newTeam)
                        this.setState({ team: newTeam });
                        this.setState({ addingTeamMember: false });
                      }}
                    />
                  </Transition>
                  {/* </div> */}
                  {Object.keys(this.state.team).map((key) => {
                    return (
                      <EditTeamMemberForm
                        key={key}
                        name={this.state.team[key].name}
                        role={this.state.team[key].role}
                        twitter={this.state.team[key].twitter}
                        linkedIn={this.state.team[key].linkedIn}
                        image={this.state.team[key].image}
                        id={key}
                        onDelete={this.handleTeamMemberDelete}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default EditStartup;
