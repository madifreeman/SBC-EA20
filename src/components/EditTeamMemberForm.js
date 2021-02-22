import FileUpload from "../../src/components/FileUpload";
import TextInput from "../../src/components/TextInput";
import Airtable from "airtable";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import { q, client } from "../../src/fauna";

export default function EditTeamMemberForm(props) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => submitToFauna(data);
  const updateButton = useRef(null);
  const deleteButton = useRef(null);
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  });


  async function submitToFauna(data) {
    updateButton.current.value = "Updating...";

    // // Send changes to Fauna
    await client.query(
      q.Update(q.Ref(q.Collection("TeamMembers"), props.id), {
        data: data,
      })
    );
    
    // Update UI to indicate success
    // TODO: Indicate failure
    updateButton.current.value = "Updated!";
    updateButton.current.focus();
    setTimeout(() => {
      updateButton.current.value = "Update";
      updateButton.current.blur();
    }, 2500);
  }

  async function handleDelete() {
    // Remove team member from DB
    await client.query(
      q.Delete (
        q.Ref(q.Collection("TeamMembers"), props.id)
      )
    )

    // Change UI
    deleteButton.current.focus();

    props.onDelete(props.id);

    // TODO: Add animation or alert to more clearly indicate 
    // team member has been deleted 
  }

  return (
    <form className="divide-y-0" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        fieldName="Team Member's Name"
        fieldId="name"
        fieldValue={props.name}
        isRequired={true}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        fieldName="Role"
        fieldId="role"
        fieldValue={props.role}
        isRequired={true}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        fieldName="Twitter"
        fieldId="twitter"
        fieldValue={props.twitter}
        isRequired={false}
        fieldDescription=""
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        fieldName="LinkedIn"
        fieldId="linkedIn"
        fieldValue={props.linkedIn}
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
            <FileUpload currentImage={props.image} rhfRef={register} />
          </div>
        </div>
      </div>
      <div className="pb-6 flex justify-end">
        <input
          type="submit"
          className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
          value="Update"
          ref={updateButton}
        />
        <button
          className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
          onClick={() => handleDelete()}
          type="button"
          ref={deleteButton}
        >
          Delete
        </button>
      </div>
    </form>
  );
}