import React, { useState } from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import TextInput from "../../src/components/TextInput";
import FileUpload from "../../src/components/FileUpload";
import EditTeamMemberForm from "../../src/components/EditTeamMemberForm";
import AddTeamMemberForm from "../../src/components/AddTeamMemberForm";
import ProfileImage from "../../src/components/ProfileImage";
import { useForm } from "react-hook-form";
import EditStartupForm from "../../src/components/EditStartupForm";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

export async function getServerSideProps(context) {
  let params = context.params;
  const records = await airtable
    .base(process.env.AIRTABLE_BASE_ID)("Startups")
    .select({
      filterByFormula: `Slug="${params.slug}"`,
    })
    .all();
  const startup = {
    id: records[0].id,
    name: records[0].get("Name") || "",
    slug: records[0].get("Slug") || "",
    image: records[0].get("Photo")[0].url || "",
    city: records[0].get("City") || "",
    country: records[0].get("Country") || "",
    description: records[0].get("Short Description") || "",
    themes: records[0].get("Themes") || "",
    problem: records[0].get("Problem") || "",
    solution: records[0].get("Solution") || "",
    different: records[0].get("Different") || "",
    achievement: records[0].get("Achievement") || "",
    website: records[0].get("Website") || "",
    email: records[0].get("Email") || "",
    linkedIn: records[0].get("LinkedIn") || "",
    twitter: records[0].get("Twitter") || "",
    facebook: records[0].get("Facebook") || "",
    team: (await getTeamMembers(records[0].get("Name"))) || "",
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
      id: member.id,
      name: member.get("Name"),
      role: member.get("Role"),
      image: member.get("Photo") ? member.get("Photo")[0].url : "",
      twitter: member.get("Twitter") || "",
      linkedIn: member.get("LinkedIn") || "",
    };
  });

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
      addingTeamMember: false // Determines whether add member form is displayed
    };

    this.handleTeamMemberDelete = this.handleTeamMemberDelete.bind(this);
  }

  handleTeamMemberDelete(teamMemberId) {
    // Remove team member from DB
    airtable
      .base(process.env.AIRTABLE_BASE_ID)("Team Members")
      .destroy([teamMemberId]),
      function (err, deletedRecords) {
        if (err) {
          console.error(err);
          return;
        }
      };
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
          <EditStartupForm startup={this.props.startup}/>
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
          <div className="space-y-8 divide-y divide-gray-200 w-full">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <div
                    className={`${
                      !this.state.addingTeamMember ? "hidden" : "block"
                    }`}
                  >
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
                        console.log("newTeam", newTeam)
                        this.setState({ team: newTeam });
                        this.setState({ addingTeamMember: false });
                      }}
                    />
                  </div>
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
