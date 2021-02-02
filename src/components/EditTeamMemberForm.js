import React from "react";
import FileUpload from "../../src/components/FileUpload";
import TextInput from "../../src/components/TextInput";
import ProfileImage from "../../src/components/ProfileImage";
import Airtable from "airtable";

class EditTeamMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      role: this.props.role,
      twitter: this.props.twitter,
      linkedIn: this.props.linkedIn,
      image: this.props.image,
      id: this.props.id,
    };
    this.updateBtn = React.createRef();
    this.deleteBtn = React.createRef();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  async handleUpdate(e) {
    e.preventDefault();
    // Change UI
    this.updateBtn.current.value = "Updating...";
    this.updateBtn.current.focus();

    // Update in Airtable
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    });

    const records = await airtable
      .base(process.env.AIRTABLE_BASE_ID)("Team Members ")
      .update([
        {
          id: this.state.id,
          fields: {
            Name: this.state.name,
            Photo: [
              {
                url: this.state.image,
              },
            ],
            Role: this.state.role,
            Twitter: this.state.twitter,
            LinkedIn: this.state.linkedIn,
          },
        },
      ]);

    // Change UI to indicate success // TODO: indicate failure 
    this.updateBtn.current.value = "Updated!";
    setTimeout(() => {
      this.updateBtn.current.blur();
      this.updateBtn.current.value="Update"
    }, 3000);
  }
  handleDelete() {
    // Change UI
    this.deleteBtn.current.focus();
    this.deleteBtn.current.value = "Deleted!";
    // Delete team member and reset UI after 3 secs
    setTimeout(() => {
      this.deleteBtn.current.blur();
      this.deleteBtn.current.value="Delete"
      this.props.onDelete(this.props.id);
    }, 3000);
  }
  render() {
    return (
      <form className="divide-y-0" onSubmit={this.handleUpdate}>
        <TextInput
          fieldName="Team Member's Name"
          fieldValue={this.props.name}
          isRequired={true}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ name: updated });
          }}
        />
        <TextInput
          fieldName="Role"
          fieldValue={this.props.role}
          isRequired={true}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ role: updated });
          }}
        />
        <TextInput
          fieldName="Twitter"
          fieldValue={this.props.twitter}
          isRequired={false}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ twitter: updated });
          }}
        />
        <TextInput
          fieldName="LinkedIn"
          fieldValue={this.props.linkedIn}
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
                <ProfileImage imageURL={this.state.image} />
              </span>
              <FileUpload
                currentImage={this.state.image}
                onChange={(imageURL) => {
                  this.setState({ image: imageURL });
                }}
              />
            </div>
          </div>
        </div>
        <div className="pb-6 flex justify-end">
          <input
            type="submit"
            className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
            value="Update"
            ref={this.updateBtn}
          />
          <button
            className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
            onClick={this.handleDelete}
            type="button"
            ref={this.deleteBtn}
          >
            Delete
          </button>
        </div>
      </form>
    );
  }
}

export default EditTeamMemberForm;
