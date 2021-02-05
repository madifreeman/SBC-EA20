import FileUpload from "../../src/components/FileUpload";
import TextInput from "../../src/components/TextInput";
import ProfileImage from "../../src/components/ProfileImage";
import Airtable from "airtable";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";

export default function AddStartupForm(props) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data, e) => {
    await submitToAirtable(data);
  };
  const addButton = useRef(null);

  async function submitToAirtable(data) {
    addButton.current.value = "Adding...";

    // Change photo field to format accepted by airtable
    if (data.Photo) {
      data.Photo = [
        {
          url: data.Photo,
        },
      ];
    }

    data.Startup = props.StartupId;
    console.log(data);

    // // Send changes to airtable
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    });

    const records = await airtable
      .base(process.env.AIRTABLE_BASE_ID)("Team Members ")
      .create([
        {
          fields: data,
        },
      ]);

    const newTeamMember = {
        id: records[0].getId(),
        name: records[0].get("Name"),
        role: records[0].get("Role"),
        image: records[0].get("Photo") ? records[0].get("Photo")[0].url : "",
        twitter: records[0].get("Twitter") || "",
        linkedIn: records[0].get("LinkedIn") || "",
      };
    // const newTeamMember = data
    props.onAdd(newTeamMember)

    // Update UI to indicate success
    // TODO: Indicate failure
    addButton.current.value = "Added!";
    addButton.current.focus();
    setTimeout(() => {
      // reset({Name: "", Role: "", Twitter: "", LinkedIn: ""})
      // // - reset() method not working when its outside of this setTimeout() 
      // // - When submitting a second version of the form, the field values 
      // // from the previous submission are displayed in the empty fields 
      // // before submitting the correct info
      addButton.current.value = "Add";
      addButton.current.blur();
    }, 2500);
  }

  return (
    <form id="form" className="divide-y-0" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        key="name"
        fieldName="Team Member's Name"
        fieldId="Name"
        isRequired={true}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        key="role"
        fieldName="Role"
        fieldId="Role"
        isRequired={true}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        key="twitter"
        fieldName="Twitter"
        fieldId="Twitter"
        isRequired={false}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        key="linkedIn"
        fieldName="LinkedIn"
        fieldId="LinkedIn"
        isRequired={false}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
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
            <FileUpload currentImage="" rhfRef={register} />
          </div>
        </div>
      </div>
      <div className="pb-6 flex justify-end">
        <input
          ref={addButton}
          type="submit"
          className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
          value="Add"
        />
        <button
          className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
          onClick={() => props.onCancel()}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

class OldAddTeamMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addButton = React.createRef();
    this.form = React.createRef();
    this.baseState = {
      name: "",
      role: "",
      linkedIn: "",
      twitter: "",
      image: "",
    };
    this.state = this.baseState;
  }
  async handleSubmit(e) {
    e.preventDefault();
    this.addButton.current.value = "Adding...";
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    });

    const records = await airtable
      .base(process.env.AIRTABLE_BASE_ID)("Team Members ")
      .create([
        {
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
            Startup: [this.props.startupId],
          },
        },
      ]);
    const newTeamMember = {
      id: records[0].getId(),
      name: records[0].get("Name"),
      role: records[0].get("Role"),
      image: records[0].get("Photo") ? records[0].get("Photo")[0].url : "",
      twitter: records[0].get("Twitter") || "",
      linkedIn: records[0].get("LinkedIn") || "",
    };
    this.addButton.current.value = "Added!";
    this.addButton.current.focus();
    setTimeout(() => {
      this.setState(this.baseState);
      this.props.onAdd(newTeamMember);
    }, 500);
  }

  render() {
    return (
      <form
        id="form"
        className="divide-y-0"
        onSubmit={this.handleSubmit}
        ref={this.form}
      >
        {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 text-gray-500 text-sm">
          Adding new team member:
        </div> */}
        <TextInput
          // Component is only re-rendering when the key changes (not when fieldValue changes) - so have linked key to state
          key={`name${this.state.name}`}
          fieldName="Team Member's Name"
          fieldValue={this.state.name}
          isRequired={true}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ name: updated });
          }}
        />
        <TextInput
          key={`role${this.state.role}`}
          fieldName="Role"
          fieldValue={this.state.role}
          isRequired={true}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ role: updated });
          }}
        />
        <TextInput
          key={`twitter${this.state.twitter}`}
          fieldName="Twitter"
          fieldValue={this.state.twitter}
          isRequired={false}
          fieldDescription=""
          inputType="short"
          onChange={(updated) => {
            this.setState({ twitter: updated });
          }}
        />
        <TextInput
          key={`linkedIn${this.state.linkedIn}`}
          fieldName="LinkedIn"
          fieldValue={this.state.linkedIn}
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
