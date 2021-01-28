import React from "react";
import FileUpload from "../../src/components/FileUpload";
import TextInput from "../../src/components/TextInput";
import Airtable from "airtable";

class AddTeamMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      role: "",
      twitter: "",
      linkedIn: "",
      photo: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addButton = React.createRef();
    // this.handleDelete = this.handleDelete.bind(this);
  }
  async handleSubmit(e) {
    e.preventDefault();

    const newTeamMember = {
      Name: this.state.name,
      Photo: "",
      Role: this.state.role,
      Twitter: this.state.twitter,
      LinkedIn: this.state.linkedIn,
    };
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    });

    await airtable
      .base(process.env.AIRTABLE_BASE_ID)("Team Members ")
      .create(
        [
          {
            fields: {
              ...newTeamMember,
              Startup: [this.props.startupId],
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.error(err);
            return;
          }

          newTeamMember["Id"] = records[0].getId();
        }
      );
    console.log(newTeamMember)
    this.addButton.current.value = "Added!";
    this.addButton.current.focus();
    setTimeout(()=> this.props.onAdd(newTeamMember), 500)
  }

  render() {
    return (
      <form className="divide-y-0" onSubmit={this.handleSubmit}>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 text-gray-500 text-sm">
          Adding new team member:
        </div>
        <TextInput
          fieldName="Team Member's Name"
          //   fieldValue={this.props.teamMember.name}
          isRequired={true}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ name: updated });
          }}
        />
        <TextInput
          fieldName="Role"
          //   fieldValue={this.props.teamMember.role}
          isRequired={true}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ role: updated });
          }}
        />
        <TextInput
          fieldName="Twitter"
          //   fieldValue={this.props.teamMember.twitter}
          isRequired={false}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ twitter: updated });
          }}
        />
        <TextInput
          fieldName="LinkedIn"
          isRequired={false}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ linkedIn: updated });
          }}
        />
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700"
          >
            Photo
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="flex items-center">
              <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                {/* TODO: handle what is displayed when there is no image */}

                <img src="" />
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
        <div className="pb-6 flex justify-end">
          <input
            ref={this.addButton}
            type="submit"
            className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
            value="Add"
          />
          <button
            className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
            onClick={() => this.props.onCancel()}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }
}

export default AddTeamMemberForm;
