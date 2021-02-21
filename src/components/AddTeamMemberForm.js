import FileUpload from "../../src/components/FileUpload";
import TextInput from "../../src/components/TextInput";
import Airtable from "airtable";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import { q, client } from "../../src/fauna";

export default function AddStartupForm(props) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => submitToFauna(data);
  const addButton = useRef(null);

  async function submitToFauna(data) {
    addButton.current.value = "Adding...";

    const result = await client.query(
      q.Create(q.Collection("TeamMembers"), {
        data: {
          ...data,
          startup: q.Ref(q.Collection("Startups"), props.startupId),
        },
      })
    );

    const newTeamMember = result.data;
    newTeamMember.id = result.ref.id;

    props.onAdd(newTeamMember);
    addButton.current.value = "Added!";
    addButton.current.focus();
    reset();
    // setTimeout(() => {
    //   addButton.current.blur();
    //   addButton.current.value = "Add";
    // }, 2000)
    
  }

  return (
    <div className="bg-gray-100 bg-opacity-70 rounded-lg border-2 border-gray-100 shadow-lg m-6 px-8 py-6 divide-y-0">
      <div className="font-semibold py-2">
        <h2 className="text-lg text-gray-700">Add Team Member</h2>
      </div>
      <form id="form" className="divide-y-0" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          key="name"
          fieldName="Team Member's Name"
          fieldId="name"
          isRequired={true}
          fieldDescription=""
          inputType="short"
          rhfRef={register}
        />
        <TextInput
          key="role"
          fieldName="Role"
          fieldId="role"
          isRequired={true}
          fieldDescription=""
          inputType="short"
          rhfRef={register}
        />
        <TextInput
          key="twitter"
          fieldName="Twitter"
          fieldId="twitter"
          isRequired={false}
          fieldDescription=""
          inputType="short"
          rhfRef={register}
        />
        <TextInput
          key="linkedIn"
          fieldName="LinkedIn"
          fieldId="linkedIn"
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
    </div>
  );
}
