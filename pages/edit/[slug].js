import React, { useState } from "react";
import Airtable from "airtable";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import TextInput from "../../src/components/TextInput";
import FileUpload from "../../src/components/FileUpload";
import EditTeamMemberForm from "../../src/components/EditTeamMemberForm";
import AddTeamMemberForm from "../../src/components/AddTeamMemberForm";
import ProfileImage from "../../src/components/ProfileImage";

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
    // this.state = props.startup;

    // Seperate startup details and team details into 2 seperate objects
    const { team, ...startup } = props.startup;
    // Convert team array into object with team member id as key
    let teamMembers = {};
    team.forEach((teamMember) => {
      teamMembers[teamMember.id] = teamMember;
    });
    this.state = {
      startup: startup,
      team: teamMembers,
    };
    this.state.addingTeamMember = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTeamMemberDelete = this.handleTeamMemberDelete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.updateProfileBtn = React.createRef()
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
  async handleSubmit(e) {
    e.preventDefault();
    this.updateProfileBtn.current.value = "Updating..."
    const records = await airtable
      .base(process.env.AIRTABLE_BASE_ID)("Startups")
      .update(
        [
          {
            id: this.state.startup.id,
            fields: {
              Name: this.state.startup.name,
              Photo: [
                {
                  "url": this.state.startup.image
                }
              ],
              Website: this.state.startup.website,
              Country: this.state.startup.country,
              LinkedIn: this.state.startup.linkedIn,
              Facebook: this.state.startup.facebook,
              Twitter: this.state.startup.twitter,
              Email: this.state.startup.email,
              "Short Description": this.state.startup.description,
              City: this.state.startup.city,
              Achievement: this.state.startup.achievement,
              Themes: this.state.startup.themes || [],
              Problem: this.state.startup.problem,
              Solution: this.state.startup.solution,
              Different: this.state.startup.different,
            },
          },
        ]
      );
    this.updateProfileBtn.current.value = "Updated!"
    setTimeout(() => this.updateProfileBtn.current.value = "Update Profile", 3000)
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

  handleInputChange(updatedVal, fieldId) {
    const newStartup = { ...this.state.startup };
    newStartup[`${fieldId}`] = updatedVal;
    this.setState({ startup: newStartup });
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
                    onChange={(updated) => this.handleInputChange(updated, "name")}
                  />
                  <TextInput
                    fieldName="City"
                    fieldValue={this.props.startup.city}
                    isRequired={true}
                    fieldDescription="What city is your startup primarily located in?"
                    inputType="short"
                    onChange={(updated) => this.handleInputChange(updated, "city")}
                  />
                  <TextInput
                    fieldName="Country"
                    fieldValue={this.props.startup.country}
                    isRequired={true}
                    fieldDescription="What country is your startup primarily located in?"
                    inputType="short"
                    onChange={(updated) => this.handleInputChange(updated, "country")}
                  />
                  <TextInput
                    fieldName="Short Description"
                    fieldValue={this.props.startup.description}
                    isRequired={true}
                    fieldDescription="Max 150 characters."
                    inputType="long"
                    maxLength="150"
                    onChange={(updated) => this.handleInputChange(updated, "description")}
                  />
                  <TextInput
                    fieldName="The Problem"
                    fieldValue={this.props.startup.problem}
                    isRequired={true}
                    fieldDescription="What is the problem that your startup is solving? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => this.handleInputChange(updated, "problem")}
                  />
                  <TextInput
                    fieldName="The Solution"
                    fieldValue={this.props.startup.solution}
                    isRequired={true}
                    fieldDescription="What is your startup's solution to this problem? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => this.handleInputChange(updated, "solution")}
                  />
                  <TextInput
                    fieldName="Your Differentiator"
                    fieldValue={this.props.startup.different}
                    isRequired={true}
                    fieldDescription="How is your startup different to existing solutions? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => this.handleInputChange(updated, "different")}
                  />
                  <TextInput
                    fieldName="Biggest Achievment"
                    fieldValue={this.props.startup.achievement}
                    isRequired={true}
                    fieldDescription="What is your startup's biggest achievement to date? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    onChange={(updated) => this.handleInputChange(updated, "achievement")}
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
                                    this.state.startup.themes.includes(theme)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const newThemes = this.state.startup.themes.concat(
                                        [e.target.value]
                                      );
                                      this.handleInputChange(newThemes, "themes")
                                    } else {
                                      let newThemes = [... this.state.startup.themes]
                                      const idx = newThemes.indexOf(
                                        theme
                                      );
                                      newThemes.splice(idx, 1);
                                      this.handleInputChange(newThemes, "themes")
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
                    onChange={(updated) => this.handleInputChange(updated, "website")}
                  />
                  <TextInput
                    fieldName="Contact Email"
                    fieldValue={this.props.startup.email}
                    isRequired={false}
                    fieldDescription="What is your startup's generic email? Eg. hello@, info@"
                    inputType="short"
                    onChange={(updated) => this.handleInputChange(updated, "email")}
                  />
                  <TextInput
                    fieldName="LinkedIn"
                    fieldValue={this.props.startup.linkedIn}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's LinkedIn profile?"
                    inputType="short"
                    onChange={(updated) => this.handleInputChange(updated, "linkedIn")}
                  />
                  <TextInput
                    fieldName="Twitter"
                    fieldValue={this.props.startup.twitter}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's Twitter profile?"
                    inputType="short"
                    onChange={(updated) => this.handleInputChange(updated, "twitter")}
                  />
                  <TextInput
                    fieldName="Facebook"
                    fieldValue={this.props.startup.facebook}
                    isRequired={false}
                    fieldDescription="What is the url of your startup's Facebook profile?"
                    inputType="short"
                    onChange={(updated) => this.handleInputChange(updated, "facebook")}
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
                          <ProfileImage imageURL={this.state.startup.image}/>
                        </span>
                        <FileUpload currentImage={this.state.startup.image} onChange={(imageURL)=> {
                            this.handleInputChange(imageURL, "image")
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6">
              <input
                type="submit"
                className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 w-48"
                value="Update Profile"
                ref={this.updateProfileBtn}
              />
            </div>
          </form>
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
