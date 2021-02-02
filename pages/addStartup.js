import React, { useState } from "react";
import Airtable from "airtable";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import TextInput from "../src/components/TextInput";
import FileUpload from "../src/components/FileUpload";
import EditTeamMemberForm from "../src/components/EditTeamMemberForm";
import AddTeamMemberForm from "../src/components/AddTeamMemberForm";
import ProfileImage from "../src/components/ProfileImage";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

class AddStartup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { startup: {}, team: {} };
    this.state.addingTeamMember = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTeamMemberDelete = this.handleTeamMemberDelete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.startupDetailsForm = React.createRef();
    this.teamDetailsForm = React.createRef();
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
    this.startupDetailsForm.current.className = "hidden";
    window.scrollTo(0, 0)
    this.teamDetailsForm.current.className = "block";
    console.log(this.state.startup.name);
    const records = await airtable
      .base(process.env.AIRTABLE_BASE_ID)("Startups")
      .create([
        {
          fields: {
            Name: this.state.startup.name,
            Photo: [
              {
                "url": this.state.startup.image
              }
            ],
            Website: this.state.startup.website || "",
            Country: this.state.startup.country,
            LinkedIn: this.state.startup.linkedIn || "",
            Facebook: this.state.startup.facebook || "",
            Twitter: this.state.startup.twitter || "",
            Email: this.state.startup.email || "",
            "Short Description": this.state.startup.description,
            City: this.state.startup.city,
            Achievement: this.state.startup.achievement,
            Themes: this.state.startup.themes || [],
            Problem: this.state.startup.problem,
            Solution: this.state.startup.solution,
            Different: this.state.startup.different,
          },
        },
      ]);
    const newStartup = { ...this.state.startup };
    newStartup.id = records[0].getId();
    newStartup.slug = records[0].get("Slug");
    this.setState({ startup: newStartup });
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
                Add Startup
              </h1>
            </div>
          </div>
        </div>
        <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
          <div ref={this.startupDetailsForm}>
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
                      isRequired={true}
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "name")
                      }
                    />
                    <TextInput
                      fieldName="City"
                      isRequired={true}
                      fieldDescription="What city is your startup primarily located in?"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "city")
                      }
                    />
                    <TextInput
                      fieldName="Country"
                      isRequired={true}
                      fieldDescription="What country is your startup primarily located in?"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "country")
                      }
                    />
                    <TextInput
                      fieldName="Short Description"
                      isRequired={true}
                      fieldDescription="Max 150 characters."
                      inputType="long"
                      maxLength="150"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "description")
                      }
                    />
                    <TextInput
                      fieldName="The Problem"
                      isRequired={true}
                      fieldDescription="What is the problem that your startup is solving? Max 500 characters."
                      inputType="long"
                      maxLength="500"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "problem")
                      }
                    />
                    <TextInput
                      fieldName="The Solution"
                      isRequired={true}
                      fieldDescription="What is your startup's solution to this problem? Max 500 characters."
                      inputType="long"
                      maxLength="500"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "solution")
                      }
                    />
                    <TextInput
                      fieldName="Your Differentiator"
                      isRequired={true}
                      fieldDescription="How is your startup different to existing solutions? Max 500 characters."
                      inputType="long"
                      maxLength="500"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "different")
                      }
                    />
                    <TextInput
                      fieldName="Biggest Achievment"
                      isRequired={true}
                      fieldDescription="What is your startup's biggest achievement to date? Max 500 characters."
                      inputType="long"
                      maxLength="500"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "achievement")
                      }
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
                                      this.state.startup.themes &&
                                      this.state.startup.themes.includes(theme)
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        let newThemes;
                                        // If themes has already been written to state
                                        if (this.state.startup.themes) {
                                          newThemes = this.state.startup.themes.concat(
                                            [e.target.value]
                                          );
                                        } else {
                                          newThemes = [e.target.value];
                                        }
                                        this.handleInputChange(
                                          newThemes,
                                          "themes"
                                        );
                                      } else {
                                        let newThemes = [
                                          ...this.state.startup.themes,
                                        ];
                                        const idx = newThemes.indexOf(theme);
                                        newThemes.splice(idx, 1);
                                        this.handleInputChange(
                                          newThemes,
                                          "themes"
                                        );
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
                      isRequired={false}
                      fieldDescription="What is the url of your startup's website?"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "website")
                      }
                    />
                    <TextInput
                      fieldName="Contact Email"
                      isRequired={false}
                      fieldDescription="What is your startup's generic email? Eg. hello@, info@"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "email")
                      }
                    />
                    <TextInput
                      fieldName="LinkedIn"
                      isRequired={false}
                      fieldDescription="What is the url of your startup's LinkedIn profile?"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "linkedIn")
                      }
                    />
                    <TextInput
                      fieldName="Twitter"
                      isRequired={false}
                      fieldDescription="What is the url of your startup's Twitter profile?"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "twitter")
                      }
                    />
                    <TextInput
                      fieldName="Facebook"
                      isRequired={false}
                      fieldDescription="What is the url of your startup's Facebook profile?"
                      inputType="short"
                      onChange={(updated) =>
                        this.handleInputChange(updated, "facebook")
                      }
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
                            <ProfileImage imageURL={this.state.startup.image}/>
                            
                          </span>
                          <FileUpload currentImage={this.state.startup.image} onChange={(imageURL)=> {
                            this.handleInputChange(imageURL, "image")
                          }}/>
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
                  value="Continue"
                />
              </div>
            </form>
          </div>
          {/* ######################################### EDIT TEAM ######################################### */}
          <div className="hidden" ref={this.teamDetailsForm}>
            <div className="pt-4 flex justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add Team Member
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Add your team members' details.
                </p> */}
              </div>
              <div></div>
            </div>
            <div className="space-y-8 divide-y divide-gray-200 w-full">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <div>
                    <div
                    // className={`${
                    //   !this.state.addingTeamMember ? "hidden" : "block"
                    // }`}
                    >
                      <AddTeamMemberForm
                        key="AddTeamMemberForm"
                        startupId={this.state.startup.id}
                        onCancel={() => {
                          this.setState({
                            addingTeamMember: !this.state.addingTeamMember,
                          });
                        }}
                        onAdd={(teamMember) => {
                          // console.log(teamMember)
                          // console.log(teamMember.id)
                          const newTeam = { ...this.state.team };
                          newTeam[teamMember.id] = teamMember;
                          console.log(newTeam);
                          this.setState({ team: newTeam });
                          this.setState({ addingTeamMember: false });
                        }}
                      />
                    </div>

                    <h3
                      className={`${
                        Object.keys(this.state.team).length > 0
                          ? "block"
                          : "hidden"
                      } text-lg leading-6 font-medium text-gray-900 mt-8`}
                    >
                      Current Team Members
                    </h3>
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
            <div className="mt-12 flex flex-wrap">
              <a
                href={`/startup/${this.state.startup.slug}`}
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
                    .destroy([this.state.startup.id])
                    .then(()=>{
                      window.location.href = "/manageStartups"
                    })
                }}
                // TODO: delete team members from Team Members DB
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default AddStartup;
