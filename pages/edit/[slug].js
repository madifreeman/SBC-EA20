import React, { useState } from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import TextInput from "../../src/components/TextInput";
import FileUpload from "../../src/components/FileUpload";
import EditTeamMemberForm from "../../src/components/EditTeamMemberForm";
import AddTeamMemberForm from "../../src/components/AddTeamMemberForm";

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
    console.log(props.startup)
    this.state = props.startup;
    this.state.addingTeamMember = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTeamMemberDelete = this.handleTeamMemberDelete.bind(this);
  }
  themes = [
    "Electric Mobility",
    "Energy Management and Customer Empowerment",
    "Energy Marketplace",
    "Grid Integration of Renewables",
    "Net Zero",
    "Smart Buildings and Infrastructure",
    "Other",
  ];
  handleSubmit(e) {
    e.preventDefault();
    airtable
      .base(process.env.AIRTABLE_BASE_ID)("Startups")
      .update(
        [
          {
            id: this.state.id,
            fields: {
              Name: this.state.name,
              // "Photo": [
              //   {
              //     "id": "att1ad0TKWelqBmCq"
              //   }
              // ],
              Website: this.state.website,
              Country: this.state.country,
              LinkedIn: this.state.linkedIn,
              // "Team Members": [
              //   "recW7TnqoKfHSxdca",
              //   "recQ4LlxYc51BoDsD",
              //   "recPVUyX9uNjZWj2O",
              //   "recQwxMKpOchdmfS4",
              //   "recwPPDR0prIGlwDr"
              // ],
              Facebook: this.state.facebook,
              Twitter: this.state.twitter,
              Email: this.state.email,
              "Short Description": this.state.description,
              City: this.state.city,
              Achievement: this.state.achievement,
              Themes: this.state.themes,
              Problem: this.state.problem,
              Solution: this.state.solution,
              Different: this.state.different,
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach(function (record) {
            console.log(record.get("Name"));
          });
        }
      );
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
        console.log("Deleted", deletedRecords.length, "records");
      };
    // Remove team member from state
    const newTeamArray = this.state.team.filter(
      (teamMember) => teamMember.id !== teamMemberId
    );
    console.log(newTeamArray);
    this.setState({ team: newTeamArray });
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
        <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
          <form
            className="space-y-8 divide-y divide-gray-200 w-full"
            onSubmit={this.handleSubmit}
          >
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Startup Profile
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Please note: All startup and team member details entered
                    will be publicly visible on our website. It may take up to
                    30mins for any changes to propagate.
                  </p>
                </div>

                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <TextInput
                    fieldName="Name"
                    fieldValue={this.props.startup.name}
                    isRequired={true}
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ name: updated });
                    }}
                  />
                  <TextInput
                    fieldName="City"
                    fieldValue={this.props.startup.city}
                    isRequired={true}
                    fieldDescription="What city is your startup primarily located in?"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ city: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Country"
                    fieldValue={this.props.startup.country}
                    isRequired={true}
                    fieldDescription="What country is your startup primarily located in?"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ country: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Short Description"
                    fieldValue={this.props.startup.description}
                    isRequired={true}
                    fieldDescription="Max 150 characters."
                    inputType="long"
                    maxLength="150"
                    onChange={(updated) => {
                      this.setState({ description: updated });
                    }}
                  />
                  <TextInput
                    fieldName="The Problem"
                    fieldValue={this.props.startup.problem}
                    isRequired={true}
                    fieldDescription="What is the problem that your startup is solving? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => {
                      this.setState({ problem: updated });
                    }}
                  />
                  <TextInput
                    fieldName="The Solution"
                    fieldValue={this.props.startup.solution}
                    isRequired={true}
                    fieldDescription="What is your startup's solution to this problem? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => {
                      this.setState({ solution: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Your Differentiator"
                    fieldValue={this.props.startup.different}
                    isRequired={true}
                    fieldDescription="How is your startup different to existing solutions? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => {
                      this.setState({ different: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Biggest Achievment"
                    fieldValue={this.props.startup.achievement}
                    isRequired={true}
                    fieldDescription="What is your startup's biggest achievement to date? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => {
                      this.setState({ achievement: updated });
                    }}
                  />

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Focus Areas
                      <span className="text-gray-500 text-xs font-normal">
                        {" "}
                        (optional)
                      </span>
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <fieldset>
                        {this.themes.map((theme) => {
                          return (
                            <div className="mt-1">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-teal-500 cursor-pointer form-checkbox"
                                  name="themes[]"
                                  value={theme}
                                  checked={
                                    this.state.themes.includes(theme)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      console.log("appended");
                                      const newThemes = this.state.themes.concat(
                                        [e.target.value]
                                      );
                                      this.setState({ themes: newThemes });
                                      console.log(this.state);
                                    } else {
                                      console.log("removed");
                                      const idx = this.state.themes.indexOf(
                                        theme
                                      );
                                      this.state.themes.splice(idx, 1);
                                      this.setState({
                                        themes: this.state.themes,
                                      });
                                    }
                                  }}
                                />
                                <span className="ml-3 text-sm">{theme}</span>
                              </label>
                            </div>
                          );
                        })}
                      </fieldset>
                    </div>
                  </div>

                  <TextInput
                    fieldName="Website"
                    fieldValue={this.props.startup.website}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's website?"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ website: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Contact Email"
                    fieldValue={this.props.startup.email}
                    isRequired={false}
                    fieldDescription="What is your startup's generic email? Eg. hello@, info@"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ email: updated });
                    }}
                  />
                  <TextInput
                    fieldName="LinkedIn"
                    fieldValue={this.props.startup.linkedIn}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's LinkedIn profile?"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ linkedIn: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Twitter"
                    fieldValue={this.props.startup.twitter}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's Twitter profile?"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ twitter: updated });
                    }}
                  />
                  <TextInput
                    fieldName="Facebook"
                    fieldValue={this.props.startup.facebook}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's Facebook profile?"
                    inputType="short"
                    onChange={(updated) => {
                      this.setState({ facebook: updated });
                    }}
                  />

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Logo
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                          {/* TODO: handle what is displayed when there is no image */}

                          <img src={this.props.startup.image} />
                          {/* <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg> */}
                        </span>
                        {/* <input className="hidden" type="file" onChange={onFileChange} ref={input => this.inputElement = input}/>  */}
                        <FileUpload />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="pb-6">
            <input
              type="submit"
              className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 w-48"
              value="Update Profile"
            />
          </div>
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
                      onAdd={(teamMember)=> {
                        const newTeam = [...this.state.team];
                        newTeam.unshift(teamMember)
                        console.log(newTeam)
                        this.setState({team: newTeam})
                        this.setState({addingTeamMember: false})
                      }}
                    />
                  </div>
                  {this.state.team.map((teamMember) => {
                    return (
                      <EditTeamMemberForm
                        key={teamMember.id}
                        name={teamMember.name}
                        role={teamMember.role}
                        twitter={teamMember.twitter}
                        linkedIn={teamMember.linkedIn}
                        image={teamMember.image}
                        id={teamMember.id}
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
