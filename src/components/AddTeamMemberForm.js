import FileUpload from "../../src/components/FileUpload";
import TextInput from "../../src/components/TextInput";
import Airtable from "airtable";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";

export default function AddStartupForm(props) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) =>  submitToAirtable(data);
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
